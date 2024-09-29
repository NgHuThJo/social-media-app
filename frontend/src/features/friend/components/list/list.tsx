import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "@frontend/hooks/use-intersection-observer";
import { FriendData } from "@frontend/types/api";
import styles from "./list.module.css";
import { avatar_placeholder, pattern } from "@frontend/assets/images";

type FriendListProps = {
  data: FriendData;
};

export function FriendList({ data }: FriendListProps) {
  const parentNodeRef = useRef<HTMLUListElement>(null);
  const { observeChildNodes } = useIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      } else {
        entry.target.classList.remove("fade-in");
      }
    });
  });

  useEffect(() => {
    if (parentNodeRef.current) {
      observeChildNodes(parentNodeRef.current);
    }
  }, [observeChildNodes]);

  return (
    <ul className={styles.list} ref={parentNodeRef}>
      {data?.map((friend) => (
        <li
          className={styles["list-item"]}
          key={friend.id}
          style={{ backgroundImage: `url(${pattern})` }}
        >
          <img
            src={friend.avatar?.url ?? avatar_placeholder}
            alt="avatar"
            className={styles.avatar}
          />
          <p className={styles.name}>{friend.name}</p>
          <p className={styles.email}>{friend.email}</p>
        </li>
      ))}
    </ul>
  );
}
