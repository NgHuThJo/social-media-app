import { z } from "zod";
import { messageService } from "@backend/services/message";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";

export const messageRouter = router({
  createMessage: publicProcedure
    .input(
      z.object({
        content: z.string().min(1, "No empty content"),
        userId: z.number().gt(0, "Invalid userId"),
        roomId: z.number().gt(0, "Invalid roomId"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { content, roomId, userId } = input;
      const { socketService } = ctx;

      try {
        await messageService.createMessage(content, userId, roomId);
        const allRoomMessages = await messageService.getAllRoomMessages(roomId);
        socketService.io
          .in(String(roomId))
          .emit("chatMessage", allRoomMessages);

        return allRoomMessages;
      } catch (error) {
        logError(error);
      }
    }),

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
