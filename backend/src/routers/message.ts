import { z } from "zod";
import { messageService } from "@backend/services/message";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";

export const messageRouter = router({
  getAllRoomMessages: publicProcedure
    .input(z.number().gt(0))
    .query(async ({ input }) => {
      try {
        const messages = await messageService.getAllRoomMessages(input);

        return messages;
      } catch (error) {
        logError(error);
      }
    }),
});
