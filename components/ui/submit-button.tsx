"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pendingText?: string;
  variant?: "user" | "admin";
};

export function SubmitButton({
  children,
  className = "",
  pendingText = "Submitting...",
  variant = "user",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${variant === "admin" ? "btn-admin" : "btn-user"} ${className}`.trim()}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
