import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { friendService } from "@backend/services/friend";
import { logError } from "@backend/utils/error-logger";
import { stringToNumberSchema } from "@backend/types/zod";

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
});
