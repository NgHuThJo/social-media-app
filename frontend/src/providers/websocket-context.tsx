import { createContext, PropsWithChildren, useMemo } from "react";
import { useContextWrapper } from "@frontend/utils/context";
import { useWebSocket } from "@frontend/hooks/useWebSocket";

type WebSocketContextApiType = {
  connect: (userId: string) => void;
  disconnect: (userId: string) => void;
  emit: <T>(event: string, data: T) => void;
  subscribe: <T>(event: string, callback: (data: T) => void) => () => void;
} | null;

const WebSocketContextApi = createContext<WebSocketContextApiType>(null);

export const useWebSocketContextApi = () =>
  useContextWrapper<WebSocketContextApiType>(
    WebSocketContextApi,
    "WebSocketContextApi is null",
  );

export function WebSocketContextProvider({ children }: PropsWithChildren) {
  const {
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    emit: emitWebSocketEvent,
    on,
    off,
  } = useWebSocket();

  const api = useMemo(() => {
    const connect = (userId: string) => {
      connectWebSocket(userId);
    };
    const disconnect = (userId: string) => {
      disconnectWebSocket(userId);
    };
    const emit = <T,>(event: string, data: T) => {
      emitWebSocketEvent(event, data);
    };
    const subscribe = <T,>(event: string, callback: (data: T) => void) => {
      on(event, callback);

      return () => off(event, callback);
    };

    return { connect, disconnect, emit, subscribe };
  }, []);

  return (
    <WebSocketContextApi.Provider value={api}>
      {children}
    </WebSocketContextApi.Provider>
  );
}
