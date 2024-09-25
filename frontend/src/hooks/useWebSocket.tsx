import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket() {
  const [isSocketReady, setIsSocketReady] = useState(false);
  const socket = useRef<Socket>();

  const connect = (userId: string) => {
    if (socket.current?.connected) {
      console.log("Socket already connected, skipping re-connection");
      return;
    }

    socket.current = io(import.meta.env.VITE_WEBSOCKET_URL, {
      reconnectionAttempts: 3,
    });

    const handleConnect = () => {
      console.log("Connected to WebSocket server");
      socket.current?.emit("login", userId);
      setIsSocketReady(true);
    };
    const handleDisconnect = () => {
      console.log("Disconnected from WebSocket server");
      cleanUpListeners();
      setIsSocketReady(false);
    };
    const handleConnectError = (error: Error) => {
      console.error("Connection error:", error.message);
    };
    const handleLogin = (data: string) => {
      console.log(data);
    };
    const handleLogout = (data: string) => {
      console.log(data);
    };

    socket.current.on("connect", handleConnect);
    socket.current.on("disconnect", handleDisconnect);
    socket.current.on("connect_error", handleConnectError);
    socket.current.on("login", handleLogin);
    socket.current.on("logout", handleLogout);

    return () => {
      socket.current?.off("connect", handleConnect);
      socket.current?.off("disconnect", handleDisconnect);
      socket.current?.off("connect_error", handleConnectError);
      socket.current?.off("login", handleLogin);
      socket.current?.off("logout", handleLogout);
    };
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
    console.log("Cleaned up all WebSocket event listeners");
  };

  return { isSocketReady, connect, disconnect, emit, on, off };
}
