import { TRPCClientError } from "@trpc/client";

export function handleError(error: unknown, defaultMessage = "Unknown error") {
  let errorMessage: string | null = null;

  if (error instanceof TRPCClientError) {
    console.error("TRPC client error:", error.message);
    errorMessage = error.message;
  } else if (error instanceof Error) {
    console.error("General error:", error.message);
    errorMessage = error.message;
  } else {
    console.error("Unknown error:", error);
  }

  return {
    errors: {
      general: errorMessage ?? defaultMessage,
    },
  };
}
