import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "#frontend/providers/auth-context";
import { useWebSocketContextApi } from "#frontend/providers/websocket-context";
import { useDialog } from "#frontend/hooks/use-dialog";
import { Button } from "#frontend/components/ui/button/button";
import { Chatroom } from "#frontend/features/chat/components/room/room";
import { ChatForm } from "../form/form";
import { ChatPlaceholder } from "../placeholder/placeholder";
import { ChatroomList } from "../room-list/room-list";
import { UserList } from "#frontend/features/user/components/list/list";
import { ChatroomsData, OnlineUsersData } from "#frontend/types/api";
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
  const { user } = useAuthContext();
  const { emit, subscribe } = useWebSocketContextApi();
  const userId = user?.id.toLocaleString();

  useEffect(() => {
    const unsubscribeGetOnlineUsers = subscribe(
      "getOnlineUsers",
      (data: OnlineUsersData) => {
        setOnlineUsers(data);
      },
    );
    const unsubscribeCreateChatroom = subscribe(
      "createChatroom",
      (data: ChatroomsData) => {
        setChatrooms(data);
      },
    );

    return () => {
      unsubscribeGetOnlineUsers();
      unsubscribeCreateChatroom();
    };
  }, [subscribe]);

  if (!user) {
    return <Navigate to={"/auth/login"} />;
  }

  const selectChatroom = (
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => {
    setCurrentRoomId(newRoomId);
    emit("joinChatroom", {
      userId,
      currentRoomId: currentRoomId ? String(currentRoomId) : currentRoomId,
      newRoomId: String(newRoomId),
    });
  };

  const leaveChatroom = () => {
    setCurrentRoomId(undefined);
    emit("leaveRoom", {
      userId,
      currentRoomId: currentRoomId ? String(currentRoomId) : currentRoomId,
    });
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <section className={styles["list-layout"]}>
          <div className={styles.list}>
            <h2>Online users</h2>
            {onlineUsers && <UserList data={onlineUsers} />}
          </div>
          <div className={styles.list}>
            <h2>Chatrooms</h2>
            {chatrooms && (
              <ChatroomList
                data={chatrooms}
                currentRoomId={currentRoomId}
                handleSelectRoom={selectChatroom}
              />
            )}
          </div>
        </section>
        <section className={styles.actions}>
          <Button type="button" onClick={openDialog}>
            Create new chatroom
          </Button>
          {currentRoomId && (
            <Button type="button" onClick={leaveChatroom}>
              Leave chatroom
            </Button>
          )}
        </section>
      </aside>
      <ChatForm
        closeDialog={closeDialog}
        handleDialogBackgroundClick={handleDialogBackgroundClick}
        ref={dialogRef}
      />
      {currentRoomId ? (
        <Chatroom currentRoomId={currentRoomId} />
      ) : (
        <ChatPlaceholder />
      )}
    </div>
  );
}
