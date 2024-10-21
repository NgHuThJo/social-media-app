import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";
import { friendService } from "#backend/services/friend.js";
import { logError } from "#backend/utils/error-logger.js";
import {
  friendRequestSchema,
  stringToNumberSchema,
} from "#backend/types/zod.js";

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
