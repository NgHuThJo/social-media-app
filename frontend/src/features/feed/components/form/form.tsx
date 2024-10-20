import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { Button } from "#frontend/components/ui/button/button";
import { FormError } from "#frontend/components/ui/form/error/error";
import { Input } from "#frontend/components/ui/form/input/input";
import { LoadingSpinner } from "#frontend/components/ui/loading/spinner/spinner";
import { TextArea } from "#frontend/components/ui/form/textarea/textarea";
import { client } from "#frontend/lib/trpc";
import { handleError } from "#frontend/utils/error-handler";
import { validateInput } from "#frontend/utils/input-validation";
import { ActionDispatchFunction } from "#frontend/types";
import { feedFormSchema, FeedFormSchemaError } from "#frontend/types/zod";
import styles from "./form.module.css";

type FeedFormProps = {
  onClose: () => void;
};

export const createFeed: ActionDispatchFunction = async (
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
  const { data, errors, isValid } = validateInput(feedFormSchema, payload);

  console.log(errors);

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

    return redirect(currentUrl.pathname + currentUrl.search);
  } catch (error) {
    return handleError(error);
  }
};

export function FeedForm({ onClose }: FeedFormProps) {
  const actionData = useActionData() as FeedFormSchemaError;
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
            name="title"
            placeholder="Your post title..."
            error={actionData?.errors?.fieldErrors?.title}
          />
          <TextArea
            name="content"
            cols={20}
            rows={5}
            placeholder="Your post..."
            error={actionData?.errors?.fieldErrors?.content}
          />
          <Input
            type="file"
            name="file"
            labelClassName="file-selector"
            label="Upload a file"
            error={actionData?.errors?.fieldErrors?.file}
          />
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
