import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { handleError } from "@frontend/utils/error-handler";
import { SchemaError } from "@frontend/types/zod";

export function useFetch<T extends z.ZodTypeAny>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SchemaError<T> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (
    fetchFn: (
      controller: AbortController,
      setError: Dispatch<SetStateAction<SchemaError<T> | null>>,
    ) => Promise<void>,
  ) => {
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      await fetchFn(abortControllerRef.current, setError);
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        console.log("Fetch aborted:", (error as Error).message);
      } else {
        setError(handleError(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  return { isLoading, error, abortControllerRef, fetchData };
}
