import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import styles from "./login-form.module.css";

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
    <div className={styles.layout}>
      <h1>Login</h1>
      <Form method="post" className={styles.form}>
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
        {actionData?.errors?.general && (
          <Error message={actionData?.errors?.general} />
        )}
        <div className={styles.cta}>
          <Button type="submit" className="auth">
            Login
          </Button>
          <Button type="button" className="auth">
            Sign up
          </Button>
        </div>
        <Link to="/">Back to home</Link>
      </Form>
    </div>
  );
}
