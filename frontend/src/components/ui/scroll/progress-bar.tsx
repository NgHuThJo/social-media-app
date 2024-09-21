import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScroll } from "@frontend/hooks/useScroll";
import styles from "./progress-bar.module.css";

export function ScrollProgressBar() {
  const { scrollPosition, setScrollPosition } = useScroll();
  const location = useLocation();
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  const currentProgress =
    scrollHeight > clientHeight
      ? (scrollPosition[1] / (scrollHeight - clientHeight)) * 100
      : 0;

  useEffect(() => {
    setScrollPosition([window.scrollX, window.scrollY]);
  }, [location]);

  return (
    <div className={styles.container}>
      <div
        className={styles["progress-bar"]}
        style={{ width: `${currentProgress}%` }}
      ></div>
    </div>
  );
}
