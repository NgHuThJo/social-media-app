import { FriendLoaderData } from "@frontend/app/routes/friend";
import styles from "./info.module.css";

type FriendData = NonNullable<FriendLoaderData["data"]>[number];
type FriendProps = {
  data: FriendData;
};

export function FriendInfo({ data: friend }: FriendProps) {
  return (
    <li className={styles.list}>
      <p>Name: {friend.name}</p>
      <p>Email: {friend.email}</p>
    </li>
  );
}
