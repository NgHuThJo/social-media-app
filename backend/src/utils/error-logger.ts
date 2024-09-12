import { TRPCError } from "@trpc/server";
import { AppError } from "./app-error";
import logger from "@shared/utils/logger";

export function logError(error: unknown) {
  logger.error(error);
  if (error instanceof AppError) {
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  } else {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected error",
    });
  }
}
