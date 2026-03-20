import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const testTypes = [
  {
    title: "Crush Comparison",
    blurb: "Compare up to three people and see where your heart keeps drifting.",
  },
  {
    title: "Ideal Partner",
    blurb: "Reveal the relationship style and emotional traits you naturally want.",
  },
  {
    title: "Secret Crush",
    blurb: "Turn subtle clues into a playful confidence score for your top suspects.",
  },
  {
    title: "Love Personality",
    blurb: "A quicker profile-based test for emotional style and long-term energy.",
  },
];

const steps = [
  {
    index: "01",
    title: "Create",
    blurb: "Pick a test type, add your messaging, and generate a polished link in minutes.",
  },
  {
    index: "02",
    title: "Share",
    blurb: "Drop the link in stories, DMs, group chats, or wherever your audience already is.",
  },
  {
    index: "03",
    title: "See Results",
    blurb: "Track visits, submissions, and response details inside a clean private dashboard.",
  },
];

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_32%)]" />

      <header className="sticky top-0 z-30 border-b border-white/6 bg-slate-950/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-xs font-bold shadow-[var(--shadow-user)]">
              CT
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Crush Test</p>
              <p className="text-xs text-[var(--text-muted)]">Anonymous chemistry platform</p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn-user px-4 py-3 text-sm">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost px-4 py-3 text-sm">
                  Login
                </Link>
                <Link href="/register" className="btn-user px-4 py-3 text-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <span className="badge-user">Romantic UI, real product structure</span>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Does your crush{" "}
                  <span className="gradient-text-user animate-gradient">like you back?</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--text-body)]">
                  Create shareable anonymous tests with premium-looking pages, smooth dashboards,
                  and a fun visual identity that makes people want to click through.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={user ? "/dashboard" : "/register"} className="btn-user px-6 py-4">
                  {user ? "Go to dashboard" : "Create your first test"}
                </Link>
                <Link href="#how-it-works" className="btn-ghost px-6 py-4">
                  Learn how it works
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Fast setup", value: "4 test flows" },
                  { label: "Share-ready", value: "Beautiful public pages" },
                  { label: "Private insights", value: "Dashboard + admin split" },
                ].map((item) => (
                  <div key={item.label} className="glass-card rounded-[1.5rem] p-4">
                    <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="animate-float glass-card gradient-border-user rounded-[2rem] p-5 shadow-[var(--shadow-user)]">
                <div className="rounded-[1.5rem] border border-white/8 bg-slate-950/55 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Live campaign preview</p>
                      <p className="text-sm text-[var(--text-muted)]">How your product now feels</p>
                    </div>
                    <span className="badge-user">Demo</span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">Do you see us together?</p>
                        <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs text-rose-200">
                          Comparison
                        </span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-white/6">
                        <div className="h-2 w-[72%] rounded-full bg-[var(--user-gradient)]" />
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
                          <p className="text-sm text-[var(--text-muted)]">Visits</p>
                          <p className="mt-2 text-2xl font-semibold text-white">128</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
                          <p className="text-sm text-[var(--text-muted)]">Responses</p>
                          <p className="mt-2 text-2xl font-semibold text-white">41</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                      <p className="text-sm font-medium text-white">Why it works</p>
                      <ul className="mt-4 space-y-3 text-sm text-[var(--text-body)]">
                        <li>Anonymous trust messaging improves completion confidence.</li>
                        <li>Every mode gets a polished experience instead of placeholder layouts.</li>
                        <li>Admin and user surfaces now feel intentionally separate.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="max-w-2xl">
              <span className="badge-user">How it works</span>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                A smooth three-step flow from spark to response.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {steps.map((step) => (
                <div key={step.index} className="glass-card glass-card-hover rounded-[1.8rem] p-6">
                  <span className="text-sm font-semibold text-rose-200">{step.index}</span>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">{step.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="max-w-2xl">
              <span className="badge-user">Test types</span>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Four different emotional journeys, one consistent premium shell.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {testTypes.map((type, index) => (
                <div key={type.title} className="glass-card glass-card-hover rounded-[1.8rem] p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-sm font-bold text-white">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{type.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">{type.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass-card gradient-border-user rounded-[2.2rem] px-6 py-10 text-center sm:px-10">
              <span className="badge-user">Social proof</span>
              <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
                Built to feel more like a polished launch than a side-project placeholder.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-body)]">
                Public tests, user dashboards, and admin tools now belong to the same visual system
                while still feeling purpose-built for each audience.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={user ? "/dashboard" : "/register"} className="btn-user px-6 py-4">
                  Start building
                </Link>
                <Link href="/login" className="btn-ghost px-6 py-4">
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
