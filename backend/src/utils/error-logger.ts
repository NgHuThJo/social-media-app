import { TRPCError } from "@trpc/server";
import { AppError } from "./app-error";
import logger from "@shared/utils/logger";

export function logError(error: unknown) {
  if (error instanceof AppError) {
    logger.error(`${error.name}:`, error.code, error.message);
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  } else if (error instanceof TRPCError) {
    logger.error(`${error.name}:`, error.code, error.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected error",
    });
  } else {
    logger.error(`Unknown error: ${error}`);
  }
}
