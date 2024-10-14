import { useEffect, useRef } from "react";
// import { useDebounce } from "./use-debounce";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) {
      return;
    }
  }, []);

  return { canvasRef };
}
