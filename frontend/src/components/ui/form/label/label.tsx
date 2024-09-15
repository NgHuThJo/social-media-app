import { ComponentPropsWithoutRef } from "react";
import { Error } from "../error/error";
import styles from "./label.module.css";

type LabelProps = ComponentPropsWithoutRef<"label"> & {
  label?: string;
  error?: string[];
};

export function Label({
  children,
  className = "default",
  error,
  htmlFor,
  label,
  ...restProps
}: LabelProps) {
  return (
    <label className={styles[className]} htmlFor={htmlFor} {...restProps}>
      {label}
      {children}
      {error?.map((message) => <Error message={message} />)}
    </label>
  );
}
