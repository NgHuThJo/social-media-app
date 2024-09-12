import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { client } from "@frontend/lib/trpc";

const loginFormSchema = z.object({
  email: z.string().email("Email is not available"),
  password: z.string().min(1, "Password must have at least 1 character"),
});

type LoginActionData = {
  errors?: z.infer<typeof loginFormSchema> & {
    general: string;
  };
};

export const loginAction =
  (authContextApi: AuthContextApiType): ActionFunction =>
  async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const validatedInput = loginFormSchema.safeParse(formData);

    if (!validatedInput.success) {
      return {
        errors: validatedInput.error.flatten().fieldErrors,
      };
    }

    try {
      const response = await client.auth.loginUser.mutate(validatedInput.data);

      if (response) {
        authContextApi?.setUserId(String(response.id));
        localStorage.setItem("userId", JSON.stringify(response.id));

        return redirect(`/${response.id}/profile`);
      }
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.error(error.message);
      } else {
        console.error((error as Error).message);
      }

      return {
        errors: {
          general: "Login failed",
        },
      };
    }
  };

export function LoginForm() {
  const actionData = useActionData() as LoginActionData;

  return (
    <Form method="post">
      <input type="email" name="email" placeholder="Email address" />
      {actionData?.errors?.email && <p>{actionData.errors.email}</p>}
      <input type="password" name="password" placeholder="Password" />
      {actionData?.errors?.password && <p>{actionData.errors.password}</p>}
      {actionData?.errors?.general && <p>{actionData.errors.general}</p>}
      <Button type="submit" className="auth">
        Login
      </Button>
    </Form>
  );
}
