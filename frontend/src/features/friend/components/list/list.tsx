import { FriendLoaderData } from "@frontend/app/routes/friend";
import { FriendInfo } from "../info/info";
import styles from "./list.module.css";

export function FriendList({ data }: FriendLoaderData) {
  return (
    <ul className={styles.list}>
      {data?.map((friend) => <FriendInfo data={friend} key={friend.id} />)}
    </ul>
  );
}
