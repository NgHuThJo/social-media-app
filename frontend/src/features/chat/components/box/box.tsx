import { Button } from "@frontend/components/ui/button/button";
import styles from "./box.module.css";

export function ChatBox() {
  return (
    <div className={styles.layout}>
      <div className={styles.chatbox}></div>
      <form method="post" className={styles.form}>
        <input type="text" placeholder="Enter your message..." />
        <Button type="submit">Submit message</Button>
      </form>
    </div>
  );
}
