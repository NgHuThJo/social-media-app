import { TRPCClientError } from "@trpc/client";

export function handleError(
  error: unknown,
  defaultMessage = "An unexpected error occured.",
) {
  let errorMessage: string | null = null;

  if (error instanceof TRPCClientError) {
    console.error("TRPC Client Error:", error.message);
    errorMessage = error.message;
  } else if (error instanceof Error) {
    console.error("General Error:", error.message);
    errorMessage = error.message;
  } else {
    console.error("Unknown Error:", error);
  }

  return {
    errors: {
      general: errorMessage ?? defaultMessage,
    },
  };
}
