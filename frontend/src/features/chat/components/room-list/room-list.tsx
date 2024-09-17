import { useAuthContext } from "@frontend/providers/auth-context";
import { ChatroomsData } from "@frontend/app/routes/chat";
import styles from "./room-list.module.css";

type ChatroomListProps = {
  data: ChatroomsData;
  currentRoomId: number | undefined;
  handleSelectRoom: (
    userId: string,
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => void;
};

export function ChatroomList({
  data,
  currentRoomId,
  handleSelectRoom,
}: ChatroomListProps) {
  const { userId } = useAuthContext();

  return (
    <div className={styles.list}>
      {data?.map((chatroom) => (
        <button
          key={chatroom.id}
          className={
            currentRoomId !== chatroom.id
              ? styles["list-item"]
              : styles["list-item-active"]
          }
          onClick={() => {
            handleSelectRoom(userId, currentRoomId, chatroom.id);
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
