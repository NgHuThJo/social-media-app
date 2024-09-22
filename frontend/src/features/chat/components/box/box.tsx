import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { useError } from "@frontend/hooks/useError";
import { Button } from "@frontend/components/ui/button/button";
import { EmojiButtonGrid } from "@frontend/components/ui/button/emoji/grid";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { validateInput } from "@frontend/utils/input-validation";
import { messageSchema, MessageSchemaError } from "@frontend/types/zod";
import styles from "./box.module.css";

export type RoomMessagesType = Awaited<
  ReturnType<typeof client.message.getAllRoomMessages.query>
>;

type ChatBoxProps = {
  currentRoomId: number;
};

const emojiList = ["😂", "😭", "😉", "😍", "😊"];

export function ChatBox({ currentRoomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<RoomMessagesType>();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { createMessage } = useWebSocketContextApi();
  const { errors, addError, resetError } = useError<MessageSchemaError>();
  const { userId } = useParams();

  useEffect(() => {
    const cleanupFn = createMessage(setMessages);

    return cleanupFn;
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const response = await client.message.getAllRoomMessages.query({
        roomId: String(currentRoomId),
      });

      setMessages(response);
    };

    getMessages();
  }, [currentRoomId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(formData),
      userId,
      roomId: String(currentRoomId),
    };
    const { data, errors, isValid } = validateInput(messageSchema, payload);
    event.currentTarget.reset();

    if (!isValid) {
      addError({ errors });

      return;
    }

    try {
      const response = await client.message.createMessage.mutate(data);

      setMessages(response);
      resetError();
    } catch (error) {
      console.log(error);
    }
  };

  const writeEmoji = (emoji: string) => {
    if (messageInputRef.current) {
      messageInputRef.current.value += emoji;
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.chatbox}>
        <div>
          {messages?.map((message) => (
            <p key={message.id}>
              {message.author.name} (
              {formatRelativeTimeDate(new Date(message.createdAt), "en")}):{" "}
              {message.content}
            </p>
          ))}
        </div>
        <EmojiButtonGrid
          emojis={emojiList}
          writeEmoji={writeEmoji}
        ></EmojiButtonGrid>
      </div>
      <form method="post" className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="content"
          id="content"
          placeholder="Enter your message..."
          ref={messageInputRef}
        />
        <input type="hidden" name="userId" id="userId" value={userId} />
        <Button type="submit">Submit message</Button>
      </form>
    </div>
  );
}
