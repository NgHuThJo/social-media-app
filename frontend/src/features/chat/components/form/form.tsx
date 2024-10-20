import { MouseEvent, forwardRef } from "react";
import { ActionFunctionArgs, Form, useActionData } from "react-router-dom";
import { Button } from "#frontend/components/ui/button/button";
import { Dialog } from "#frontend/components/ui/dialog/dialog";
import { FormError } from "#frontend/components/ui/form/error/error";
import { Input } from "#frontend/components/ui/form/input/input";
import { client } from "#frontend/lib/trpc";
import { handleError } from "#frontend/utils/error-handler";
import { validateInput } from "#frontend/utils/input-validation";
import { chatFormSchema, ChatFormSchemaError } from "#frontend/types/zod";
import styles from "./form.module.css";

type ChatFormProps = {
  handleDialogBackgroundClick: (event: MouseEvent<HTMLDialogElement>) => void;
  closeDialog: () => void;
};

export const chatAction = async ({ request, params }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const { userId } = params;
  const payload = {
    ...formData,
    userId,
  };
  const { data, errors, isValid } = validateInput(chatFormSchema, payload);

  if (!isValid) {
    return { errors };
  }

  try {
    const response = await client.chat.createChatroom.mutate(data);

    return response;
  } catch (error) {
    return handleError(error, "Could not create new chatroom");
  }
};

export const ChatForm = forwardRef<HTMLDialogElement, ChatFormProps>(
  ({ handleDialogBackgroundClick, closeDialog }, ref) => {
    const actionData = useActionData() as ChatFormSchemaError;

    return (
      <Dialog ref={ref} onClick={handleDialogBackgroundClick}>
        <Form method="post" className={styles.form}>
          <Input
            name="title"
            label="Name of the chatroom"
            placeholder="Chatroom name..."
            error={actionData?.errors?.title && actionData.errors.title}
            labelClassName="chatroom"
          />
          <div className={styles.actions}>
            <Button type="submit" className="submit">
              Create chatroom
            </Button>
            <Button type="button" className="reset" onClick={closeDialog}>
              Close dialog
            </Button>
          </div>
          {actionData?.errors?.general && (
            <FormError message={actionData.errors.general} />
          )}
        </Form>
      </Dialog>
    );
  },
);
ChatForm.displayName = "ChatForm";
