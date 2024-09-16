import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { userService } from "./user";
import logger from "@shared/utils/logger";

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

  get io() {
    return this.#io;
  }

  get onlineUsers() {
    return this.#onlineUsers;
  }

  getOnlineUserList() {
    return Array.from(this.onlineUsers.keys());
  }

  #setupListeners() {
    this.#io.on("connect", (socket) => {
      logger.debug("A user connected");

      socket.on("login", async (data) => {
        this.addUser(data.userId, socket);

        const onlineUserIds = this.getOnlineUserList();
        const onlineUsers = await userService.getListOfUsers(onlineUserIds);
        socket.broadcast.emit(
          "notification",
          `UserId ${data.userId} logged in`,
        );
        socket.broadcast.emit("getOnlineUsers", onlineUsers);
        this.#io.emit("login", `UserId ${data.userId} logged in`);
      });

      socket.on("logout", async (data) => {
        this.removeUser(data.userId);

        const onlineUserIds = this.getOnlineUserList();
        const onlineUsers = await userService.getListOfUsers(onlineUserIds);
        socket.broadcast.emit(
          "notification",
          `UserId ${data.userId} logged out`,
        );
        socket.broadcast.emit("getOnlineUsers", onlineUsers);
        this.#io.emit("logout", `UserId ${data.userId} logged out`);
      });

      socket.once("disconnect", () => {
        logger.debug("A user disconnected");
      });

      socket.on("joinChatroom", (data) => {
        const { userId, currentRoomId, newRoomId } = data;

        this.leaveRoom(userId, currentRoomId);
        this.joinRoom(userId, newRoomId);
        socket
          .to(newRoomId)
          .emit(
            "notification",
            `User "${userId} has joined room "${newRoomId}"`,
          );
      });
    });
  }

  addUser(userId: number, socket: Socket) {
    this.#onlineUsers.set(userId, socket);
  }

  removeUser(userId: number) {
    this.#onlineUsers.delete(userId);
  }

  joinRoom(userId: number, roomId: number) {
    const convertedRoomId = String(roomId);
    this.#onlineUsers.get(userId)?.join(convertedRoomId);
  }

  leaveRoom(userId: number, roomId: number) {
    const convertedRoomId = String(roomId);
    this.#onlineUsers.get(userId)?.leave(convertedRoomId);
  }

  broadcast(event: string, data: any, userId: number) {
    this.#onlineUsers.get(userId)?.broadcast.emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.#io.emit(event, data);
  }
}
