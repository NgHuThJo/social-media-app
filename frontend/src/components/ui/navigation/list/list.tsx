import { useAuthContext } from "@frontend/providers/auth-context";
import { NavigationLink } from "../link/link";
import styles from "./list.module.css";

const navigationMap = new Map([
  ["About", "profile"],
  ["Friends", "friends"],
  ["Posts", "posts"],
  ["Feeds", "feeds"],
  ["Chat", "chat"],
]);

export function NavigationList() {
  const { userId } = useAuthContext();

  return (
    <ul className={styles.container}>
      {[...navigationMap].map(([key, value]) => (
        <li key={key}>
          <NavigationLink to={`/${userId}/${value}`}>{key}</NavigationLink>
        </li>
      ))}
    </ul>
  );
}
