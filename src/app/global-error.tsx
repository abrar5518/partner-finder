"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <main className="min-h-screen px-6 py-16">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <span className="inline-flex w-fit rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-1 text-sm font-medium text-rose-200">
              Global Error
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                A critical error occurred
              </h1>
              <p className="text-sm leading-7 text-slate-300">
                The application could not recover automatically. Try again or reload the page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex w-fit items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Retry
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
