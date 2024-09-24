import { useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket() {
  const socket = useRef<Socket>();

  const connect = (userId: string) => {
    if (socket.current) {
      console.log("WebSocket is still connected");
      return;
    }

    socket.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      reconnectionAttempts: 3,
    });

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.current?.emit("login", userId);
    });
    socket.current.on("disconnect", () => {
      cleanUpListeners();
    });
    socket.current.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });
    socket.current.on("login", (data: string) => {
      console.log(data);
    });
    socket.current.on("logout", (data: string) => {
      console.log(data);
    });
  };
  const disconnect = (userId: string) => {
    socket.current?.emit("logout", userId);
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
    console.log("WebSocket disconnected, cleaned up listeners");
  };

  return { connect, disconnect, emit, on, off };
}
