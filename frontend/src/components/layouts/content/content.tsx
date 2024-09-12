import { ComponentPropsWithoutRef } from "react";
import styles from "./content.module.css";

export function ContentLayout({
  children,
  className = "default",
}: ComponentPropsWithoutRef<"div">) {
  return <div className={styles[className]}>{children}</div>;
}
