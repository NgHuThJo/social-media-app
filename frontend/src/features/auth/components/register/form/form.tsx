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
import styles from "./form.module.css";

export const registerAction: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const { data, errors, isValid } = validateInput(registrationSchema, formData);

  if (!isValid) {
    return { errors };
  }

  try {
    await client.user.registerUser.mutate(data);
  } catch (error) {
    return handleError(error);
  }

  return redirect("/auth/login");
};

export function RegisterForm() {
  const actionData = useActionData() as RegistrationSchemaError;

  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.right}></div>
      <Form method="post" className={styles.form}>
        <h2>Register form</h2>
        <Input
          type="text"
          name="firstName"
          placeholder="First name"
          error={actionData?.errors?.fieldErrors?.firstName}
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last name"
          error={actionData?.errors?.fieldErrors?.lastName}
        />
        <Input
          type="text"
          name="displayName"
          placeholder="First name"
          error={actionData?.errors?.fieldErrors?.displayName}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          error={actionData?.errors?.fieldErrors?.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          error={actionData?.errors?.fieldErrors?.password}
        />
        <Button type="submit" className="auth">
          Register
        </Button>
        <Link to="/">Back to home</Link>
      </Form>
    </div>
  );
}
