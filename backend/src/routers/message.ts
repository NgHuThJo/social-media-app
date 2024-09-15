import { z } from "zod";
import { messageService } from "@backend/services/message";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";
import {
  nonEmptyStringSchema,
  numericIdSchema,
} from "@backend/utils/zod-schema";

export const messageRouter = router({
  createMessage: publicProcedure
    .input(
      z.object({
        content: nonEmptyStringSchema,
        userId: numericIdSchema,
        roomId: numericIdSchema,
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
    .input(
      z.object({
        roomId: numericIdSchema,
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
