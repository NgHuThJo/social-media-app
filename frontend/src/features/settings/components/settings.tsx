import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
} from "react-router-dom";
import { Button } from "@frontend/components/ui/button/button";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import {
  settingsFormSchema,
  SettingsFormSchemaError,
} from "@frontend/types/zod";

export const settingsAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const convertedFormData = Object.fromEntries(formData);
  const { userId } = params;
  const payload = {
    ...convertedFormData,
    userId,
  };
  const validatedData = settingsFormSchema.safeParse(payload);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const fileUpload = await fetch(`${import.meta.env.VITE_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const json = await fileUpload.json();
    const response = await client.user.updateUser.mutate({
      ...validatedData.data,
      assetUrl: json.path,
      publicId: json.publicId,
    });

    return response;
  } catch (error) {
    return handleError(error, "Could not upload avatar");
  }
};

export function Settings() {
  const actionData = useActionData() as SettingsFormSchemaError;

  return (
    <div>
      <h1>Settings</h1>
      <Form method="post" encType="multipart/form-data">
        <Input
          type="file"
          name="file"
          label="Select new avatar"
          error={actionData?.errors?.file}
        />
        <Button type="submit">Save changes</Button>
      </Form>
      <Link to="/">Back to home</Link>
    </div>
  );
}
