import { ComponentPropsWithRef } from "react";
import styles from "./skeleton.module.css";

type LoadingSkeletonProps = ComponentPropsWithRef<"div">;

export function LoadingSkeleton({
  className = "default",
  ...restProps
}: LoadingSkeletonProps) {
  return <div className={styles[className]} {...restProps}></div>;
}
