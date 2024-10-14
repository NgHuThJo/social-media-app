import { useEffect } from "react";

export function useParallax() {
  useEffect(() => {
    const handleScroll = () => {
      console.log("in handleScroll");
      const scrollTop = document.documentElement.scrollTop;
      document.documentElement.style.setProperty(
        "--parallax-scroll-top",
        `${scrollTop}px`,
      );
    };

    document.addEventListener("scroll", () => {
      requestAnimationFrame(handleScroll);
    });

    return () => {
      document.removeEventListener("scroll", () => {
        requestAnimationFrame(handleScroll);
      });
    };
  }, []);
}
