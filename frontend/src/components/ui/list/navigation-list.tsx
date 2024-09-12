import { Link } from "react-router-dom";
import styles from "./navigation-list.module.css";

const optionsMap = new Map([
  ["About", "profile"],
  ["Friends", "friends"],
  ["Posts", "posts"],
  ["Feeds", "feeds"],
  ["Chat", "chat"],
]);

export function NavigationList() {
  return (
    <ul className={styles.container}>
      {[...optionsMap].map(([label, path]) => (
        <li key={path}>
          <Link to={path}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}
