import { prisma } from "#backend/models/index.js";

class MessageService {
  async getAllRoomMessages(roomId: number) {
    return await prisma.message.findMany({
      where: {
        chatroomId: roomId,
      },
      include: {
        author: true,
      },
    });
  }

  async createMessage(message: string, authorId: number, roomId: number) {
    return await prisma.message.create({
      data: {
        content: message,
        author: {
          connect: {
            id: authorId,
          },
        },
        chatroom: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }
}

export const messageService = new MessageService();
