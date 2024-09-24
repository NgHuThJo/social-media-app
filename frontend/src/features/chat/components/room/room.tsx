import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { useFetch } from "@frontend/hooks/useFetch";
import { Button } from "@frontend/components/ui/button/button";
import { EmojiButtonGrid } from "@frontend/components/ui/button/emoji/grid";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { validateInput } from "@frontend/utils/input-validation";
import {
  messageSchema,
  MessageSchemaError,
  numberToStringSchema,
  SchemaError,
} from "@frontend/types/zod";
import styles from "./room.module.css";

export type RoomMessagesType = Awaited<
  ReturnType<typeof client.message.getAllRoomMessages.query>
>;

type ChatroomProps = {
  currentRoomId: number;
};

export function Chatroom({ currentRoomId }: ChatroomProps) {
  const [messages, setMessages] = useState<RoomMessagesType>();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { subscribe } = useWebSocketContextApi();
  const { isLoading, error, fetchData } =
    useFetch<typeof numberToStringSchema>();
  const {
    isLoading: eventIsLoading,
    error: eventError,
    fetchData: eventFetchData,
  } = useFetch<typeof messageSchema>();
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = subscribe("chatMessage", (data: RoomMessagesType) => {
      setMessages(data);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchMessages = async (
      abortController: AbortController,
      setError: Dispatch<
        SetStateAction<SchemaError<typeof numberToStringSchema> | null>
      >,
    ) => {
      const { data, errors, isValid } = validateInput(
        numberToStringSchema,
        currentRoomId,
      );

      if (!isValid) {
        return setError({ errors });
      }

      const response = await client.message.getAllRoomMessages.query(
        {
          roomId: data,
        },
        { signal: abortController.signal },
      );

      setMessages(response);
    };

    fetchData(fetchMessages);
  }, [currentRoomId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fetchCreatedMessage = async (
      abortController: AbortController,
      setError: Dispatch<SetStateAction<MessageSchemaError | null>>,
    ) => {
      const formData = new FormData(event.currentTarget);
      const payload = {
        ...Object.fromEntries(formData),
        userId,
        roomId: currentRoomId,
      };
      const { data, errors, isValid } = validateInput(messageSchema, payload);

      if (!isValid) {
        return setError({ errors });
      }

      const response = await client.message.createMessage.mutate(data, {
        signal: abortController.signal,
      });

      setMessages(response);
    };

    eventFetchData(fetchCreatedMessage);
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
        {messages?.map((message) => (
          <p key={message.id}>
            <span>
              {message.author.name} (
              {formatRelativeTimeDate(new Date(message.createdAt), "en")})
            </span>
            : {message.content}
          </p>
        ))}
      </div>
      <form method="post" className={styles.form} onSubmit={handleSubmit}>
        <EmojiButtonGrid writeEmoji={writeEmoji} />
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
