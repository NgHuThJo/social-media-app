import { Link } from "react-router-dom";
import { OnlineUsersData } from "@frontend/types/api";
import styles from "./list.module.css";

type UserListProps = {
  data: OnlineUsersData;
};

export function UserList({ data }: UserListProps) {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.layout}>
        {data?.map((user) => (
          <li key={user.id} className={styles.item}>
            <Link to="/">{user.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
