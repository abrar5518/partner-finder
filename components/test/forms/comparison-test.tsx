"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitPublicTestAction } from "@/app/test/actions";
import { useReactionVideo } from "@/components/test/reaction-video-context";
import { useStepScroll } from "@/components/test/forms/use-step-scroll";

type CandidateFormValues = {
  name: string;
  howYouKnowThem: string;
  knownDuration: string;
  currentRelationship: string;
};

type ComparisonTestValues = {
  candidates: [CandidateFormValues, CandidateFormValues, CandidateFormValues];
  emotionalPull: {
    candidate0: number;
    candidate1: number;
    candidate2: number;
    futureVision: string;
    jealousyReaction: string;
    emotionalUnderstanding: string;
  };
  compatibility: {
    supportGoals: string;
    trueSelf: string;
    difficultDay: string;
    trustSecrets: string;
  };
  attraction: {
    physicalAttraction: string;
    holdingHands: string;
    happiestConfession: string;
  };
  intuitionChoice: string;
  reflections: {
    realizationMoment: string;
    softHeartThing: string;
  };
  website: string;
};

type ComparisonTestProps = {
  slug: string;
  campaignName: string;
};

type CandidateIndex = 0 | 1 | 2;

const candidateIndexes = [0, 1, 2] as const satisfies readonly CandidateIndex[];

const stepLabels = [
  "Log Add Karein",
  "Dil Ki Kheench",
  "Suitability",
  "Attraction",
  "Fori Faisla",
  "Chupi Feelings",
];

const howYouKnowThemOptions = [
  "Dost",
  "Colleague",
  "Classmate",
  "Online dost",
  "Purana dost",
  "Kuch aur",
];

const knownDurationOptions = [
  "3 mah se kam",
  "3 se 12 mah",
  "1 se 3 saal",
  "3 saal se zyada",
];

const relationshipOptions = [
  "Sirf jaan pehchan",
  "Casual dost",
  "Close dost",
  "Best friend",
];

const feelingScaleOptions = [
  { value: 1, title: "Bilkul normal", hint: "Khas farq nahin parta" },
  { value: 2, title: "Thori khushi", hint: "Halka sa acha lagta hai" },
  { value: 3, title: "Khushi hoti hai", hint: "Dil halka sa uthal puthal hota hai" },
  { value: 4, title: "Bohat excitement", hint: "Mood foran better ho jata hai" },
  { value: 5, title: "Dil muskura uthta hai", hint: "Andar se strong feeling aati hai" },
];

const jealousyOptions = [
  { value: "1", label: "Mujhe farq nahin parega" },
  { value: "2", label: "Thora uncomfortable feel hoga" },
  { value: "3", label: "Mujhe udaasi hogi" },
  { value: "4", label: "Afsos hoga ke maine bataya nahin" },
  { value: "5", label: "Dil toot jaye ga" },
];

function OptionCard({
  title,
  hint,
  checked,
  onSelect,
}: {
  title: string;
  hint?: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onSelect}
      className={`flex min-h-28 flex-col justify-between rounded-2xl border px-4 py-4 text-left transition ${
        checked
          ? "border-[var(--user-primary)] bg-[var(--user-primary)]/10 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          : "border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] text-[var(--text-secondary)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">{title}</span>
          <span
            className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${
              checked
                ? "border-[var(--user-primary)]/40 bg-[var(--user-primary)]/20 text-[var(--user-primary)]"
                : "border-[var(--border-subtle)] bg-transparent text-[var(--text-muted)]"
            }`}
          >
            {checked ? "Select" : "Pick"}
          </span>
        </div>
        {hint ? <p className="text-sm leading-6 text-slate-400">{hint}</p> : null}
      </div>
    </button>
  );
}

