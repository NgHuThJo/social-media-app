import { PropsWithChildren } from "react";
import { NavigationList } from "@frontend/components/ui/navigation/list/list";
import styles from "./main.module.css";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <NavigationList />
      </nav>
      {children}
    </main>
  );
}
