import { FriendData } from "@frontend/app/routes/friend";
import { FriendInfo } from "../info/info";
import styles from "./list.module.css";

type FriendListProps = {
  data: FriendData;
};

export function FriendList({ data }: FriendListProps) {
  return (
    <ul className={styles.list}>
      {data?.map((friend) => <FriendInfo data={friend} key={friend.id} />)}
    </ul>
  );
}
