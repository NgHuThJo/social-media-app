import { z } from "zod";

// Utility schemas
export const numericStringSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "String is not number");
export const numberToStringSchema = z
  .number()
  .transform((value) => String(value));
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
export const fileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  type: z.string().regex(/^image\/(jpeg|jpg|png)$/, "Invalid file type"),
  lastModified: z.number(),
  lastModifiedDate: z.date(),
});
export const paginationSchema = z.object({
  page: z.number().positive("Page must be positive number"),
  limit: z.number().positive("Limit must be positive number"),
});
export const friendRequestSchema = z.enum([
  "SEND_REQUEST",
  "ACCEPT_REQUEST",
  "DECLINE_REQUEST",
  "REMOVE_FRIEND",
]);

// Schemas and error types for React Router actions and event handlers
export type SchemaError<T extends z.ZodSchema> = {
  errors?: {
    general?: string;
    fieldErrors?: z.inferFlattenedErrors<T>["fieldErrors"];
  };
};

// Base schemas
export const userIdSchema = z.object({
  userId: numericStringSchema,
});

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type AuthSchemaError = SchemaError<typeof authSchema>;

// Extended schemas
export const registrationSchema = authSchema.extend({
  name: nameSchema,
});
export type RegistrationSchemaError = SchemaError<typeof registrationSchema>;

export const commentSchema = userIdSchema.extend({
  content: nonEmptyStringSchema,
  postId: numericStringSchema,
});
export type CommentSchemaError = SchemaError<typeof commentSchema>;

export const messageSchema = userIdSchema.extend({
  content: nonEmptyStringSchema,
  roomId: numberToStringSchema,
});
export type MessageSchemaError = SchemaError<typeof messageSchema>;

export const postSchema = userIdSchema.extend({
  content: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
});
export type PostSchemaError = SchemaError<typeof postSchema>;

export const feedFormSchema = userIdSchema.extend({
  file: fileSchema,
  content: z.string().min(1, "Content is required"),
  title: z.string().min(1, "Title is required"),
});
export type FeedFormSchemaError = SchemaError<typeof feedFormSchema>;

export const settingsFormSchema = userIdSchema.extend({
  file: fileSchema,
});
export type SettingsFormSchemaError = SchemaError<typeof settingsFormSchema>;

export const chatFormSchema = userIdSchema.extend({
  title: nonEmptyStringSchema,
});
export type ChatFormSchemaError = SchemaError<typeof chatFormSchema>;

export const paginatedPostSchema = userIdSchema.merge(paginationSchema);
export type PaginatedPostSchemaError = SchemaError<typeof paginatedPostSchema>;
