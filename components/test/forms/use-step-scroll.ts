"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useStepScroll<T extends HTMLElement>(step: number): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previousStepRef = useRef(step);

  useEffect(() => {
    if (previousStepRef.current === step) {
      return;
    }

    previousStepRef.current = step;
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  return containerRef;
}
