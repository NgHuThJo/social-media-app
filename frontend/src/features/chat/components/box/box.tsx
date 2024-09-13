import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { useError } from "@frontend/hooks/useError";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { z } from "zod";
import styles from "./box.module.css";

export type RoomMessagesType = Awaited<
  ReturnType<typeof client.message.getAllRoomMessages.query>
>;

const chatBoxSchema = z.object({
  content: z.string().min(1, "No empty string"),
  userId: z.number().gt(0, "Invalid userId"),
  roomId: z.number().gt(0, "Invalid roomId"),
});

type ChatBoxError = {
  errors: {
    content?: string[];
    userId?: string[];
  };
};

type ChatBoxProps = {
  currentRoomId: number;
};

export function ChatBox({ currentRoomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<RoomMessagesType>();
  const { createMessage } = useWebSocketContextApi();
  const { error, addError, resetError } = useError<ChatBoxError>();
  const { userId } = useParams();

  useEffect(() => {
    const cleanupFn = createMessage(setMessages);

    return cleanupFn;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      ...Object.fromEntries(formData),
      userId: Number(userId),
      roomId: currentRoomId,
    };
    const validatedData = chatBoxSchema.safeParse(data);

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

  return (
    <div className={styles.layout}>
      <div className={styles.chatbox}>
        {messages?.map((message) => <p>{message.content}</p>)}
      </div>
      <form method="post" className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="content"
          id="content"
          placeholder="Enter your message..."
        />
        <input type="hidden" name="userId" id="userId" value={userId} />
        <Button type="submit">Submit message</Button>
      </form>
    </div>
  );
}
