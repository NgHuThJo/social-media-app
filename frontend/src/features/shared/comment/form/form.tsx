import { Form, useActionData } from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { client } from "@frontend/lib/trpc";
import { Button } from "@frontend/components/ui/button/button";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { ActionDispatchFunction } from "@frontend/types";
import styles from "./form.module.css";

const commentFormSchema = z.object({
  content: z.string().min(1, "No empty content"),
  postId: z.number().gt(0, "Invalid postId"),
  userId: z.number().gt(0),
});

type CommentFormActionData = {
  errors?: z.infer<typeof commentFormSchema> & {
    general: string;
  };
};

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
  const validatedInput = commentFormSchema.safeParse(payload);

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
    if (error instanceof TRPCClientError) {
      console.error(error.message);
    } else {
      console.error((error as Error).message);
    }

    return {
      errors: {
        general: "Creation of comment failed",
      },
    };
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
  const validatedInput = commentFormSchema.safeParse(payload);

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
    if (error instanceof TRPCClientError) {
      console.error(error.message);
    } else {
      console.error((error as Error).message);
    }

    return {
      errors: {
        general: "Creation of comment failed",
      },
    };
  }
};

export function CommentForm({ intent, onClose, postId }: CommentProps) {
  const actionData = useActionData() as CommentFormActionData;

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
      <div className={styles["flex-row"]}>
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
