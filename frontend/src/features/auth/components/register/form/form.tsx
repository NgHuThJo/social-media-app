import { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import { Button } from "#frontend/components/ui/button/button";
import { Input } from "#frontend/components/ui/form/input/input";
import { NavigationLink } from "#frontend/components/ui/navigation/link/link";
import { client } from "#frontend/lib/trpc";
import { handleError } from "#frontend/utils/error-handler";
import { validateInput } from "#frontend/utils/input-validation";
import {
  registrationSchema,
  RegistrationSchemaError,
} from "#frontend/types/zod";
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
  const leftCurtainRef = useRef<HTMLDivElement | null>(null);
  const rightCurtainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onAnimationEnd = (event: AnimationEvent) => {
      const currentTarget = event.currentTarget as HTMLElement;
      currentTarget.style.display = "none";
    };

    leftCurtainRef.current?.addEventListener("animationend", onAnimationEnd);
    rightCurtainRef.current?.addEventListener("animationend", onAnimationEnd);

    return () => {
      leftCurtainRef.current?.removeEventListener(
        "animationend",
        onAnimationEnd,
      );
      rightCurtainRef.current?.removeEventListener(
        "animationend",
        onAnimationEnd,
      );
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.left} ref={leftCurtainRef}></div>
      <div className={styles.right} ref={rightCurtainRef}></div>
      <Form method="post" className={styles.form}>
        <h2>Register form</h2>
        <Input
          labelClassName="register"
          type="text"
          name="firstName"
          placeholder="First name"
          error={actionData?.errors?.fieldErrors?.firstName}
        />
        <Input
          labelClassName="register"
          type="text"
          name="lastName"
          placeholder="Last name"
          error={actionData?.errors?.fieldErrors?.lastName}
        />
        <Input
          labelClassName="register"
          type="text"
          name="displayName"
          placeholder="Display name"
          error={actionData?.errors?.fieldErrors?.displayName}
        />
        <Input
          labelClassName="register"
          type="email"
          name="email"
          placeholder="Email address"
          error={actionData?.errors?.fieldErrors?.email}
        />
        <Input
          labelClassName="register"
          type="password"
          name="password"
          placeholder="Password"
          error={actionData?.errors?.fieldErrors?.password}
        />
        <Button type="submit" className="auth">
          Register
        </Button>
        <div className={styles.links}>
          <NavigationLink to="/">Back to home</NavigationLink>
          <NavigationLink to="/auth/login">Login</NavigationLink>
        </div>
      </Form>
    </div>
  );
}
