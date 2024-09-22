import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { Button } from "@frontend/components/ui/button/button";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import {
  registrationSchema,
  RegistrationSchemaError,
} from "@frontend/types/zod";

export const registerAction: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const { data, errors, isValid } = validateInput(registrationSchema, formData);

  if (!isValid) {
    return { errors };
  }

  try {
    await client.user.registerUser.mutate(data);
  } catch (error) {
    return handleError(error, "Registration failed");
  }

  return redirect("/auth/login");
};

export function RegisterForm() {
  const actionData = useActionData() as RegistrationSchemaError;

  return (
    <>
      <Form method="post">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          error={actionData?.errors?.name}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          error={actionData?.errors?.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          error={actionData?.errors?.password}
        />
        <Button type="submit" className="auth">
          Register
        </Button>
      </Form>
      <Link to="/">Back to home</Link>
    </>
  );
}
