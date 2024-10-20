import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { friendService } from "#backend/services/friend";
import { logError } from "#backend/utils/error-logger";
import { friendRequestSchema, stringToNumberSchema } from "#backend/types/zod";

export const friendRouter = router({
  getAllFriends: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        const friends = await friendService.getAllFriends(userId);

        return friends;
      } catch (error) {
        logError(error);
      }
    }),

  updateFriendshipStatus: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
        friendId: stringToNumberSchema,
        action: friendRequestSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { action, userId, friendId } = input;

      try {
        const status = await friendService.updateFriendship(
          userId,
          friendId,
          action,
        );

        return status;
      } catch (error) {
        logError(error);
      }
    }),
});
