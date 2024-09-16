import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email address is invalid");
export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, "Textfield must not be empty");
export const nameSchema = z
  .string()
  .trim()
  .min(4, "Name must have at least 4 characters");
export const numericIdSchema = z
  .string()
  .trim()
  .transform((value) => {
    const convertedUserId = Number(value);

    if (isNaN(convertedUserId)) {
      throw new Error(`${convertedUserId} can't be converted to number`);
    }
    if (convertedUserId < 1) {
      throw new Error(`${convertedUserId} must be positive number`);
    }

    return convertedUserId;
  });
export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must have at least 8 characters");
