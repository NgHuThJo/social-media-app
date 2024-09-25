import { useAuthContext } from "@frontend/providers/auth-context";
import { ChatroomsData } from "@frontend/types/api";
import styles from "./room-list.module.css";
import { Navigate } from "react-router-dom";

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
      {data?.map((chatroom) => (
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
