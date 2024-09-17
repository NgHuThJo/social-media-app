import {
  ActionFunction,
  Form,
  NavLink,
  redirect,
  useActionData,
} from "react-router-dom";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handling";
import { authSchema, AuthSchemaError } from "@frontend/types/zod-schema";
import styles from "./form.module.css";

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
    <div className={styles.container}>
      <h1>Login</h1>
      <Form className={styles.form} method="post">
        <Input
          error={actionData?.errors?.email}
          name="email"
          placeholder="Email address"
          type="email"
        />
        <Input
          error={actionData?.errors?.password}
          name="password"
          placeholder="Password"
          type="password"
        />
        {actionData?.errors?.general && (
          <FormError message={actionData.errors.general} />
        )}
        <div className={styles.actions}>
          <Button className="auth" type="submit">
            Login
          </Button>
          <NavLink
            to="/auth/register"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Sign up
          </NavLink>
        </div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Back to home
        </NavLink>
      </Form>
    </div>
  );
}
