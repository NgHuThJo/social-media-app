import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";
import { chatService } from "#backend/services/chat.js";
import { logError } from "#backend/utils/error-logger.js";
import {
  nonEmptyStringSchema,
  stringToNumberSchema,
} from "#backend/types/zod.js";

export const chatRouter = router({
  createChatroom: publicProcedure
    .input(
      z.object({
        title: nonEmptyStringSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, title } = input;
      const { socketService } = ctx;

      try {
        const newChatroom = await chatService.createChatroom(title);
        socketService.joinRoom(userId, String(newChatroom.id));
        const allChatrooms = await chatService.getAllChatrooms();
        socketService.broadcast("createChatroom", allChatrooms, userId);

        return allChatrooms;
      } catch (error) {
        logError(error);
      }
    }),

  getAllChatrooms: publicProcedure.query(async () => {
    try {
      const allChatrooms = await chatService.getAllChatrooms();

      return allChatrooms;
    } catch (error) {
      logError(error);
    }
  }),
});
