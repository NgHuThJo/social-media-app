import { prisma } from "@backend/models";
import { AppError } from "@backend/utils/app-error";

class ChatService {
  async createChatroom(title: string) {
    return await prisma.chatroom.create({
      data: {
        title,
      },
    });
  }

  async getAllChatrooms() {
    const allChatrooms = await prisma.chatroom.findMany();

    return allChatrooms;
  }
}

export const chatService = new ChatService();