function ScaleCard({
  value,
  title,
  hint,
  checked,
  onSelect,
}: {
  value: number;
  title: string;
  hint: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onSelect}
      className={`flex min-h-32 flex-col justify-between rounded-2xl border px-4 py-4 text-left transition ${
        checked
          ? "border-[var(--user-primary)] bg-[var(--user-primary)]/10 text-white shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          : "border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] text-[var(--text-secondary)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]"
      }`}
    >
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
        checked ? "border-[var(--user-primary)] bg-[var(--user-primary)]/20 text-[var(--user-primary)]" : "border-[var(--border-subtle)] bg-transparent"
      }`}>
        {value}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm leading-6 text-slate-400">{hint}</p>
      </div>
    </button>
  );
}

export function ComparisonTest({ slug, campaignName }: ComparisonTestProps) {
  const { finalizeRecording } = useReactionVideo();
  const [step, setStep] = useState(0);
  const [visibleCandidates, setVisibleCandidates] = useState(2);
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadySubmitted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(`submitted_test_${slug}`) === "true";
  });
  const [pending, startTransition] = useTransition();
  const stepContainerRef = useStepScroll<HTMLDivElement>(step);
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
  } = useForm<ComparisonTestValues>({
    defaultValues: {
      candidates: [
        {
          name: "",
          howYouKnowThem: "",
          knownDuration: "",
          currentRelationship: "",
        },
        {
          name: "",
          howYouKnowThem: "",
          knownDuration: "",
          currentRelationship: "",
        },
        {
          name: "",
          howYouKnowThem: "",
          knownDuration: "",
          currentRelationship: "",
        },
      ],
      emotionalPull: {
        candidate0: 0,
        candidate1: 0,
        candidate2: 0,
        futureVision: "",
        jealousyReaction: "",
        emotionalUnderstanding: "",
      },
      compatibility: {
        supportGoals: "",
        trueSelf: "",
        difficultDay: "",
        trustSecrets: "",
      },
      attraction: {
        physicalAttraction: "",
        holdingHands: "",
        happiestConfession: "",
      },
      intuitionChoice: "",
      reflections: {
        realizationMoment: "",
        softHeartThing: "",
      },
      website: "",
    },
  });

  const watchedCandidates = useWatch({
    control,
    name: "candidates",
  });
  const watchedEmotionalPull = useWatch({
    control,
    name: "emotionalPull",
  });
  const watchedCompatibility = useWatch({
    control,
    name: "compatibility",
  });
  const watchedAttraction = useWatch({
    control,
    name: "attraction",
  });
  const watchedIntuitionChoice = useWatch({
    control,
    name: "intuitionChoice",
  });

  const activeCandidates = useMemo(
    () =>
      candidateIndexes
        .slice(0, visibleCandidates)
        .map((index) => {
          const candidate = watchedCandidates?.[index];
          const name = candidate?.name?.trim() ?? "";

          return {
            index,
            name,
            label: name || `Shakhs ${index + 1}`,
          };
        })
        .filter((candidate) => candidate.name),
    [visibleCandidates, watchedCandidates],
  );

  function validateCandidateNames() {
    const names = getValues("candidates")
      .slice(0, visibleCandidates)
      .map((candidate) => candidate.name.trim())
      .filter(Boolean);

    const uniqueNames = new Set(names.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== names.length) {
      setServerError("Har candidate ka naam alag hona chahiye.");
      return false;
    }

    setServerError(null);
    return true;
  }

  async function goToEmotionalPull() {
    if (!validateCandidateNames()) {
      return;
    }

    setStep(1);
  }

  async function goToCompatibility() {
    setServerError(null);
    setStep(2);
  }

  async function goToAttraction() {
    setServerError(null);
    setStep(3);
  }

  async function goToIntuition() {
    setServerError(null);
    setStep(4);
  }

  async function goToReflections() {
    setServerError(null);
    setStep(5);
  }

  const onSubmit = handleSubmit((values) => {
    if (alreadySubmitted) {
      setServerError("Aap yeh test pehle complete kar chuke hain.");
      return;
    }

    const preparedCandidates = values.candidates
      .slice(0, visibleCandidates)
      .map((candidate) => ({
        name: candidate.name.trim(),
        howYouKnowThem: candidate.howYouKnowThem || undefined,
        knownDuration: candidate.knownDuration || undefined,
        currentRelationship: candidate.currentRelationship || undefined,
      }));
    const activeCandidateNames = new Set(
      preparedCandidates.map((candidate) => candidate.name).filter(Boolean),
    );
    const optionalCandidateValue = (value: string) =>
      activeCandidateNames.has(value) ? value : undefined;

    setServerError(null);

    startTransition(async () => {
      const reactionVideoPath = await finalizeRecording();
      const result = await submitPublicTestAction({
        slug,
        testType: "comparison",
        website: values.website,
        reactionVideoPath,
        answers: {
          candidates: preparedCandidates,
          emotionalPull: {
            messageOrPresenceReaction: preparedCandidates.map((candidate, index) => ({
              candidateName: candidate.name,
              score: Number(values.emotionalPull[`candidate${index as 0 | 1 | 2}`]),
            })).filter((entry) => entry.candidateName),
            futureVision:
              values.emotionalPull.futureVision === "Abhi sure nahin"
                ? "Abhi sure nahin"
                : optionalCandidateValue(values.emotionalPull.futureVision),
            jealousyReaction: values.emotionalPull.jealousyReaction || undefined,
            emotionalUnderstanding: optionalCandidateValue(values.emotionalPull.emotionalUnderstanding),
          },
          compatibility: {
            supportGoals: optionalCandidateValue(values.compatibility.supportGoals),
            trueSelf: optionalCandidateValue(values.compatibility.trueSelf),
            difficultDay: optionalCandidateValue(values.compatibility.difficultDay),
            trustSecrets: optionalCandidateValue(values.compatibility.trustSecrets),
          },
          attraction: {
            physicalAttraction: optionalCandidateValue(values.attraction.physicalAttraction),
            holdingHands: optionalCandidateValue(values.attraction.holdingHands),
            happiestConfession: optionalCandidateValue(values.attraction.happiestConfession),
          },
          intuitionChoice: optionalCandidateValue(values.intuitionChoice),
          reflections: {
            realizationMoment: values.reflections.realizationMoment.trim() || undefined,
            softHeartThing: values.reflections.softHeartThing.trim() || undefined,
          },
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
        {stepLabels.map((label, index) => {
          const active = index === step;
          const complete = index < step;

          return (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-3 text-sm transition ${
                active
                  ? "border-[var(--user-primary)] bg-[var(--user-primary)]/10 text-[var(--user-primary)]"
                  : complete
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] text-[var(--text-muted)]"
              }`}
            >
              <div className="font-medium">Marhala {index + 1}</div>
              <div>{label}</div>
            </div>
          );
        })}
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {serverError}
        </div>
      ) : null}

      {alreadySubmitted ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Aap yeh test pehle complete kar chuke hain.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="comparison-website">Website</label>
          <input id="comparison-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {step === 0 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Jin logon ko aap consider kar rahe hain unhen add karein</h2>
              <p className="text-sm leading-6 text-slate-400">
                {campaignName} ke liye 2 ya 3 log add karein. Wording gender-neutral rakhi gayi hai taa ke yeh test sab ke liye fit rahe.
              </p>
            </div>

            <div className="grid gap-5">
              {candidateIndexes.slice(0, visibleCandidates).map((index) => (
                <div key={index} className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Shakhs {index + 1}</h3>
                      <p className="text-sm text-[var(--text-muted)]">Basic details fill karein.</p>
                    </div>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                      {watchedCandidates?.[index]?.name?.trim() || `Shakhs ${index + 1}`}
                    </span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor={`candidate-name-${index}`} className="text-sm font-medium text-[var(--text-secondary)]">
                        Naam ya nickname
                      </label>
                      <input
                        id={`candidate-name-${index}`}
                        type="text"
                        placeholder={index < 2 ? "Agar chahein to naam likhein" : "Teesra shakhs optional hai"}
                        className="input-base input-user w-full"
                        {...register(`candidates.${index}.name`)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`candidate-how-${index}`} className="text-sm font-medium text-[var(--text-secondary)]">
                        Aap inhen kaise jaante hain?
                      </label>
                      <select
                        id={`candidate-how-${index}`}
                        className="input-base input-user w-full"
                        {...register(`candidates.${index}.howYouKnowThem`)}
                      >
                        <option value="">Select karna zaroori nahin</option>
                        {howYouKnowThemOptions.map((option) => (
                          <option key={`${index}-how-${option}`} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`candidate-duration-${index}`} className="text-sm font-medium text-[var(--text-secondary)]">
                        Kitne arse se jaante hain?
                      </label>
                      <select
                        id={`candidate-duration-${index}`}
                        className="input-base input-user w-full"
                        {...register(`candidates.${index}.knownDuration`)}
                      >
                        <option value="">Select karna zaroori nahin</option>
                        {knownDurationOptions.map((option) => (
                          <option key={`${index}-duration-${option}`} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor={`candidate-relationship-${index}`} className="text-sm font-medium text-[var(--text-secondary)]">
                        Is waqt aap ka rishta kya hai?
                      </label>
                      <select
                        id={`candidate-relationship-${index}`}
                        className="input-base input-user w-full"
                        {...register(`candidates.${index}.currentRelationship`)}
                      >
                        <option value="">Select karna zaroori nahin</option>
                        {relationshipOptions.map((option) => (
                          <option key={`${index}-relationship-${option}`} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCandidates < 3 ? (
              <button
                type="button"
                onClick={() => setVisibleCandidates(3)}
                className="btn-ghost w-full py-4 border-dashed border-2 text-[var(--user-primary)]"
              >
                + Ek aur shakhs add karein
              </button>
            ) : null}

            <div className="flex justify-end border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button
                type="button"
                onClick={() => {
                  void goToEmotionalPull();
                }}
                className="btn-user px-8"
              >
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Dil ki kheench wale sawal</h2>
              <p className="text-sm leading-6 text-slate-400">
                Yeh marhala real emotional pull ko samajhne ke liye hai. Jo sab se honest lagay woh select karein.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
              <h3 className="text-lg font-semibold text-white">
                Jab aap unhen samne dekhte hain ya unka message notice karte hain to aap kaisa feel karte hain?
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Har shakhs ke liye 1 se 5 tak ek option select karein.
              </p>

              <div className="mt-5 grid gap-4">
                {activeCandidates.map((candidate) => {
                  const currentValue = watchedEmotionalPull?.[`candidate${candidate.index}`] ?? 3;

                  return (
                    <div key={`feel-${candidate.index}`} className="rounded-2xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{candidate.label}</p>
                        <p className="text-sm text-[var(--user-primary)]">
                          {currentValue > 0 ? `Selected score: ${currentValue}/5` : "Selection optional hai"}
                        </p>
                      </div>

                      <input
                        type="hidden"
                        {...register(`emotionalPull.candidate${candidate.index}`, {
                          valueAsNumber: true,
                        })}
                      />

                      <div className="grid gap-3 md:grid-cols-5">
                        {feelingScaleOptions.map((option) => (
                          <ScaleCard
                            key={`${candidate.index}-reaction-${option.value}`}
                            value={option.value}
                            title={option.title}
                            hint={option.hint}
                            checked={currentValue === option.value}
                            onSelect={() =>
                              setValue(`emotionalPull.candidate${candidate.index}`, option.value, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">
                Agar aap 5 saal baad apni future life imagine karein to us tasweer me kaun nazar aata hai?
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {activeCandidates.map((candidate) => (
                  <OptionCard
                    key={`future-${candidate.index}`}
                    title={candidate.label}
                    checked={watchedEmotionalPull?.futureVision === candidate.name}
                    onSelect={() =>
                      setValue("emotionalPull.futureVision", candidate.name, {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }
                  />
                ))}
                <OptionCard
                  title="Abhi sure nahin"
                  checked={watchedEmotionalPull?.futureVision === "Abhi sure nahin"}
                  onSelect={() =>
                    setValue("emotionalPull.futureVision", "Abhi sure nahin", {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                />
              </div>
              <input
                type="hidden"
                {...register("emotionalPull.futureVision")}
              />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">
                Agar kal se woh kisi aur ke sath date karna shuru kar dein to aap kaisa feel karein ge?
              </h3>
              <div className="mt-4 grid gap-3">
                {jealousyOptions.map((option) => (
                  <OptionCard
                    key={`jealousy-${option.value}`}
                    title={option.label}
                    checked={watchedEmotionalPull?.jealousyReaction === option.value}
                    onSelect={() =>
                      setValue("emotionalPull.jealousyReaction", option.value, {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }
                  />
                ))}
              </div>
              <input
                type="hidden"
                {...register("emotionalPull.jealousyReaction")}
              />
            </div>

            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
              <h3 className="text-lg font-semibold text-white">Aap ko emotionally sab se zyada kaun samajhta hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {activeCandidates.map((candidate) => (
                  <OptionCard
                    key={`understands-${candidate.index}`}
                    title={candidate.label}
                    checked={watchedEmotionalPull?.emotionalUnderstanding === candidate.name}
                    onSelect={() =>
                      setValue("emotionalPull.emotionalUnderstanding", candidate.name, {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }
                  />
                ))}
              </div>
              <input
                type="hidden"
                {...register("emotionalPull.emotionalUnderstanding")}
              />
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  void goToCompatibility();
                }}
                className="btn-user"
              >
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Suitability aur comfort</h2>
              <p className="text-sm leading-6 text-slate-400">Yahan logic aur comfort dono compare hon ge.</p>
            </div>

            {[
              { key: "supportGoals", title: "Aap ke goals aur ambitions ko sab se zyada kaun support karta hai?" },
              { key: "trueSelf", title: "Aap kis ke sath sab se zyada apna asli version feel karte hain?" },
              { key: "difficultDay", title: "Agar aap ka din mushkil guzray to sab se pehle kis se baat karna chahein ge?" },
              { key: "trustSecrets", title: "Apne secrets ke liye aap sab se zyada kis par trust karte hain?" },
            ].map((question) => (
              <div key={question.key} className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
                <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {activeCandidates.map((candidate) => (
                    <OptionCard
                      key={`${question.key}-${candidate.index}`}
                      title={candidate.label}
                      checked={
                        watchedCompatibility?.[question.key as keyof ComparisonTestValues["compatibility"]] ===
                        candidate.name
                      }
                      onSelect={() =>
                        setValue(
                          `compatibility.${question.key as keyof ComparisonTestValues["compatibility"]}`,
                          candidate.name,
                          {
                            shouldValidate: true,
                            shouldTouch: true,
                          },
                        )
                      }
                    />
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register(`compatibility.${question.key as keyof ComparisonTestValues["compatibility"]}`)}
                />
              </div>
            ))}

            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  void goToAttraction();
                }}
                className="btn-user"
              >
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Attraction signals</h2>
              <p className="text-sm leading-6 text-slate-400">Yeh sawal natural attraction aur inner pull ko check karte hain.</p>
            </div>

            {[
              { key: "physicalAttraction", title: "Aap physically sab se zyada kis ki taraf attract feel karte hain?" },
              { key: "holdingHands", title: "Jab aap kisi ke sath haath pakarne ka imagine karte hain to kaun dimagh me aata hai?" },
              { key: "happiestConfession", title: "Agar aaj un me se koi apni feelings confess kare to kis ki baat sab se zyada khushi degi?" },
            ].map((question) => (
              <div key={question.key} className="rounded-3xl border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)] p-5">
                <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {activeCandidates.map((candidate) => (
                    <OptionCard
                      key={`${question.key}-${candidate.index}`}
                      title={candidate.label}
                      checked={
                        watchedAttraction?.[question.key as keyof ComparisonTestValues["attraction"]] ===
                        candidate.name
                      }
                      onSelect={() =>
                        setValue(`attraction.${question.key as keyof ComparisonTestValues["attraction"]}`, candidate.name, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                    />
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register(`attraction.${question.key as keyof ComparisonTestValues["attraction"]}`)}
                />
              </div>
            ))}

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  void goToIntuition();
                }}
                className="btn-user"
              >
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">3 second wala gut decision</h2>
              <p className="text-sm leading-6 text-slate-400">
                Zyada na sochain. Jo naam foran dimagh me aaye, bas usi ko select karein.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {activeCandidates.map((candidate) => (
                <OptionCard
                  key={`intuition-${candidate.index}`}
                  title={candidate.label}
                  checked={watchedIntuitionChoice === candidate.name}
                  onSelect={() =>
                    setValue("intuitionChoice", candidate.name, {
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                />
              ))}
            </div>
            <input
              type="hidden"
              {...register("intuitionChoice")}
            />

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  void goToReflections();
                }}
                className="btn-user"
              >
                Next step
              </button>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Chupi hui feelings</h2>
              <p className="text-sm leading-6 text-slate-400">
                In 2 short answers se result zyada personal aur deep ho jaye ga.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="realizationMoment" className="text-sm font-medium text-[var(--text-secondary)]">
                Woh moment likhein jab aap ko laga ke shayad aap unhen pasand karte hain
              </label>
              <textarea
                id="realizationMoment"
                rows={4}
                className="input-base input-user w-full resize-none"
                {...register("reflections.realizationMoment")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="softHeartThing" className="text-sm font-medium text-[var(--text-secondary)]">
                Un ki kaunsi ek baat aap ke dil ko naram kar deti hai?
              </label>
              <textarea
                id="softHeartThing"
                rows={4}
                className="input-base input-user w-full resize-none"
                {...register("reflections.softHeartThing")}
              />
            </div>

            <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 mt-6">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-ghost"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={pending || alreadySubmitted}
                className="btn-user shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                {pending ? "Preparing your result..." : "See result"}
              </button>
            </div>
          </section>
        ) : null}
      </form>
    </div>
  );
}
