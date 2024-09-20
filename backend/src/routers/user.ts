import { z } from "zod";
import { userService } from "@backend/services/user";
import { publicProcedure, router } from "./trpc";
import { logError } from "@backend/utils/error-logger";
import {
  emailSchema,
  nameSchema,
  nonEmptyStringSchema,
  numericIdSchema,
  passwordSchema,
  urlSchema,
} from "@backend/types/zod";

export const userRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        userId: numericIdSchema,
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
        userId: numericIdSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        const otherUsers = await userService.getAllOtherUsers(userId);

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
        name: nameSchema,
        password: passwordSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { email, name, password } = input;

      try {
        const newUser = await userService.registerUser(email, name, password);

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
        userId: numericIdSchema,
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

        console.log(updatedUser);

        return updatedUser;
      } catch (error) {
        logError(error);
      }
    }),
});
