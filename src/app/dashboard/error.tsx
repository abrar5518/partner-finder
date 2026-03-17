"use client";

import { useEffect } from "react";
import { RouteErrorState } from "@/components/ui/route-error-state";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteErrorState
      title="Dashboard error"
      description="We could not load your dashboard data. Please try again."
      reset={reset}
    />
  );
}
