import { Form, useActionData } from "react-router-dom";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handling";
import { ActionDispatchFunction } from "@frontend/types";
import { postSchema, PostSchemaError } from "@frontend/types/zod-schema";
import styles from "./form.module.css";

type PostProps = {
  onClose: () => void;
};

export const createPost: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const convertedFormData = Object.fromEntries(formData);
  const { userId } = params;
  const payload = {
    ...convertedFormData,
    userId,
  };
  const validatedInput = postSchema.safeParse(payload);

  if (!validatedInput.success) {
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await client.post.createPost.mutate(validatedInput.data);

    return null;
  } catch (error) {
    return handleError(error, "Creation of post failed");
  }
};

export function PostForm({ onClose }: PostProps) {
  const actionData = useActionData() as PostSchemaError;

  return (
    <Form method="post" className={styles.form}>
      <Input
        type="text"
        label="Post"
        name="title"
        placeholder="Your post title..."
        error={actionData?.errors?.title}
      />
      <TextArea
        name="content"
        cols={20}
        rows={5}
        placeholder="Your post..."
        error={actionData?.errors?.content}
      />
      {actionData?.errors?.general && (
        <FormError message={actionData.errors.general} />
      )}
      <div className={styles.actions}>
        <Button type="submit" name="intent" value="post">
          Submit post
        </Button>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
