import { Form, redirect, useActionData } from "react-router-dom";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { ActionDispatchFunction } from "@frontend/types";
import { commentSchema, CommentSchemaError } from "@frontend/types/zod";
import styles from "./form.module.css";

type CommentProps = {
  intent: string;
  onClose: () => void;
  parentId: number;
};

export const createPostComment: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const currentUrl = new URL(request.url);
  const convertedFormData = Object.fromEntries(formData);
  const { userId } = params;
  const payload = {
    ...convertedFormData,
    userId,
  };
  const { data, errors, isValid } = validateInput(commentSchema, payload);

  if (!isValid) {
    return {
      errors,
    };
  }

  try {
    const response = await client.post.createPostComment.mutate(data);

    return redirect(currentUrl.pathname + currentUrl.search);
  } catch (error) {
    return handleError(error);
  }
};

export const createComment: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const currentUrl = new URL(request.url);
  const convertedFormData = Object.fromEntries(formData);
  const { userId } = params;
  const payload = {
    ...convertedFormData,
    userId,
  };
  const { data, errors, isValid } = validateInput(commentSchema, payload);

  if (!isValid) {
    console.log("comment", errors);
    return {
      errors,
    };
  }

  try {
    const response = await client.post.createCommentReply.mutate(data);

    return redirect(currentUrl.pathname + currentUrl.search);
  } catch (error) {
    return handleError(error);
  }
};

export function CommentForm({ intent, onClose, parentId }: CommentProps) {
  const actionData = useActionData() as CommentSchemaError;

  return (
    <Form method="post" className={styles.form}>
      <TextArea
        name="content"
        rows={5}
        placeholder="Your reply..."
        error={actionData?.errors?.fieldErrors?.content}
      />
      {actionData?.errors?.general && (
        <FormError message={actionData.errors.general} />
      )}
      <input type="hidden" name="postId" value={parentId} />
      <div className={styles.actions}>
        <Button type="submit" name="intent" value={intent}>
          Submit post
        </Button>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
