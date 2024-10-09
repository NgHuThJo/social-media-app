import { useEffect } from "react";
import { useDragAndDropSwap } from "@frontend/hooks/use-drag-and-drop-swap";
import { useIntersectionObserver } from "@frontend/hooks/use-intersection-observer";
import { FriendData } from "@frontend/types/api";
import styles from "./list.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

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
          <p className={styles.name}>{friend.displayName}</p>
          <p className={styles.email}>{friend.email}</p>
        </li>
      ))}
    </ul>
  );
}
