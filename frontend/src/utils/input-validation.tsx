import { z } from "zod";

export function validateInput<T extends z.ZodSchema>(schema: T, data: unknown) {
  const validatedData = schema.safeParse(data);

  if (!validatedData.success) {
    return {
      inValid: false,
      data: undefined,
      errors: validatedData.error.flatten<z.infer<T>>().fieldErrors,
    };
  }

  return {
    isValid: true,
    data: validatedData.data,
    errors: undefined,
  };
}

export function isNumeric(string: string) {
  return /^\d+$/.test(string);
}

export function isValidUUID(string: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    string,
  );
}
