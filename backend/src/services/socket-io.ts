import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { messageService } from "./message";
import { userService } from "./user";
import { messageRouter } from "@backend/routers/message";

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
    this.#io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("login", async (data) => {
        this.addUser(data.userId, socket);

        const onlineUserIds = this.getOnlineUserList();
        const onlineUsers = await userService.getListOfUsers(onlineUserIds);
        this.#io.emit("login", `UserId ${data.userId} logged in`);
        this.#io.emit("getOnlineUsers", onlineUsers);
      });

      socket.on("logout", async (data) => {
        this.removeUser(data.userId);

        const onlineUserIds = this.getOnlineUserList();
        const onlineUsers = await userService.getListOfUsers(onlineUserIds);
        this.#io.emit("logout", `UserId ${data.userId} logged out`);
        socket.broadcast.emit("getOnlineUsers", onlineUsers);
      });

      socket.once("close", () => {
        console.log("A user disconnected");
      });

      socket.on("joinRoom", (data) => {
        const { id, roomId } = data;
        this.joinRoom(id, roomId);

        socket
          .to(roomId)
          .emit("joinRoom", `User "${id}" has joined room "${roomId}"`);
      });

      socket.on("chatMessage", async (data) => {
        const { message, id, roomId } = data;
        const newMessage = await messageService.createMessage(
          message,
          id,
          roomId,
        );
        const allRoomMessages = await messageService.getAllRoomMessages(roomId);
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

  leaveRoom(userId: number, roomName: string) {
    this.#onlineUsers.get(userId)?.leave(roomName);
  }

  broadcast(event: string, data: any, userId: number) {
    this.#onlineUsers.get(userId)?.broadcast.emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.#io.emit(event, data);
  }
}
