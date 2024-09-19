import { FriendData } from "@frontend/types/api";
import styles from "./list.module.css";

type FriendListProps = {
  data: FriendData;
};

export function FriendList({ data }: FriendListProps) {
  return (
    <ul className={styles.list}>
      {data?.map((friend) => (
        <li className={styles["list-item"]}>
          <p>Name: {friend.name}</p>
          <p>Email: {friend.email}</p>
        </li>
      ))}
    </ul>
  );
}
