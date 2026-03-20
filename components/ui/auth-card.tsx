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

const highlights = [
  "Anonymous tests in minutes",
  "Clean analytics and share tools",
  "A playful experience without backend risk",
];

export function AuthCard({
  badge,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  const footerParts = footer?.label.split("?") ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-base)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.18),transparent_30%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-grid hidden border-r border-white/6 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
          <div className="space-y-10">
            <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-sm font-bold shadow-[var(--shadow-user)]">
                CT
              </span>
              Crush Test
            </Link>

            <div className="max-w-xl space-y-6">
              <span className="badge-user">Built for bold confessions</span>
              <h2 className="text-5xl font-semibold leading-tight text-white">
                Create the kind of crush quiz people actually want to finish.
              </h2>
              <p className="text-lg leading-8 text-[var(--text-body)]">
                Launch a branded anonymous test, share it instantly, and watch the answers roll
                into a dashboard that feels polished from the first click.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item, index) => (
              <div
                key={item}
                className="glass-card animate-fade-in rounded-[1.75rem] p-5"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-sm font-bold text-rose-200">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{item}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                      Designed to feel premium on desktop and mobile.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="glass-card gradient-border-user w-full max-w-xl rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link href="/" className="inline-flex items-center gap-3 text-base font-semibold text-white lg:hidden">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-xs font-bold">
                  CT
                </span>
                Crush Test
              </Link>
              <span className="badge-user">{badge}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="max-w-lg text-sm leading-7 text-[var(--text-body)]">{description}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer ? (
              <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
                {footerParts[0]}?{" "}
                <Link href={footer.href} className="font-semibold text-rose-200 hover:text-white">
                  {footerParts[1]?.trim()}
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
