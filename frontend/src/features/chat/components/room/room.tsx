import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocketContextApi } from "#frontend/providers/websocket-context";
import { useFetch } from "#frontend/hooks/use-fetch";
import { useScrollIntoView } from "#frontend/hooks/use-scroll-into-view";
import { Button } from "#frontend/components/ui/button/button";
import { EmojiButtonGrid } from "#frontend/components/ui/button/emoji/grid";
import { client } from "#frontend/lib/trpc";
import { formatRelativeTimeDate } from "#frontend/utils/intl";
import { validateInput } from "#frontend/utils/input-validation";
import { messageSchema, MessageSchemaError, numberToStringSchema, SchemaError } from "#frontend/types/zod";
import styles from "./room.module.css";

export type RoomMessagesType = Awaited<ReturnType<typeof client.message.getAllRoomMessages.query>>;

type ChatroomProps = {
  currentRoomId: number;
};

export function Chatroom({ currentRoomId }: ChatroomProps) {
  const [messages, setMessages] = useState<RoomMessagesType>();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { scrollRef, scrollIntoView } = useScrollIntoView<HTMLParagraphElement>({
    behavior: "smooth",
  });
  const { subscribe } = useWebSocketContextApi();
  const { isLoading, error, fetchData } = useFetch();
  const { isLoading: eventIsLoading, error: eventError, fetchData: eventFetchData } = useFetch();
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = subscribe("chatMessage", (data: RoomMessagesType) => {
      setMessages(data);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    scrollIntoView();
  }, [messages]);

  useEffect(() => {
    fetchData(async (abortController) => {
      const { data, errors, isValid } = validateInput(numberToStringSchema, currentRoomId);

      if (!isValid) {
        throw new Error("Invalid data format");
      }

      const response = await client.message.getAllRoomMessages.query(
        {
          roomId: data,
        },
        { signal: abortController.signal },
      );

      setMessages(response);
    });
  }, [currentRoomId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    eventFetchData(async (abortController) => {
      const formData = new FormData(event.currentTarget);
      const payload = {
        ...Object.fromEntries(formData),
        userId,
        roomId: currentRoomId,
      };
      const { data, errors, isValid } = validateInput(messageSchema, payload);

      if (!isValid) {
        throw new Error("Invalid data format");
      }

      const response = await client.message.createMessage.mutate(data, {
        signal: abortController.signal,
      });

      setMessages(response);
    });

    event.currentTarget.reset();
  };

  const writeEmoji = (emoji: string) => {
    if (messageInputRef.current) {
      messageInputRef.current.value += emoji;
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.chatbox}>
        {messages?.map((message, index) => (
          <p key={message.id} ref={index === messages.length - 1 ? scrollRef : null}>
            <span>
              {message.author.displayName} ({formatRelativeTimeDate(new Date(message.createdAt), "en")})
            </span>
            : {message.content}
          </p>
        ))}
      </div>
      <form method="post" className={styles.form} onSubmit={handleSubmit}>
        <EmojiButtonGrid writeEmoji={writeEmoji} />
        <input type="text" name="content" id="content" placeholder="Enter your message..." ref={messageInputRef} />
        <input type="hidden" name="userId" id="userId" value={userId} />
        <Button type="submit">Submit message</Button>
      </form>
    </div>
  );
}
