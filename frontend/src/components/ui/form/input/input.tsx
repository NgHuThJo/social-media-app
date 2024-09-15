import { ComponentPropsWithRef } from "react";
import { Label } from "../label/label";
import styles from "./input.module.css";

type InputProps = ComponentPropsWithRef<"input"> & {
  inputClassName?: string;
  labelClassName?: string;
  label?: string;
  error?: string[];
};

export function Input({
  inputClassName = "default",
  labelClassName,
  label,
  name,
  error,
  type,
  ...restProps
}: InputProps) {
  return (
    <Label
      className={labelClassName}
      label={label}
      htmlFor={name}
      error={error}
    >
      <input
        type={type}
        name={name}
        id={name}
        className={styles[inputClassName]}
        {...restProps}
      />
    </Label>
  );
}
