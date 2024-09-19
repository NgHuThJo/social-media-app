import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { chatService } from "@backend/services/chat";
import { logError } from "@backend/utils/error-logger";
import { nonEmptyStringSchema, numericIdSchema } from "@backend/types/zod";

export const chatRouter = router({
  createChatroom: publicProcedure
    .input(
      z.object({
        title: nonEmptyStringSchema,
        userId: numericIdSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, title } = input;
      const { socketService } = ctx;

      try {
        const newChatroom = await chatService.createChatroom(title);
        socketService.joinRoom(userId, newChatroom.id);
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
