import { Link } from "react-router-dom";
import { useDragAndDropSwap } from "@frontend/hooks/use-drag-and-drop-swap";
import { FriendData } from "@frontend/types/api";
import styles from "./list.module.css";
import { avatar_placeholder } from "@frontend/assets/resources/icons";

type FriendListProps = {
  data: FriendData;
};

export function FriendList({ data }: FriendListProps) {
  const { parentRef } = useDragAndDropSwap<HTMLUListElement>();

  return (
    <ul className={styles.list} ref={parentRef}>
      {data?.map((friend) => (
        <li className={styles["list-item"]} key={friend.id} draggable="true">
          <img
            src={friend.avatar?.url ?? avatar_placeholder}
            alt="avatar"
            className={styles.avatar}
          />
          <Link to={`../profile/${String(friend.id)}`}>
            <p className={styles.name}>{friend.displayName}</p>
          </Link>
          <p className={styles.email}>{friend.email}</p>
        </li>
      ))}
    </ul>
  );
}
