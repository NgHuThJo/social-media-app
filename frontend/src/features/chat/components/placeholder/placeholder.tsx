import { useEffect, useRef, useState } from "react";
import {
  AnimationReturnType,
  animate,
  linear,
} from "@frontend/utils/animation";
import styles from "./placeholder.module.css";

const textArray = [
  "Welcome to the chatroom!",
  "How are you doing?",
  "I'm doing great!",
];
const from = 0;

export function ChatPlaceholder() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState(
    textArray[0].slice(from, textArray[0].length),
  );
  const requestAnimationFrameId = useRef<AnimationReturnType>();

  useEffect(() => {
    const animationDelay = 3000;
    const timeoutDelay = 1000;
    const timeoutIds: number[] = [];

    const runAnimation = async () => {
      requestAnimationFrameId.current = animate({
        draw: (progress: number) => {
          const currentTo =
            (textArray[currentTextIndex].length - from) * progress + from;
          setAnimatedText(
            textArray[currentTextIndex].slice(0, Math.ceil(currentTo)),
          );
        },
        duration: animationDelay,
        timing: linear,
      });

      await requestAnimationFrameId.current.done;

      timeoutIds.push(
        window.setTimeout(async () => {
          requestAnimationFrameId.current = animate({
            draw: (progress: number) => {
              const currentTo =
                textArray[currentTextIndex].length -
                (textArray[currentTextIndex].length - from) * progress;
              setAnimatedText(
                textArray[currentTextIndex].slice(0, Math.ceil(currentTo)),
              );
            },
            duration: animationDelay,
            timing: linear,
          });

          await requestAnimationFrameId.current.done;

          timeoutIds.push(
            window.setTimeout(() => {
              setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
            }, timeoutDelay),
          );
        }, timeoutDelay),
      );
    };

    runAnimation();

    return () => {
      requestAnimationFrameId.current?.cancel();
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [currentTextIndex]);

  return (
    <div className={styles.container}>
      <p>
        {animatedText}
        <span className={styles.cursor}>|</span>
      </p>
    </div>
  );
}
