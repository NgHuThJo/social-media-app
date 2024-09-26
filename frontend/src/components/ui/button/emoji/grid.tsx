import { useToggle } from "@frontend/hooks/use-toggle";
import styles from "./grid.module.css";
import { Button } from "../button";

type EmojiButtonGridProps = {
  writeEmoji: (emoji: string) => void;
};

const emojiList = ["😂", "😭", "😉", "😍", "😊"];

export function EmojiButtonGrid({ writeEmoji }: EmojiButtonGridProps) {
  const { isOpen, toggle } = useToggle();

  return (
    <>
      <Button type="button" onClick={toggle}>
        😊
      </Button>
      <div className={`${styles.grid} ${isOpen ? "fade-in" : "fade-out"}`}>
        {emojiList.map((emoji, index) => (
          <Button type="button" key={index} onClick={() => writeEmoji(emoji)}>
            {emoji}
          </Button>
        ))}
      </div>
    </>
  );
}
