import { PropsWithChildren } from "react";
import { NavigationList } from "@frontend/components/ui/list/navigation-list";
import styles from "./main.module.css";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <main className={styles.layout}>
      <NavigationList />
      {children}
    </main>
  );
}
