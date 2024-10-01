import { NavigationLink } from "../link/link";
import styles from "./list.module.css";

type NavigationListProps = {
  userId: string;
};

const navigationMap = new Map([
  ["Index", "index"],
  ["About", "profile"],
  ["Friends", "friends"],
  ["Posts", "posts"],
  ["Feeds", "feeds"],
  ["Chat", "chat"],
]);

export function NavigationList({ userId }: NavigationListProps) {
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
