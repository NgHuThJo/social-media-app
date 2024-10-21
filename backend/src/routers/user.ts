import { z } from "zod";
import { userService } from "#backend/services/user.js";
import { publicProcedure, router } from "./trpc.js";
import { logError } from "#backend/utils/error-logger.js";
import {
  emailSchema,
  nameSchema,
  nonEmptyStringSchema,
  stringToNumberSchema,
  passwordSchema,
  urlSchema,
  positiveNumberSchema,
} from "#backend/types/zod.js";

export const userRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        const user = await userService.getUser(userId);

        return user;
      } catch (error) {
        logError(error);
      }
    }),

  getListOfUsers: publicProcedure
    .input(
      z.object({
        userIdList: z.array(z.number()),
      }),
    )
    .query(async ({ input }) => {
      const { userIdList } = input;

      try {
        const users = await userService.getListOfUsers(userIdList);

        return users;
      } catch (error) {
        logError(error);
      }
    }),

  getAllUsers: publicProcedure.query(async () => {
    try {
      const users = await userService.getAllUsers();

      return users;
    } catch (error) {
      logError(error);
    }
  }),

  getAllOtherUsers: publicProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: positiveNumberSchema,
            hasMore: z.boolean(),
          })
          .nullable(),
        userId: stringToNumberSchema,
        limit: positiveNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId, cursor, limit } = input;

      try {
        const otherUsers = await userService.getAllOtherUsers(
          userId,
          cursor,
          limit,
        );

        return otherUsers;
      } catch (error) {
        logError(error);
      }
    }),

  getAllOnlineUsers: publicProcedure.query(async ({ ctx }) => {
    const { socketService } = ctx;

    try {
      const onlineUserIds = socketService.getOnlineUserList();
      const onlineUsers = await userService.getListOfUsers(onlineUserIds);

      return onlineUsers;
    } catch (error) {
      logError(error);
    }
  }),

  registerUser: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        firstName: nameSchema,
        lastName: nameSchema,
        displayName: nameSchema,
        password: passwordSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { email, firstName, lastName, displayName, password } = input;

      try {
        const newUser = await userService.registerUser(
          email,
          firstName,
          lastName,
          displayName,
          password,
        );

        return newUser;
      } catch (error) {
        logError(error);
      }
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        assetUrl: urlSchema,
        publicId: nonEmptyStringSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { assetUrl, publicId, userId } = input;

      try {
        const updatedUser = await userService.updateUser(
          assetUrl,
          publicId,
          userId,
        );

        return updatedUser;
      } catch (error) {
        logError(error);
      }
    }),

  followUser: publicProcedure
    .input(
      z.object({
        followsId: stringToNumberSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { userId, followsId } = input;

      const isfollows = await userService.followUser(userId, followsId);

      return isfollows;
    }),
});
