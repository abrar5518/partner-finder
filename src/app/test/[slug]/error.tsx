"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/route-error-state";

type TestErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TestError({ error, reset }: TestErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteErrorState
      title="Test page error"
      description="The public test could not be loaded properly. Please try again."
      reset={reset}
    />
  );
}
