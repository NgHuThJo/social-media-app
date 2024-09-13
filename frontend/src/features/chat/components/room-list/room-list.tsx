import { useAuthContext } from "@frontend/providers/auth-context";
import { ChatroomType } from "../layout/layout";
import styles from "./room-list.module.css";

type ChatroomListProps = {
  data: ChatroomType;
  currentRoom: number | undefined;
  handleSelectRoom: (
    userId: string,
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => void;
};

export function ChatroomList({
  data,
  currentRoom,
  handleSelectRoom,
}: ChatroomListProps) {
  const { userId } = useAuthContext();

  return (
    <div className={styles.list}>
      {data?.map((chatroom) => (
        <button
          key={chatroom.id}
          className={
            currentRoom !== chatroom.id
              ? styles["list-item"]
              : styles["list-item-active"]
          }
          onClick={() => {
            handleSelectRoom(userId, currentRoom, chatroom.id);
          }}
        >
          <p>
            <span>RoomId: </span>
            {chatroom.id}
          </p>
          <p>
            <span>Title: </span>
            {chatroom.title}
          </p>
        </button>
      ))}
    </div>
  );
}
