import { PropsWithChildren } from "react";
import { NavigationList } from "@frontend/components/ui/navigation/list/list";
import styles from "./main.module.css";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <main className={styles.container}>
      <NavigationList />
      {children}
    </main>
  );
}
