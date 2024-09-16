import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { Error } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handling";
import { authSchema, AuthSchemaError } from "@frontend/types/zod-schema";
import styles from "./login-form.module.css";

export const loginAction =
  (authContextApi: AuthContextApiType): ActionFunction =>
  async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const validatedInput = authSchema.safeParse(formData);

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
      return handleError(error, "Login failed");
    }
  };

export function LoginForm() {
  const actionData = useActionData() as AuthSchemaError;

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
          <Error message={actionData.errors.general} />
        )}
        <div className={styles.actions}>
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
