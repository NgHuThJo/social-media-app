import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { useToggle } from "@frontend/hooks/useToggle";
import { useError } from "@frontend/hooks/useError";
import { Button } from "@frontend/components/ui/button/button";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { messageSchema, MessageSchemaError } from "@frontend/types/zod";
import styles from "./box.module.css";

export type RoomMessagesType = Awaited<
  ReturnType<typeof client.message.getAllRoomMessages.query>
>;

type ChatBoxProps = {
  currentRoomId: number;
};

export function ChatBox({ currentRoomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<RoomMessagesType>();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { createMessage } = useWebSocketContextApi();
  const { errors, addError, resetError } = useError<MessageSchemaError>();
  const { isOpen: isEmojiOpen, toggle: toggleEmoji } = useToggle();
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
    const validatedData = messageSchema.safeParse(payload);
    event.currentTarget.reset();

    if (!validatedData.success) {
      addError({
        errors: validatedData.error.flatten().fieldErrors,
      });

      return;
    }

    try {
      const response = await client.message.createMessage.mutate(
        validatedData.data,
      );

      setMessages(response);
      resetError();
    } catch (error) {
      console.log(error);
    }
  };

  const addEmoji = (emoji: string) => {
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
        <div
          className={`${styles.emoji} ${isEmojiOpen ? "fade-in" : "fade-out"}`}
        >
          <button onClick={() => addEmoji("😂")}>😂</button>
          <button onClick={() => addEmoji("😭")}>😭</button>
          <button onClick={() => addEmoji("😉")}>😉</button>
          <button onClick={() => addEmoji("😍")}>😍</button>
          <button onClick={() => addEmoji("😊")}>😊</button>
        </div>
      </div>
      <form method="post" className={styles.form} onSubmit={handleSubmit}>
        <Button type="button" onClick={toggleEmoji}>
          😊
        </Button>
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
