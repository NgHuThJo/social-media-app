import { PropsWithChildren } from "react";
import { Navigation } from "#frontend/components/ui/navigation/navigation";
import { ScrollProgressBar } from "#frontend/components/ui/scroll/progress-bar";
import styles from "./page.module.css";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Navigation />
        <ScrollProgressBar />
      </header>
      {children}
    </div>
  );
}
