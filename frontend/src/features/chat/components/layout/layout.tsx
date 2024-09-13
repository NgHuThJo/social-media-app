import { MouseEvent, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { ChatBox } from "@frontend/features/chat/components/box/box";
import { ChatForm } from "../form/form";
import { ChatroomList } from "../room-list/room-list";
import { UserList } from "@frontend/features/user/components/list/list";
import styles from "./layout.module.css";

export type OnlineUserType = Awaited<
  ReturnType<typeof client.user.getListOfUsers.query>
>;

export type ChatroomType = Awaited<
  ReturnType<typeof client.chat.getAllChatrooms.query>
>;

type ChatLoaderDataType = {
  chatroomsData: ChatroomType;
  onlineUsersData: OnlineUserType;
};

export const chatLoader = async () => {
  const chatroomFn = async () => {
    const chatrooms = await client.chat.getAllChatrooms.query();
    return chatrooms;
  };

  const onlineUsersFn = async () => {
    const onlineUsers = await client.user.getAllOnlineUsers.query();
    return onlineUsers;
  };

  const [chatroomsData, onlineUsersData] = await Promise.all([
    chatroomFn(),
    onlineUsersFn(),
  ]);

  return { chatroomsData, onlineUsersData };
};

export function ChatLayout() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserType>();
  const [chatrooms, setChatrooms] = useState<ChatroomType>();
  const [currentRoom, setCurrentRoom] = useState<number>();
  const { createChatroom, getOnlineUsers, joinChatroom } =
    useWebSocketContextApi();
  const { chatroomsData, onlineUsersData } =
    useLoaderData() as ChatLoaderDataType;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const getOnlineUsersCleanupFn = getOnlineUsers(setOnlineUsers);
    const createChatroomCleanupFn = createChatroom(setChatrooms);

    return () => {
      getOnlineUsersCleanupFn();
      createChatroomCleanupFn();
    };
  }, []);

  useEffect(() => {
    setOnlineUsers(onlineUsersData);
    setChatrooms(chatroomsData);
  }, [chatroomsData, onlineUsersData]);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  };

  const selectChatroom = (
    userId: string,
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => {
    setCurrentRoom(newRoomId);
    joinChatroom(userId, currentRoomId, newRoomId);
  };

  return (
    <section className={styles.layout}>
      <aside>
        <section>
          <h2>Online users</h2>
          {onlineUsers && <UserList data={onlineUsers} />}
          <h2>Chatrooms</h2>
          {chatrooms && (
            <ChatroomList
              data={chatrooms}
              currentRoom={currentRoom}
              handleSelectRoom={selectChatroom}
            />
          )}
        </section>
        <section>
          <Button type="button" onClick={openDialog}>
            Create new chatroom
          </Button>
          <ChatForm
            onClose={closeDialog}
            handleDialogClick={handleDialogClick}
            ref={dialogRef}
          />
        </section>
      </aside>
      {currentRoom ? (
        <ChatBox currentRoomId={currentRoom} />
      ) : (
        <p>No chatroom chosen.</p>
      )}
    </section>
  );
}
