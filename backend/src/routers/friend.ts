import { z } from "zod";
import { friendService } from "@backend/services/friend";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";

export const friendRouter = router({
  getAllFriends: publicProcedure
    .input(z.number().gt(0))
    .query(async ({ input }) => {
      try {
        const friends = await friendService.getAllFriends(input);

        return friends;
      } catch (error) {
        logError(error);
      }
    }),
});
