import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useActionData,
} from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { client } from "@frontend/lib/trpc";
import logger from "@shared/utils/logger";

const registerFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(1),
});

type RegisterActionData = {
  errors?: z.infer<typeof registerFormSchema>;
};

export const registerAction: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const validatedInput = registerFormSchema.safeParse(formData);

  if (!validatedInput.success) {
    return { errors: validatedInput.error.flatten().fieldErrors };
  }

  try {
    const response = await client.user.registerUser.mutate(validatedInput.data);
  } catch (error) {
    if (error instanceof TRPCClientError) {
      logger.error(error.message);
    } else {
      logger.error((error as Error).message);
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
  const actionData = useActionData() as RegisterActionData;

  return (
    <>
      <Form method="post">
        <input type="text" name="name" placeholder="Name" />
        {actionData?.errors?.name && <p>{actionData.errors.name}</p>}
        <input type="email" name="email" placeholder="Email address" />
        {actionData?.errors?.email && <p>{actionData.errors.email}</p>}
        <input type="password" name="password" placeholder="Password" />
        {actionData?.errors?.password && <p>{actionData.errors.password}</p>}
        <button type="submit">Register</button>
      </Form>
      <Link to="/">Back to home</Link>
    </>
  );
}
