import { Form, useActionData, useNavigation } from "react-router-dom";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { ActionDispatchFunction } from "@frontend/types";
import { feedFormSchema, FeedFormSchemaError } from "@frontend/types/zod";
import styles from "./form.module.css";

type FeedFormProps = {
  onClose: () => void;
};

export const createFeed: ActionDispatchFunction = async (
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
  const { data, errors, isValid } = validateInput(feedFormSchema, payload);

  if (!isValid) {
    return { errors };
  }

  try {
    const fileUpload = await fetch(`${import.meta.env.VITE_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    const json = await fileUpload.json();
    const response = await client.post.createFeed.mutate({
      ...data,
      assetUrl: json.path,
      publicId: json.publicId,
    });

    return response;
  } catch (error) {
    return handleError(error, "Creation of feed failed");
  }
};

export function FeedForm({ onClose }: FeedFormProps) {
  const actionData = useActionData as FeedFormSchemaError;
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "submitting" ? (
        <LoadingSpinner />
      ) : (
        <Form
          method="post"
          className={styles.form}
          encType="multipart/form-data"
        >
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
          <Input type="file" name="file" label="Upload a file" />
          {actionData?.errors?.general && (
            <FormError message={actionData.errors.general} />
          )}
          <div className={styles.actions}>
            <Button type="submit" name="intent" value="feed">
              Submit post
            </Button>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
