import { ComponentPropsWithoutRef } from "react";
import styles from "./error.module.css";

type ErrorProps = ComponentPropsWithoutRef<"p"> & {
  message: string;
};

export function Error({ message }: ErrorProps) {
  return <p className={styles.error}>{message}</p>;
}
