import { MouseEvent } from "react";
import {
  ActionFunction,
  Form,
  redirect,
  useSubmit,
  useActionData,
} from "react-router-dom";
import { AuthContextApiType } from "@frontend/providers/auth-context";
import { Button } from "@frontend/components/ui/button/button";
import { FormError } from "@frontend/components/ui/form/error/error";
import { Image } from "@frontend/components/ui/image/image";
import { Input } from "@frontend/components/ui/form/input/input";
import { NavigationLink } from "@frontend/components/ui/navigation/link/link";
import { client } from "@frontend/lib/trpc";
import { getBreakpoints } from "@frontend/utils/breakpoints";
import { handleError } from "@frontend/utils/error-handler";
import { validateInput } from "@frontend/utils/input-validation";
import { authSchema, AuthSchemaError } from "@frontend/types/zod";
import styles from "./form.module.css";
import {
  landing_page_desktop,
  landing_page_mobile,
  landing_page_tablet,
} from "@frontend/assets/resources/images";

const { xs, s } = getBreakpoints();

export const loginAction =
  (authContextApi: AuthContextApiType): ActionFunction =>
  async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const { data, errors, isValid } = validateInput(authSchema, formData);

    console.log("In loginAction");

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
      return handleError(error);
    }
  };

export function LoginForm() {
  const actionData = useActionData() as AuthSchemaError;
  const submit = useSubmit();

  const handleGuestLogin = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("email", "joe.doe@gmail.com");
    formData.set("password", "password");

    submit(formData, {
      method: "post",
    });
  };

  return (
    <div className={styles.container}>
      <Image
        src={landing_page_mobile}
        srcSet={`${landing_page_mobile} 480w, ${landing_page_tablet} 800w, ${landing_page_desktop} 1440w`}
        sizes={`(max-width: ${xs}) 480px, (max-width: ${s}) 800px, 1440px`}
        alt="Background landing page"
      />
      <Form className={styles.form} method="post">
        <h1>Login</h1>
        <Input
          error={actionData?.errors?.fieldErrors?.email}
          name="email"
          placeholder="Email address"
          type="email"
        />
        <Input
          error={actionData?.errors?.fieldErrors?.password}
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
          <Button className="auth" type="button" onClick={handleGuestLogin}>
            Login as Guest
          </Button>
        </div>
        <div className={styles.links}>
          <NavigationLink to="/">Back to home</NavigationLink>
          <NavigationLink to="/auth/register">Sign up</NavigationLink>
        </div>
      </Form>
    </div>
  );
}
