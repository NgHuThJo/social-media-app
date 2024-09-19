import { useRef, useState } from "react";
import { TRPCClientError } from "@trpc/client";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (
    fetchFn: (controller: AbortController) => Promise<void>,
  ) => {
    setLoading(true);
    setError(null);

    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }

    try {
      await fetchFn(abortControllerRef.current);
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        console.log((error as Error).message);
        return;
      }

      if (error instanceof TRPCClientError || error instanceof Error) {
        console.error(error.message);
        setError(error);
      } else {
        const errorMessage = "Unknown error";
        console.error(errorMessage);
        setError(new Error(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, abortControllerRef, fetchData };
}
