import { Form, redirect, useActionData } from "react-router-dom";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { ActionDispatchFunction } from "@frontend/types";
import { postSchema, PostSchemaError } from "@frontend/types/zod";
import styles from "./form.module.css";

type PostProps = {
  onClose: () => void;
};

export const createPost: ActionDispatchFunction = async (
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
  const { data, errors, isValid } = validateInput(postSchema, payload);

  console.log(errors);

  if (!isValid) {
    return {
      errors,
    };
  }

  try {
    const response = await client.post.createPost.mutate(data);

    return redirect(currentUrl.pathname + currentUrl.search);
  } catch (error) {
    return handleError(error);
  }
};

export function PostForm({ onClose }: PostProps) {
  const actionData = useActionData() as PostSchemaError;

  return (
    <Form method="post" className={styles.form}>
      <div>
        <Input
          labelClassName="post"
          type="text"
          name="title"
          placeholder="Your post title..."
          error={actionData?.errors?.fieldErrors?.title}
        />
      </div>
      <TextArea
        name="content"
        cols={20}
        rows={5}
        placeholder="Your post..."
        error={actionData?.errors?.fieldErrors?.content}
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
