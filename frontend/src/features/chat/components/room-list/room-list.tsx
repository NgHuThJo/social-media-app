import { ChatroomType } from "../layout/layout";
import styles from "./room-list.module.css";

type ChatroomListProps = {
  data: ChatroomType;
  currentRoom: number | undefined;
  handleChooseRoom: (roomId: number) => void;
};

export function ChatroomList({
  data,
  currentRoom,
  handleChooseRoom,
}: ChatroomListProps) {
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
            handleChooseRoom(chatroom.id);
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
