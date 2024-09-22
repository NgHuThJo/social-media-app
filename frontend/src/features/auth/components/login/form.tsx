import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Input } from "@frontend/components/ui/form/input/input";
import { NavigationLink } from "@frontend/components/ui/navigation/link/link";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { authSchema, AuthSchemaError } from "@frontend/types/zod";
import styles from "./form.module.css";

export const loginAction =
  (authContextApi: AuthContextApiType): ActionFunction =>
  async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const { data, errors, isValid } = validateInput(authSchema, formData);

    if (!isValid) {
      return {
        errors,
      };
    }

    try {
      const response = await client.auth.loginUser.mutate(data);

      if (response) {
        authContextApi?.setUserData(response);
        localStorage.setItem("user", JSON.stringify(response));

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
          <NavigationLink to="/auth/register">Sign up</NavigationLink>
        </div>
        <NavigationLink to="/">Back to home</NavigationLink>
      </Form>
    </div>
  );
}
