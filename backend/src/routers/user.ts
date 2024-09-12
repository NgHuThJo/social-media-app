import { z } from "zod";
import { userService } from "@backend/services/user";
import { publicProcedure, router } from "./trpc";
import { logError } from "@backend/utils/error-logger";

export const userRouter = router({
  getUser: publicProcedure
    .input(z.number().gt(0, "Invalid userId"))
    .query(async ({ input }) => {
      try {
        const user = await userService.getUser(input);

        return user;
      } catch (error) {
        logError(error);
      }
    }),

  getListOfUsers: publicProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      try {
        const users = await userService.getListOfUsers(input);

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
    .input(z.number().gt(0, "Invalid userId"))
    .query(async ({ input }) => {
      try {
        const otherUsers = await userService.getAllOtherUsers(input);

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
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newUser = await userService.registerUser(
          input.email,
          input.name,
          input.password,
        );
        return newUser;
      } catch (error) {
        logError(error);
      }
    }),
});
