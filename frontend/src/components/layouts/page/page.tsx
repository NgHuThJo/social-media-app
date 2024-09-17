import { PropsWithChildren } from "react";
import { FooterLayout } from "../footer/footer";
import { HeaderLayout } from "../header/header";
import styles from "./page.module.css";

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <HeaderLayout />
      {children}
      <FooterLayout />
    </div>
  );
}
