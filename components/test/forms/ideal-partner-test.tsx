"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitPublicTestAction } from "@/app/test/actions";
import { useReactionVideo } from "@/components/test/reaction-video-context";
import { useStepScroll } from "@/components/test/forms/use-step-scroll";

type IdealPartnerValues = {
  warmup: {
    relationshipStyle: string;
    relationshipPriority: string;
  };
  emotionalNeeds: {
    stressSupport: string;
    communicationStyle: string;
    loveLanguage: string;
  };
  lifestyleCompatibility: {
    preferredLifestyle: string;
    attractivePersonality: string;
    ambitionLevel: number;
  };
  attractionChemistry: {
    attractiveVibe: string;
    firstAttraction: string;
  };
  futureVision: {
    relationshipFuture: string;
    topValue: string;
  };
  reflections: {
    dreamPartnerSummary: string;
    nonNegotiableQuality: string;
  };
  website: string;
};

type IdealPartnerTestProps = {
  slug: string;
  campaignName: string;
};

const stepLabels = [
  "Warm Up",
  "Emotional Needs",
  "Lifestyle",
  "Chemistry",
  "Future",
  "Deep Input",
];

function OptionCard({
  title,
  checked,
  onSelect,
}: {
  title: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onSelect}
      className={`flex min-h-24 items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
        checked
          ? "border-[var(--user-primary)] bg-[var(--user-primary)]/10 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          : "border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] text-[var(--text-secondary)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]"
      }`}
    >
      <span className="text-sm font-semibold">{title}</span>
      <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${
        checked 
          ? "border-[var(--user-primary)]/40 bg-[var(--user-primary)]/20 text-[var(--user-primary)]" 
          : "border-[var(--border-subtle)] bg-transparent text-[var(--text-muted)]"
      }`}>
        {checked ? "Select" : "Pick"}
      </span>
    </button>
  );
}

export function IdealPartnerTest({ slug, campaignName }: IdealPartnerTestProps) {
  const { finalizeRecording } = useReactionVideo();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadySubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(`submitted_test_${slug}`) === "true",
  );
  const [pending, startTransition] = useTransition();
  const stepContainerRef = useStepScroll<HTMLDivElement>(step);
  const { register, setValue, handleSubmit, control } = useForm<IdealPartnerValues>({
    defaultValues: {
      warmup: {
        relationshipStyle: "",
        relationshipPriority: "",
      },
      emotionalNeeds: {
        stressSupport: "",
        communicationStyle: "",
        loveLanguage: "",
      },
      lifestyleCompatibility: {
        preferredLifestyle: "",
        attractivePersonality: "",
        ambitionLevel: 0,
      },
      attractionChemistry: {
        attractiveVibe: "",
        firstAttraction: "",
      },
      futureVision: {
        relationshipFuture: "",
        topValue: "",
      },
      reflections: {
        dreamPartnerSummary: "",
        nonNegotiableQuality: "",
      },
      website: "",
    },
  });

  const watchedWarmup = useWatch({ control, name: "warmup" });
  const watchedEmotionalNeeds = useWatch({ control, name: "emotionalNeeds" });
  const watchedLifestyle = useWatch({ control, name: "lifestyleCompatibility" });
  const watchedAttraction = useWatch({ control, name: "attractionChemistry" });
  const watchedFuture = useWatch({ control, name: "futureVision" });

  const onSubmit = handleSubmit((values) => {
    if (alreadySubmitted) {
      setServerError("Aap yeh test pehle complete kar chuke hain.");
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const reactionVideoPath = await finalizeRecording();
      const result = await submitPublicTestAction({
        slug,
        testType: "ideal",
        website: values.website,
        reactionVideoPath,
        answers: {
          warmup: {
            relationshipStyle: values.warmup.relationshipStyle || undefined,
            relationshipPriority: values.warmup.relationshipPriority || undefined,
          },
          emotionalNeeds: {
            stressSupport: values.emotionalNeeds.stressSupport || undefined,
            communicationStyle: values.emotionalNeeds.communicationStyle || undefined,
            loveLanguage: values.emotionalNeeds.loveLanguage || undefined,
          },
          lifestyleCompatibility: {
            preferredLifestyle: values.lifestyleCompatibility.preferredLifestyle || undefined,
            attractivePersonality: values.lifestyleCompatibility.attractivePersonality || undefined,
            ambitionLevel:
              values.lifestyleCompatibility.ambitionLevel > 0
                ? Number(values.lifestyleCompatibility.ambitionLevel)
                : undefined,
          },
          attractionChemistry: {
            attractiveVibe: values.attractionChemistry.attractiveVibe || undefined,
            firstAttraction: values.attractionChemistry.firstAttraction || undefined,
          },
          futureVision: {
            relationshipFuture: values.futureVision.relationshipFuture || undefined,
            topValue: values.futureVision.topValue || undefined,
          },
          dreamPartnerSummary: values.reflections.dreamPartnerSummary.trim() || undefined,
          nonNegotiableQuality: values.reflections.nonNegotiableQuality.trim() || undefined,
          submittedAt: new Date().toISOString(),
        },
      });

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      window.localStorage.setItem(`submitted_test_${slug}`, "true");
      window.location.assign(result.redirectTo);
    });
  });

  return (
    <div ref={stepContainerRef} className="space-y-8">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={`rounded-2xl border px-4 py-3 text-sm transition ${
              index === step
                ? "border-[var(--user-primary)] bg-[var(--user-primary)]/10 text-[var(--user-primary)]"
                : index < step
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] text-[var(--text-muted)]"
            }`}
          >
            <div className="font-medium">Marhala {index + 1}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {serverError}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="ideal-website">Website</label>
          <input id="ideal-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {step === 0 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Quick warm-up</h2>
              <p className="text-sm leading-6 text-slate-400">
                {campaignName} ke liye yeh section aap ko comfortable karta hai aur relationship style samajhta hai.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap apne aap ko relationships me kaise describe karte hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Romantic aur expressive", "Calm aur loyal", "Funny aur playful", "Practical aur realistic", "Deep aur emotional"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedWarmup?.relationshipStyle === option}
                    onSelect={() => setValue("warmup.relationshipStyle", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("warmup.relationshipStyle")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Relationship me aap ke liye sab se zyada kya matter karta hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Trust", "Love aur affection", "Emotional understanding", "Stability aur security", "Fun aur adventure"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedWarmup?.relationshipPriority === option}
                    onSelect={() => setValue("warmup.relationshipPriority", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("warmup.relationshipPriority")} />
            </div>

            <div className="flex justify-end border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(1)} className="btn-user">
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Emotional needs discovery</h2>
              <p className="text-sm leading-6 text-slate-400">Yahan se aap ki true relationship expectations nikalti hain.</p>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Jab aap stress me hote hain to kis type ka partner support best lagta hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Jo khamoshi se sunay", "Jo advice de", "Jo fun se distract kare", "Jo emotional comfort de", "Jo mujhe space de"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedEmotionalNeeds?.stressSupport === option}
                    onSelect={() => setValue("emotionalNeeds.stressSupport", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("emotionalNeeds.stressSupport")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Ideal tor par aap partner se kitni communication pasand karte hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Sara din chat", "Roz kuch meaningful baatein", "Roz magar balanced", "Haftay me chand dafa", "Sirf jab zaroorat ho"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedEmotionalNeeds?.communicationStyle === option}
                    onSelect={() => setValue("emotionalNeeds.communicationStyle", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("emotionalNeeds.communicationStyle")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ko sab se zyada kis cheez se mehsoos hota hai ke aap loved hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Compliments aur sweet words", "Quality time", "Physical affection", "Helpful actions", "Loyalty aur trust"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedEmotionalNeeds?.loveLanguage === option}
                    onSelect={() => setValue("emotionalNeeds.loveLanguage", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("emotionalNeeds.loveLanguage")} />
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(0)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={() => setStep(2)} className="btn-user">
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Lifestyle compatibility</h2>
              <p className="text-sm leading-6 text-slate-400">Yeh section daily life aur personality fit ko check karta hai.</p>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap partner ke sath kis type ka lifestyle prefer karte hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Calm aur peaceful life", "Travel aur adventure", "Balanced career aur relationship", "Family-focused life", "Social aur outgoing life"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedLifestyle?.preferredLifestyle === option}
                    onSelect={() => setValue("lifestyleCompatibility.preferredLifestyle", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("lifestyleCompatibility.preferredLifestyle")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ko kis type ki personality sab se zyada attract karti hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Confident aur strong", "Kind aur gentle", "Funny aur energetic", "Intelligent aur thoughtful", "Calm aur mature"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedLifestyle?.attractivePersonality === option}
                    onSelect={() => setValue("lifestyleCompatibility.attractivePersonality", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("lifestyleCompatibility.attractivePersonality")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Partner me ambition aap ke liye kitni important hai?</h3>
                <p className="text-sm text-[var(--user-primary)]">
                  {watchedLifestyle?.ambitionLevel > 0 ? `${watchedLifestyle.ambitionLevel}/5` : "Optional"}
                </p>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                className="mt-5 w-full accent-[var(--user-primary)]"
                style={{ filter: "hue-rotate(-15deg)" }}
                {...register("lifestyleCompatibility.ambitionLevel", { valueAsNumber: true })}
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Not important</span>
                <span>Extremely important</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-user">
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Attraction aur chemistry</h2>
              <p className="text-sm leading-6 text-slate-400">Yeh sawal aap ki natural attraction ko pakarte hain.</p>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ko kis type ki vibe sab se zyada attract karti hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Protective aur caring", "Charming aur romantic", "Mysterious aur deep", "Fun aur playful", "Calm aur stable"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedAttraction?.attractiveVibe === option}
                    onSelect={() => setValue("attractionChemistry.attractiveVibe", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("attractionChemistry.attractiveVibe")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ko kisi me sab se pehle kya attract karta hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Un ki smile", "Un ki intelligence", "Un ki personality", "Un ka confidence", "Un ki kindness"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedAttraction?.firstAttraction === option}
                    onSelect={() => setValue("attractionChemistry.firstAttraction", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("attractionChemistry.firstAttraction")} />
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(2)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={() => setStep(4)} className="btn-user">
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Future vision</h2>
              <p className="text-sm leading-6 text-slate-400">Yahan aap ka long-term relationship direction samne aata hai.</p>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap kis type ka future relationship chahte hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Long term commitment", "Marriage focused", "Serious relationship pehle", "Slow emotional connection", "Abhi explore kar raha hun"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedFuture?.relationshipFuture === option}
                    onSelect={() => setValue("futureVision.relationshipFuture", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("futureVision.relationshipFuture")} />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ke liye kis cheez ki importance zyada hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Passion", "Stability", "Emotional connection", "Loyalty", "Mutual growth"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedFuture?.topValue === option}
                    onSelect={() => setValue("futureVision.topValue", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("futureVision.topValue")} />
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(3)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={() => setStep(5)} className="btn-user">
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Deep emotional input</h2>
              <p className="text-sm leading-6 text-slate-400">Yeh do text answers AI-style profile ko zyada personal bana dete hain.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="dreamPartnerSummary" className="text-sm font-medium text-[var(--text-secondary)]">
                Apne dream partner ko chand alfaaz me describe karein
              </label>
              <textarea
                id="dreamPartnerSummary"
                rows={4}
                className="input-base input-user w-full resize-none"
                {...register("reflections.dreamPartnerSummary")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nonNegotiableQuality" className="text-sm font-medium text-[var(--text-secondary)]">
                Aisi kaunsi ek quality hai jis par aap bilkul compromise nahin kar sakte?
              </label>
              <textarea
                id="nonNegotiableQuality"
                rows={4}
                className="input-base input-user w-full resize-none"
                {...register("reflections.nonNegotiableQuality")}
              />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
              People who know their ideal partner clearly are 63% more likely to choose the right relationship.
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button type="button" onClick={() => setStep(4)} className="btn-ghost">
                Back
              </button>
              <button
                type="submit"
                disabled={pending || alreadySubmitted}
                className="btn-user shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                {pending ? "Building your ideal profile..." : "See result"}
              </button>
            </div>
          </section>
        ) : null}
      </form>
    </div>
  );
}
