"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/route-error-state";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteErrorState
      title="Application error"
      description="The app hit an unexpected issue. Please try the page again."
      reset={reset}
    />
  );
}
