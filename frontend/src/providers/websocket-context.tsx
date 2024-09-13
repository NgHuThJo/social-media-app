import {
  createContext,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { useContextWrapper } from "@frontend/utils/context";
import {
  ChatroomType,
  OnlineUserType,
} from "@frontend/features/chat/components/layout/layout";
import { RoomMessagesType } from "@frontend/features/chat/components/box/box";

type WebSocketContextType = {
  socket: MutableRefObject<Socket | undefined>;
} | null;

type WebSocketContextApiType = {
  createWebSocket: (userId: string) => void;
  createChatroom: (
    setChatrooms: Dispatch<SetStateAction<ChatroomType>>,
  ) => () => void;
  createMessage: (
    setMessages: Dispatch<SetStateAction<RoomMessagesType>>,
  ) => () => void;
  getOnlineUsers: (
    setOnlineUsers: Dispatch<SetStateAction<OnlineUserType>>,
  ) => () => void;
  joinChatroom: (
    userId: string,
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => void;
  removeWebSocket: (userId: string) => void;
} | null;

const WebSocketContext = createContext<WebSocketContextType>(null);
const WebSocketContextApi = createContext<WebSocketContextApiType>(null);

export const useWebSocketContext = () =>
  useContextWrapper<WebSocketContextType>(
    WebSocketContext,
    "WebSocketContext is null",
  );

export const useWebSocketContextApi = () =>
  useContextWrapper<WebSocketContextApiType>(
    WebSocketContextApi,
    "WebSocketContextApi is null",
  );

export function WebSocketContextProvider({ children }: PropsWithChildren) {
  const socket = useRef<Socket>();

  const contextValue = useMemo(
    () => ({
      socket,
    }),
    [],
  );

  const api = useMemo(() => {
    const createWebSocket = (userId: string) => {
      if (socket.current) {
        return;
      }

      socket.current = io(import.meta.env.VITE_WEBSOCKET_URL);
      const convertedId = Number(userId);

      socket.current.on("login", (data) => {
        console.log(data);
      });
      socket.current.emit("login", { userId: convertedId });

      socket.current.on("logout", (data) => {
        console.log(data);
      });

      socket.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.current.on("disconnect", () => {
        socket.current?.removeAllListeners();
        console.log("Disconnected from WebSocket server");
      });
    };

    const removeWebSocket = (userId: string) => {
      const convertedId = Number(userId);

      socket.current?.emit("logout", { userId: convertedId });
      socket.current?.disconnect();
      socket.current = undefined;
    };

    const createMessage = (
      setMessages: Dispatch<SetStateAction<RoomMessagesType>>,
    ) => {
      const createMessageFn = (data: RoomMessagesType) => {
        setMessages(data);
      };

      socket.current?.on("chatMessage", createMessageFn);

      return () => {
        socket.current?.removeListener("chatMessage", createMessageFn);
      };
    };

    const joinChatroom = (
      userId: string,
      currentRoomId: number | undefined,
      newRoomId: number,
    ) => {
      socket.current?.emit("joinChatroom", {
        userId,
        currentRoomId,
        newRoomId,
      });
    };

    const getOnlineUsers = (
      setOnlineUsers: Dispatch<SetStateAction<OnlineUserType>>,
    ) => {
      const getOnlineUsersFn = (data: OnlineUserType) => {
        setOnlineUsers(data);
        console.log("Set online users", data);
      };
      socket.current?.on("getOnlineUsers", getOnlineUsersFn);

      return () => {
        socket.current?.removeListener("getOnlineUsers", getOnlineUsersFn);
      };
    };

    const createChatroom = (
      setChatrooms: Dispatch<SetStateAction<ChatroomType>>,
    ) => {
      const createChatroomFn = (data: ChatroomType) => {
        setChatrooms(data);
        console.log("Create new chatroom", data);
      };
      socket.current?.on("createChatroom", createChatroomFn);

      return () => {
        socket.current?.removeListener("createChatroom", createChatroomFn);
      };
    };

    return {
      createWebSocket,
      createChatroom,
      createMessage,
      getOnlineUsers,
      joinChatroom,
      removeWebSocket,
    };
  }, []);

  return (
    <WebSocketContextApi.Provider value={api}>
      <WebSocketContext.Provider value={contextValue}>
        {children}
      </WebSocketContext.Provider>
    </WebSocketContextApi.Provider>
  );
}
