import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { z } from "zod";
import { userService } from "./user";
import logger from "@shared/utils/logger";
import { numericStringSchema, stringToNumberSchema } from "@backend/types/zod";

export type SocketServiceType = typeof SocketService;

export class SocketService {
  #onlineUsers: Map<number, Socket>;
  #io: SocketIOServer;

  constructor(server: HttpServer) {
    this.#io = new SocketIOServer(server, {
      cors: {
        origin: process.env.PROXY_URL || "http://localhost:5173",
        credentials: true,
      },
    });
    this.#onlineUsers = new Map();

    this.#setupListeners();
  }

  #setupListeners() {
    this.#io.on("connect", (socket) => {
      logger.debug("A user connected");

      socket.on("disconnect", () => {
        logger.debug("A user disconnected");
      });

      socket.on("login", async (data: string) => {
        try {
          const parsedData = stringToNumberSchema.parse(data);
          this.addUser(parsedData, socket);
          const onlineUserIds = this.getOnlineUserList();
          const onlineUsers = await userService.getListOfUsers(onlineUserIds);
          this.#io.emit("login", `UserId ${parsedData} logged in`);
          socket.broadcast.emit(
            "notification",
            `UserId ${parsedData} logged in`,
          );
          socket.broadcast.emit("getOnlineUsers", onlineUsers);
        } catch (error) {
          logger.debug(error);
        }
      });

      socket.on("logout", async (data: string) => {
        try {
          const parsedData = stringToNumberSchema.parse(data);
          const onlineUserIds = this.getOnlineUserList();
          const onlineUsers = await userService.getListOfUsers(onlineUserIds);
          this.#io.emit("logout", `UserId ${parsedData} logged out`);
          socket.broadcast.emit(
            "notification",
            `UserId ${parsedData} logged out`,
          );
          socket.broadcast.emit("getOnlineUsers", onlineUsers);
        } catch (error) {
          logger.debug(error);
        }
      });

      socket.on(
        "joinChatroom",
        (data: {
          userId: string;
          currentRoomId: string;
          newRoomId: string;
        }) => {
          try {
            const { userId, currentRoomId, newRoomId } = z
              .object({
                userId: stringToNumberSchema,
                currentRoomId: numericStringSchema,
                newRoomId: numericStringSchema,
              })
              .parse(data);

            this.leaveRoom(userId, currentRoomId);
            this.joinRoom(userId, newRoomId);
            socket
              .to(newRoomId)
              .emit(
                "notification",
                `User "${userId} has joined room "${newRoomId}"`,
              );
          } catch (error) {
            logger.debug(error);
          }
        },
      );
    });
  }

  addUser(userId: number, socket: Socket) {
    this.#onlineUsers.set(userId, socket);
  }

  removeUser(userId: number) {
    this.#onlineUsers.delete(userId);
  }

  getOnlineUserList() {
    return Array.from(this.#onlineUsers.keys());
  }

  joinRoom(userId: number, roomId: string) {
    this.#onlineUsers.get(userId)?.join(roomId);
  }

  leaveRoom(userId: number, roomId: string) {
    this.#onlineUsers.get(userId)?.leave(roomId);
  }

  broadcast<T>(event: string, data: T, userId: number) {
    this.#onlineUsers.get(userId)?.broadcast.emit(event, data);
  }

  emit<T>(event: string, data: T, userId: number) {
    this.#onlineUsers.get(userId)?.emit(event, data);
  }

  emitToAll<T>(event: string, data: T) {
    this.#io.emit(event, data);
  }

  broadcastInRoom<T>(event: string, data: T, userId: number, roomId: string) {
    this.#onlineUsers.get(userId)?.to(roomId).emit(event, data);
  }

  emitInRoom<T>(event: string, data: T, roomId: string) {
    this.#io.in(roomId).emit(event, data);
  }
}
