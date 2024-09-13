import { useState } from "react";

export function useError<T>() {
  const [error, setError] = useState<T | null>(null);

  const addError = (error: T) => {
    setError(error);
  };

  const resetError = () => {
    setError(null);
  };

  return { error, addError, resetError };
}
