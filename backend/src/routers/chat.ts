import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { chatService } from "@backend/services/chat";
import { logError } from "@backend/utils/error-logger";

export const chatRouter = router({
  createChatroom: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        id: z.number().gt(0),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, title } = input;
      const { socketService } = ctx;

      try {
        const newChatroom = await chatService.createChatroom(title);
        const allChatrooms = await chatService.getAllChatrooms();
        socketService.joinRoom(id, newChatroom.id);
        socketService.broadcast("createChatroom", allChatrooms, id);

        return allChatrooms;
      } catch (error) {
        logError(error);
      }
    }),

  getAllChatrooms: publicProcedure.query(async () => {
    try {
      const chatrooms = await chatService.getAllChatrooms();

      return chatrooms;
    } catch (error) {
      logError(error);
    }
  }),
});
