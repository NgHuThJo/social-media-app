type Breakpoint = "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

export function getBreakpoints() {
  const breakpoints: Record<Breakpoint, string> = {
    xxs: "320px",
    xs: "480px",
    s: "768px",
    m: "1024px",
    l: "1200px",
    xl: "1440px",
    xxl: "1920px",
  };

  return breakpoints;
}
