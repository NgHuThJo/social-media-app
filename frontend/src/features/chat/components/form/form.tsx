import { MouseEvent, forwardRef } from "react";
import { ActionFunctionArgs, Form, useActionData } from "react-router-dom";
import { z } from "zod";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { Dialog } from "@frontend/components/ui/dialog/dialog";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import styles from "./form.module.css";

type ChatFormProps = {
  handleDialogClick: (event: MouseEvent<HTMLDialogElement>) => void;
  onClose: () => void;
};

type ChatActionData = {
  errors?: z.infer<typeof chatActionSchema> & {
    general: string;
  };
};

const chatActionSchema = z.object({
  title: z.string().min(1, "No empty string allowed"),
  id: z.number().gt(0, "Invalid userId"),
});

export const chatAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const { id } = params;
  const convertedId = Number(id);
  const inputData = {
    ...formData,
    id: convertedId,
  };
  const validatedData = chatActionSchema.safeParse(inputData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await client.chat.createChatroom.mutate(
      validatedData.data,
    );

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const ChatForm = forwardRef<HTMLDialogElement, ChatFormProps>(
  ({ handleDialogClick, onClose }, ref) => {
    const actionData = useActionData() as ChatActionData;

    return (
      <Dialog ref={ref} onClick={handleDialogClick}>
        <Form method="post" className={styles.form}>
          <Input
            name="title"
            label="Name of the chatroom"
            placeholder="Chatroom name..."
            error={actionData?.errors?.title}
            labelClassName="chatroom"
          />
          <div className={styles.actions}>
            <Button type="submit" className="submit">
              Create chatroom
            </Button>
            <Button type="button" className="reset" onClick={onClose}>
              Close dialog
            </Button>
          </div>
          {actionData?.errors?.general && (
            <Error message={actionData.errors.general} />
          )}
        </Form>
      </Dialog>
    );
  },
);
ChatForm.displayName = "ChatForm";
