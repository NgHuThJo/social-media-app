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

export function isNumeric(string: string) {
  return /^\d+$/.test(string);
}

export function isValidUUID(string: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    string,
  );
}
