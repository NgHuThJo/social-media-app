import { FriendData } from "@frontend/types/api";
import styles from "./list.module.css";
import { avatar_placeholder, pattern } from "@frontend/assets/images";

type FriendListProps = {
  data: FriendData;
};

export function FriendList({ data }: FriendListProps) {
  return (
    <ul className={styles.list}>
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
