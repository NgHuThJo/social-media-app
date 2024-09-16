import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { friendService } from "@backend/services/friend";
import { logError } from "@backend/utils/error-logger";
import { numericIdSchema } from "@backend/types/zod-schema";

export const friendRouter = router({
  getAllFriends: publicProcedure
    .input(
      z.object({
        userId: numericIdSchema,
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
