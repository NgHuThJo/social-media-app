import { Link } from "react-router-dom";
import { OnlineUserType } from "@frontend/features/chat/components/layout/layout";
import styles from "./list.module.css";

type UserListProps = {
  data: OnlineUserType;
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
