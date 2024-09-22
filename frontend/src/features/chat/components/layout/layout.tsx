import { useEffect, useState } from "react";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { useDialog } from "@frontend/hooks/useDialog";
import { Button } from "@frontend/components/ui/button/button";
import { ChatBox } from "@frontend/features/chat/components/box/box";
import { ChatForm } from "../form/form";
import { ChatPlaceholder } from "../placeholder/placeholder";
import { ChatroomList } from "../room-list/room-list";
import { UserList } from "@frontend/features/user/components/list/list";
import { ChatroomsData, OnlineUsersData } from "@frontend/types/api";
import styles from "./layout.module.css";

type ChatLayoutProps = {
  chatroomsData: ChatroomsData;
  onlineUsersData: OnlineUsersData;
};

export function ChatLayout({
  chatroomsData,
  onlineUsersData,
}: ChatLayoutProps) {
  const [chatrooms, setChatrooms] = useState<ChatroomsData>(chatroomsData);
  const [currentRoomId, setCurrentRoomId] = useState<number>();
  const [onlineUsers, setOnlineUsers] =
    useState<OnlineUsersData>(onlineUsersData);
  const { dialogRef, openDialog, closeDialog, handleDialogBackgroundClick } =
    useDialog();
  const { createChatroom, getOnlineUsers, joinChatroom } =
    useWebSocketContextApi();

  useEffect(() => {
    const getOnlineUsersCleanupFn = getOnlineUsers(setOnlineUsers);
    const createChatroomCleanupFn = createChatroom(setChatrooms);

    return () => {
      getOnlineUsersCleanupFn();
      createChatroomCleanupFn();
    };
  }, []);

  const selectChatroom = (
    userId: string,
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => {
    setCurrentRoomId(newRoomId);
    joinChatroom(userId, currentRoomId, newRoomId);
  };

  return (
    <div className={styles.layout}>
      <aside>
        <section>
          <h2>Online users</h2>
          {onlineUsers && <UserList data={onlineUsers} />}
          <h2>Chatrooms</h2>
          {chatrooms && (
            <ChatroomList
              data={chatrooms}
              currentRoomId={currentRoomId}
              handleSelectRoom={selectChatroom}
            />
          )}
        </section>
        <section>
          <Button type="button" onClick={openDialog}>
            Create new chatroom
          </Button>
          <ChatForm
            closeDialog={closeDialog}
            handleDialogBackgroundClick={handleDialogBackgroundClick}
            ref={dialogRef}
          />
        </section>
      </aside>
      {currentRoomId ? (
        <ChatBox currentRoomId={currentRoomId} />
      ) : (
        <ChatPlaceholder />
      )}
    </div>
  );
}
