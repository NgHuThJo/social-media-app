import { useToggle } from "@frontend/hooks/useToggle";
import styles from "./grid.module.css";
import { Button } from "../button";

type EmojiButtonGridProps = {
  emojis: string[];
  writeEmoji: (emoji: string) => void;
};

export function EmojiButtonGrid({ emojis, writeEmoji }: EmojiButtonGridProps) {
  const { isOpen, toggle } = useToggle();

  return (
    <>
      <Button type="button" onClick={toggle}>
        😊
      </Button>
      <div className={`${styles.grid} ${isOpen ? "fade-in" : "fade-out"}`}>
        {emojis.map((emoji, index) => (
          <Button type="button" key={index} onClick={() => writeEmoji(emoji)}>
            {emoji}
          </Button>
        ))}
      </div>
    </>
  );
}
