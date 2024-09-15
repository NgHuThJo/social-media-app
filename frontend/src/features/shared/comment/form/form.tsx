import { Form, useActionData } from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { handleError } from "@frontend/utils/error-handling";
import { ActionDispatchFunction } from "@frontend/types";
import { commentSchema, CommentSchemaError } from "@frontend/types/zod-schema";
import styles from "./form.module.css";

type CommentProps = {
  intent: string;
  onClose: () => void;
  postId: number;
};

export const createPostComment: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const convertedFormData = Object.fromEntries(formData);
  const userId = Number(params.id);
  const convertedPostId = Number(convertedFormData.postId);
  const payload = {
    ...convertedFormData,
    postId: convertedPostId,
    userId,
  };
  const validatedInput = commentSchema.safeParse(payload);

  if (!validatedInput.success) {
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await client.post.createPostComment.mutate(
      validatedInput.data,
    );
    return response;
  } catch (error) {
    return handleError(error, "Creation of comment failed");
  }
};

export const createComment: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const convertedFormData = Object.fromEntries(formData);
  const userId = Number(params.id);
  const convertedPostId = Number(convertedFormData.postId);
  const payload = {
    ...convertedFormData,
    postId: convertedPostId,
    userId,
  };
  const validatedInput = commentSchema.safeParse(payload);

  console.log(payload);

  if (!validatedInput.success) {
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await client.post.createCommentReply.mutate(
      validatedInput.data,
    );
    return response;
  } catch (error) {
    return handleError(error, "Creation of comment failed");
  }
};

export function CommentForm({ intent, onClose, postId }: CommentProps) {
  const actionData = useActionData() as CommentSchemaError;

  return (
    <Form method="post" className={styles.form}>
      <TextArea
        name="content"
        rows={5}
        placeholder="Your reply..."
        error={actionData?.errors?.content}
      />
      {actionData?.errors?.general && (
        <Error message={actionData.errors.general} />
      )}
      <Input type="hidden" name="postId" value={postId} />
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
