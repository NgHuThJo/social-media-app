import { PropsWithChildren } from "react";
import { useAuthContext } from "#frontend/providers/auth-context";
import { NavigationList } from "#frontend/components/ui/navigation/list/list";
import styles from "./main.module.css";

export function MainLayout({ children }: PropsWithChildren) {
  const { user } = useAuthContext();
  const userId = user?.id.toLocaleString();

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        {userId && <NavigationList userId={userId} />}
      </nav>
      {children}
    </main>
  );
}
