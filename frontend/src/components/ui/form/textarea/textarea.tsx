import { ComponentPropsWithoutRef } from "react";
import { Error } from "../error/error";
import styles from "./textarea.module.css";

type TextAreaProps = ComponentPropsWithoutRef<"textarea"> & {
  error?: string;
};

export function TextArea({
  className = "default",
  name,
  error,
  ...restProps
}: TextAreaProps) {
  return (
    <div className={styles[className]}>
      <textarea name={name} id={name} {...restProps}></textarea>
      {error && <Error message={error} />}
    </div>
  );
}
