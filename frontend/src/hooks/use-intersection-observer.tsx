import { useEffect, useRef } from "react";

export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElements = useRef<Set<Element>>(new Set());

  const observeElement = (element: Element) => {
    if (!observedElements.current.has(element)) {
      observerRef.current?.observe(element);
      observedElements.current.add(element);
    }
  };
  const unobserveElement = (element: Element) => {
    if (observedElements.current.has(element)) {
      observerRef.current?.unobserve(element);
      observedElements.current.delete(element);
    }
  };
  const observeChildNodes = (element: Element) => {
    for (const childNode of element.children) {
      observeElement(childNode);
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);

    return () => {
      observedElements.current.forEach((element) => {
        unobserveElement(element);
      });

      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [callback, options]);

  return { observerRef, observeElement, unobserveElement, observeChildNodes };
}
