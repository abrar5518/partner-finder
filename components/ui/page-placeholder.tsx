import Link from "next/link";
import type { ReactNode } from "react";

type LinkItem = {
  href: string;
  label: string;
};

type PagePlaceholderProps = {
  title: string;
  description: string;
  links?: LinkItem[];
  badge?: string;
  children?: ReactNode;
};

export function PagePlaceholder({
  title,
  description,
  links = [],
  badge = "Placeholder",
  children,
}: PagePlaceholderProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
          {badge}
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-base text-slate-300">{description}</p>
          </div>

          {children ? <div className="mt-8">{children}</div> : null}

          {links.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
