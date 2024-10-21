import { prisma } from "#backend/models/index.js";

class ChatService {
  async createChatroom(title: string) {
    return await prisma.chatroom.create({
      data: {
        title,
      },
    });
  }

  async getAllChatrooms() {
    return await prisma.chatroom.findMany();
  }
}

export const chatService = new ChatService();
