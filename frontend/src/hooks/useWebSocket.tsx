import { useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket() {
  const socket = useRef<Socket>();

  const connect = (userId: string) => {
    if (socket.current) {
      console.log("Socket is still active");
      return;
    }

    socket.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      reconnectionAttempts: 3,
    });

    const convertedId = Number(userId);

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.current.on("disconnect", () => {
      cleanUpListeners();
      console.log("Disconnected from WebSocket server");
    });
    socket.current.emit("login", { userId: convertedId });
    socket.current.on("login", (data) => {
      console.log(data);
    });
    socket.current.on("logout", (data) => {
      console.log(data);
    });
  };
  const disconnect = (userId: string) => {
    const convertedId = Number(userId);

    socket.current?.emit("logout", { userId: convertedId });
    socket.current?.disconnect();
    socket.current = undefined;
  };

  const emit = <T,>(event: string, data: T) => {
    socket.current?.emit(event, data);
  };
  const on = <T,>(event: string, callback: (data: T) => void) => {
    socket.current?.on(event, callback);
  };
  const off = <T,>(event: string, callback: (data: T) => void) => {
    socket.current?.off(event, callback);
  };

  const cleanUpListeners = () => {
    socket.current?.removeAllListeners();
    console.log("Websocket disconnected, cleaned up listeners");
  };

  return { connect, disconnect, emit, on, off };
}
