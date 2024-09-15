import { z } from "zod";

// Utility schemas
export const numericIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Id can't be converted to number");
export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, "Textfield must not be empty");
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email address is invalid");
export const nameSchema = z
  .string()
  .trim()
  .min(4, "Name must have at least 4 characters");
export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must have at least 8 characters");

// Schemas and error types for React Router actions and event handlers
type GeneralError = {
  general?: string;
};

export type SchemaError<T extends z.ZodTypeAny> = {
  errors?: z.typeToFlattenedError<z.infer<T>>["fieldErrors"] & GeneralError;
};

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthSchemaError = SchemaError<typeof authSchema>;

export const registrationSchema = authSchema.extend({
  name: nameSchema,
});

export type RegistrationSchemaError = SchemaError<typeof registrationSchema>;

export const commentSchema = z.object({
  content: nonEmptyStringSchema,
  postId: numericIdSchema,
  userId: numericIdSchema,
});

export type CommentSchemaError = SchemaError<typeof commentSchema>;

export const messageSchema = z.object({
  content: nonEmptyStringSchema,
  roomId: numericIdSchema,
  userId: numericIdSchema,
});

export type MessageSchemaError = SchemaError<typeof messageSchema>;

export const postSchema = z.object({
  content: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  userId: numericIdSchema,
});

export type PostSchemaError = SchemaError<typeof postSchema>;
