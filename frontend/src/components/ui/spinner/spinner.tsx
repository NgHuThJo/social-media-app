import { ComponentPropsWithRef } from "react";
import styles from "./spinner.module.css";

export function Spinner({
  className = "default",
}: ComponentPropsWithRef<"div">) {
  return <div className={styles[className]}></div>;
}
