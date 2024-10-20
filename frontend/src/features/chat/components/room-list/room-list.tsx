import { ChatroomsData } from "#frontend/types/api";
import styles from "./room-list.module.css";

type ChatroomListProps = {
  data: ChatroomsData;
  currentRoomId: number | undefined;
  handleSelectRoom: (
    currentRoomId: number | undefined,
    newRoomId: number,
  ) => void;
};

export function ChatroomList({
  data,
  currentRoomId,
  handleSelectRoom,
}: ChatroomListProps) {
  return (
    <div className={styles.list}>
      {data?.length ? (
        data.map((chatroom) => (
          <button
            key={chatroom.id}
            className={[
              styles["list-item"],
              currentRoomId === chatroom.id ? styles.active : "",
            ].join(" ")}
            onClick={() => {
              handleSelectRoom(currentRoomId, chatroom.id);
            }}
          >
            <p>{chatroom.title}</p>
          </button>
        ))
      ) : (
        <p className={styles["no-chatroom"]}>No chatroom available.</p>
      )}
    </div>
  );
}
