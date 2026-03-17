import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: {
    href: string;
    label: string;
  };
};

export function AuthCard({
  badge,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="mb-8 space-y-4">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
              {badge}
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm leading-6 text-slate-300">{description}</p>
            </div>
          </div>

          <div className="space-y-5">{children}</div>

          {footer ? (
            <div className="mt-6 text-sm text-slate-400">
              <Link
                href={footer.href}
                className="text-cyan-200 underline underline-offset-4"
              >
                {footer.label}
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
