import { ComponentPropsWithRef } from "react";
import styles from "./image.module.css";

type ImageProps = ComponentPropsWithRef<"img">;

export function Image({ className = "default", src, alt }: ImageProps) {
  return <img src={src} alt={alt} className={styles[className]} />;
}
