import { useState } from "react";

export function useError<T>() {
  const [errors, setErrors] = useState<T | null>(null);

  const addError = (error: T) => {
    setErrors(error);
  };

  const resetError = () => {
    setErrors(null);
  };

  return { errors, addError, resetError };
}
