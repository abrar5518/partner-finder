"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/route-error-state";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteErrorState
      title="Admin dashboard error"
      description="The admin area failed to load correctly. Please try again."
      reset={reset}
    />
  );
}
