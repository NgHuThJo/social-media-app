import { CSSProperties, useEffect, useRef } from "react";
import { useDebounce } from "./use-debounce";
import { grass } from "@frontend/assets/resources/images";

type XYPair = {
  x: number;
  y: number;
};

type Transform = {
  translate: XYPair;
  rotate: number;
  scale: XYPair;
};

type DrawRectangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  transform?: Transform,
  fillStyle?: CSSProperties["color"],
  strokeStyle?: CSSProperties["color"],
) => void;

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio ?? 1;
    const canvasRect = ctx.canvas.getBoundingClientRect();
    ctx.canvas.width = Math.round(canvasRect.width * dpr);
    ctx.canvas.height = Math.round(canvasRect.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  const debouncedResizeCanvas = useDebounce(resizeCanvas, 200);

  const drawRectangle: DrawRectangle = (
    ctx,
    x,
    y,
    width,
    height,
    transform,
    fillStyle = "black",
    strokeStyle = "black",
  ) => {
    ctx.save();

    if (transform) {
      const { translate, rotate, scale } = transform;

      ctx.translate(translate.x, translate.y);
      ctx.rotate(rotate);
      ctx.scale(scale.x, scale.y);
    }

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
    }

    ctx.beginPath();
    ctx.rect(x, y, width, height);

    if (fillStyle) {
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.stroke;
    }

    ctx.restore();
  };

  const drawFloor = (ctx: CanvasRenderingContext2D) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const img = new Image();
    img.src = grass;

    img.addEventListener("load", () => {
      console.log(img);
      for (let i = 0; img.width * i <= canvasWidth; i++) {
        ctx.drawImage(img, img.width * i, canvasHeight - img.height);
      }
    });
  };

  const drawFrame = (ctx: CanvasRenderingContext2D) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  };

  // const draw = (ctx: CanvasRenderingContext2D) => {
  //   // const canvasWidth = ctx.canvas.width;
  //   // const canvasHeight = ctx.canvas.height;

  //   for (let x = 0; x < 10; x++) {
  //     for (let y = 0; y < 10; y++) {
  //       drawRectangle(ctx, 10 + x * 50, 10 + x * 50, 50, 50);
  //     }
  //   }
  // };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) {
      return;
    }

    resizeCanvas(ctx);
    drawFrame(ctx);
    drawFloor(ctx);

    window.addEventListener("resize", () => {
      debouncedResizeCanvas(ctx);
    });

    return () => {
      window.removeEventListener("resize", () => {
        debouncedResizeCanvas(ctx);
      });
    };
  }, [debouncedResizeCanvas]);

  return { canvasRef };
}
