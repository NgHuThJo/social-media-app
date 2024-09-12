import { Link } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { LogoutButton } from "@frontend/features/auth/components/logout/logout-button";
import styles from "./navigation.module.css";

const navMap = new Map([
  ["About", "profile"],
  ["Friends", "friends"],
  ["Posts", "posts"],
  ["Feeds", "feeds"],
  ["Chat", "chat"],
]);

export function Navigation() {
  const { userId } = useAuthContext();

  return (
    <nav className={styles.nav}>
      <h1>
        <Link to="/">Social media app</Link>
      </h1>
      {userId && (
        <ul className={styles.navlist}>
          {[...navMap].map(([key, value]) => (
            <li key={key}>
              <Link to={`/${userId}/${value}`}>{key}</Link>
            </li>
          ))}
        </ul>
      )}
      {!userId && <Link to="/auth/login">Login</Link>}
      {userId && <LogoutButton />}
    </nav>
  );
}
