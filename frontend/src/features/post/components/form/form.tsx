import { Form, useActionData } from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { Button } from "@frontend/components/ui/button/button";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { client } from "@frontend/lib/trpc";
import { ActionDispatchFunction } from "@frontend/types";
import styles from "./form.module.css";

const postFormSchema = z.object({
  title: z.string().min(1, "No empty title"),
  content: z.string().min(1, "No empty content"),
  userId: z.number().gt(0),
});

type PostFormActionData = {
  errors?: z.infer<typeof postFormSchema> & {
    general: string;
  };
};

type PostProps = {
  onClose: () => void;
};

export const createPost: ActionDispatchFunction = async (
  request,
  params,
  formData,
) => {
  const convertedFormData = Object.fromEntries(formData);
  const userId = Number(params.id);
  const payload = {
    ...convertedFormData,
    userId,
  };
  const validatedInput = postFormSchema.safeParse(payload);

  if (!validatedInput.success) {
    return {
      errors: validatedInput.error.flatten().fieldErrors,
    };
  }

  try {
    await client.post.createPost.mutate(validatedInput.data);

    return null;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.error(error.message);
    } else {
      console.error((error as Error).message);
    }

    return {
      errors: {
        general: "Creation of post failed",
      },
    };
  }
};

export function PostForm({ onClose }: PostProps) {
  const actionData = useActionData() as PostFormActionData;

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
        <Error message={actionData.errors.general} />
      )}
      <div className={styles.buttons}>
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
