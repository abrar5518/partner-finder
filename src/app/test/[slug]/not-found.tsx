import Link from "next/link";

export default function TestNotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <span className="mx-auto inline-flex rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-1 text-sm font-medium text-rose-200">
          Invalid Link
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Campaign Not Found</h1>
          <p className="text-slate-300">
            This public test link is missing, expired, or invalid.
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
