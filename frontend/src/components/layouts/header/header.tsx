import { Navigation } from "@frontend/components/ui/nav/navigation";
import styles from "./header.module.css";

export function HeaderLayout() {
  return (
    <header className={styles.layout}>
      <Navigation />
    </header>
  );
}
