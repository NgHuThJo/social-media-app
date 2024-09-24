import { Link } from "react-router-dom";
import { OnlineUsersData } from "@frontend/types/api";
import styles from "./list.module.css";

type UserListProps = {
  data: OnlineUsersData;
};

export function UserList({ data }: UserListProps) {
  return (
    <div className={styles.layout}>
      {data?.map((user) => (
        <Link to="/" key={user.id} className={styles.item}>
          {user.name}
        </Link>
      ))}
    </div>
  );
}
