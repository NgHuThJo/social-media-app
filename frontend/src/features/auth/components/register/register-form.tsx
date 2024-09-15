import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import {
  registrationSchema,
  RegistrationSchemaError,
} from "@frontend/types/zod-schema";
import { Button } from "@frontend/components/ui/button/button";

export const registerAction: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const validatedInput = registrationSchema.safeParse(formData);

  if (!validatedInput.success) {
    return { errors: validatedInput.error.flatten().fieldErrors };
  }

  try {
    const response = await client.user.registerUser.mutate(validatedInput.data);
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.error(error.message);
    } else {
      console.error((error as Error).message);
    }

    return {
      errors: {
        general: "Registration failed",
      },
    };
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
