import { ComponentPropsWithRef } from "react";
import styles from "./button.module.css";

export function Button({
  children,
  className = "default",
  type,
  ...restProps
}: ComponentPropsWithRef<"button">) {
  return (
    <button className={styles[className]} type={type} {...restProps}>
      {children}
    </button>
  );
}
