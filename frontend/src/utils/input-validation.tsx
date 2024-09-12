import { ZodSchema } from "zod";

export function validateInput(schema: ZodSchema, data: unknown) {
  const validatedData = schema.safeParse(data);

  if (!validatedData.success) {
    return {
      inValid: false,
      data: null,
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  return {
    isValid: false,
    data: validatedData.data,
    errors: null,
  };
}
