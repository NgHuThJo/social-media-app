import { Navigation } from "@frontend/components/ui/navigation/navigation";
import styles from "./header.module.css";

export function HeaderLayout() {
  return (
    <header className={styles.container}>
      <Navigation />
    </header>
  );
}
