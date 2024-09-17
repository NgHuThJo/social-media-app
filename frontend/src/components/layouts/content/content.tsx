import { PropsWithChildren } from "react";
import styles from "./content.module.css";

export function ContentLayout({ children }: PropsWithChildren) {
  return <div className={styles.container}>{children}</div>;
}
