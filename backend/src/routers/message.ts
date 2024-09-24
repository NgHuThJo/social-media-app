import { z } from "zod";
import { messageService } from "@backend/services/message";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";
import { nonEmptyStringSchema, stringToNumberSchema } from "@backend/types/zod";

export const messageRouter = router({
  createMessage: publicProcedure
    .input(
      z.object({
        content: nonEmptyStringSchema,
        userId: stringToNumberSchema,
        roomId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { content, roomId, userId } = input;
      const { socketService } = ctx;

      try {
        await messageService.createMessage(content, userId, roomId);
        const allRoomMessages = await messageService.getAllRoomMessages(roomId);
        socketService.emitInRoom(
          "chatMessage",
          allRoomMessages,
          String(roomId),
        );

        return allRoomMessages;
      } catch (error) {
        logError(error);
      }
    }),

  getAllRoomMessages: publicProcedure
    .input(
      z.object({
        roomId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { roomId } = input;

      try {
        const messages = await messageService.getAllRoomMessages(roomId);

        return messages;
      } catch (error) {
        logError(error);
      }
    }),
});
