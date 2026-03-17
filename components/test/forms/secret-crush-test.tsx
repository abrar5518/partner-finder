"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitPublicTestAction } from "@/app/test/actions";
import { useStepScroll } from "@/components/test/forms/use-step-scroll";

const signOptions = [
  "Mujhe aksar dekhta/dekhti hai",
  "Reply unusual speed se karta/karti hai",
  "Meri choti details yaad rakhta/rakhti hai",
  "Baat karne ka bahana dhoondta/dhoondti hai",
  "Help karne ki koshish karta/karti hai",
  "Mere around thora different behave karta/karti hai",
  "Jealous ya protective lagta/lagti hai",
  "Mera relationship status pooch chuka/chuki hai",
  "Notice karta/karti hai jab main upset hota/hoti hun",
  "Mere around zyada hasta/hasti hai",
  "Playfully tease karta/karti hai",
  "Conversation khud start karta/karti hai",
  "Stories/posts bohat jaldi dekhta/dekhti hai",
  "Mere samne nervous lagta/lagti hai",
  "Group me mujhe special attention deta/deti hai",
];

type SuspectValues = {
  name: string;
  relationType: string;
  reasonText: string;
  signs: string[];
  signFrequency: string;
  expressionContext: string;
  reactionToOthers: string;
  absenceResponse: string;
  gutScore: number;
};

type SecretCrushValues = {
  confidenceLevel: string;
  lifeContext: string;
  suspects: [SuspectValues, SuspectValues, SuspectValues];
  overallPattern: {
    recentAttention: string;
    firstSuspicionTrigger: string;
    friendsHint: string;
    privateVsPublic: string;
    specialGestureLevel: string;
    specialGestureText: string;
    overthinkingCheck: string;
    confessionWithoutWords: string;
  };
  finalPick: string;
  website: string;
};

type SecretCrushTestProps = {
  slug: string;
  campaignName: string;
};

type SuspectIndex = 0 | 1 | 2;

const suspectIndexes = [0, 1, 2] as const satisfies readonly SuspectIndex[];
const stepLabels = ["Opening", "Suspects", "Behavior", "Reality Check", "Final Pick"];

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
      className={`flex min-h-24 flex-col justify-between rounded-2xl border px-4 py-4 text-left transition ${
        checked
          ? "border-cyan-300/50 bg-cyan-300/12 text-cyan-50 shadow-[0_0_0_1px_rgba(103,232,249,0.15)]"
          : "border-white/10 bg-slate-950/70 text-slate-200 hover:border-cyan-300/30 hover:bg-slate-950"
      }`}
    >
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {hint ? <p className="mt-2 text-sm leading-6 text-slate-400">{hint}</p> : null}
      </div>
    </button>
  );
}

export function SecretCrushTest({ slug, campaignName }: SecretCrushTestProps) {
  const [step, setStep] = useState(0);
  const [visibleSuspects, setVisibleSuspects] = useState(2);
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadySubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(`submitted_test_${slug}`) === "true",
  );
  const [pending, startTransition] = useTransition();
  const stepContainerRef = useStepScroll<HTMLDivElement>(step);
  const { register, setValue, handleSubmit, control } = useForm<SecretCrushValues>({
    defaultValues: {
      confidenceLevel: "",
      lifeContext: "",
      suspects: [
        {
          name: "",
          relationType: "",
          reasonText: "",
          signs: [],
          signFrequency: "",
          expressionContext: "",
          reactionToOthers: "",
          absenceResponse: "",
          gutScore: 0,
        },
        {
          name: "",
          relationType: "",
          reasonText: "",
          signs: [],
          signFrequency: "",
          expressionContext: "",
          reactionToOthers: "",
          absenceResponse: "",
          gutScore: 0,
        },
        {
          name: "",
          relationType: "",
          reasonText: "",
          signs: [],
          signFrequency: "",
          expressionContext: "",
          reactionToOthers: "",
          absenceResponse: "",
          gutScore: 0,
        },
      ],
      overallPattern: {
        recentAttention: "",
        firstSuspicionTrigger: "",
        friendsHint: "",
        privateVsPublic: "",
        specialGestureLevel: "",
        specialGestureText: "",
        overthinkingCheck: "",
        confessionWithoutWords: "",
      },
      finalPick: "",
      website: "",
    },
  });

  const watchedSuspects = useWatch({ control, name: "suspects" });
  const watchedConfidence = useWatch({ control, name: "confidenceLevel" });
  const watchedContext = useWatch({ control, name: "lifeContext" });
  const watchedPattern = useWatch({ control, name: "overallPattern" });
  const watchedFinalPick = useWatch({ control, name: "finalPick" });

  const activeSuspects = useMemo(
    () =>
      suspectIndexes.slice(0, visibleSuspects).map((index) => {
        const name = watchedSuspects?.[index]?.name?.trim() ?? "";
        return {
          index,
          name,
          label: name || `Shakhs ${index + 1}`,
        };
      }),
    [visibleSuspects, watchedSuspects],
  );

  const onSubmit = handleSubmit((values) => {
    if (alreadySubmitted) {
      setServerError("Aap yeh test pehle complete kar chuke hain.");
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const suspects = values.suspects.slice(0, visibleSuspects).map((suspect) => ({
        name: suspect.name.trim() || undefined,
        relationType: suspect.relationType || undefined,
        reasonText: suspect.reasonText.trim() || undefined,
        signs: suspect.signs.length > 0 ? suspect.signs : undefined,
        signFrequency: suspect.signFrequency || undefined,
        expressionContext: suspect.expressionContext || undefined,
        reactionToOthers: suspect.reactionToOthers || undefined,
        absenceResponse: suspect.absenceResponse || undefined,
        gutScore: suspect.gutScore > 0 ? Number(suspect.gutScore) : undefined,
      }));

      const result = await submitPublicTestAction({
        slug,
        testType: "secret",
        website: values.website,
        answers: {
          confidenceLevel: values.confidenceLevel || undefined,
          lifeContext: values.lifeContext || undefined,
          suspects,
          overallPattern: {
            recentAttention: values.overallPattern.recentAttention || undefined,
            firstSuspicionTrigger: values.overallPattern.firstSuspicionTrigger || undefined,
            friendsHint: values.overallPattern.friendsHint || undefined,
            privateVsPublic: values.overallPattern.privateVsPublic || undefined,
            specialGestureLevel: values.overallPattern.specialGestureLevel || undefined,
            specialGestureText: values.overallPattern.specialGestureText.trim() || undefined,
            overthinkingCheck: values.overallPattern.overthinkingCheck || undefined,
            confessionWithoutWords: values.overallPattern.confessionWithoutWords || undefined,
          },
          finalPick: values.finalPick || undefined,
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
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={`rounded-2xl border px-4 py-3 text-sm transition ${
              index === step
                ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                : index < step
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-slate-900/50 text-slate-400"
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
          <label htmlFor="secret-website">Website</label>
          <input id="secret-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {step === 0 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Secret Crush Finder</h2>
              <p className="text-sm leading-6 text-slate-400">
                Signs notice karein, clues follow karein, aur dekhein ke {campaignName} me kaun aap ko secretly like kar sakta hai.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
              <h3 className="text-lg font-semibold text-white">Kya aap ko lagta hai ke kisi ke feelings aap ke liye hain?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Haan, main almost sure hun", "Mujhe strong suspicion hai", "Shayad, kuch signs notice hue hain", "Main confused hun magar curious hun", "Honestly mujhe idea nahin"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedConfidence === option}
                    onSelect={() => setValue("confidenceLevel", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("confidenceLevel")} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
              <h3 className="text-lg font-semibold text-white">Yeh shakhs aap ki life me zyada tar kahan se related hai?</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Friend circle", "Workplace", "University / School", "Social media / online", "Family connection / family friend", "Neighbor / local circle", "Kuch aur"].map((option) => (
                  <OptionCard
                    key={option}
                    title={option}
                    checked={watchedContext === option}
                    onSelect={() => setValue("lifeContext", option)}
                  />
                ))}
              </div>
              <input type="hidden" {...register("lifeContext")} />
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setStep(1)} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Agla marhala
              </button>
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Kin logon par aap ko shak hai?</h2>
              <p className="text-sm leading-6 text-slate-400">
                3 tak possible log add karein. Har ek ke liye behavior, frequency, aur gut feeling batayein.
              </p>
            </div>

            <div className="grid gap-5">
              {suspectIndexes.slice(0, visibleSuspects).map((index) => {
                const suspect = watchedSuspects?.[index];
                const currentName = suspect?.name?.trim() || `Shakhs ${index + 1}`;
                return (
                  <div key={index} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Suspect {index + 1}</h3>
                        <p className="text-sm text-slate-400">Clues ko thora structure dein.</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
                        {currentName}
                      </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor={`suspect-name-${index}`} className="text-sm font-medium text-slate-200">
                          Naam ya nickname
                        </label>
                        <input
                          id={`suspect-name-${index}`}
                          type="text"
                          placeholder="Agar chahein to naam likhein"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
                          {...register(`suspects.${index}.name`)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor={`suspect-relation-${index}`} className="text-sm font-medium text-slate-200">
                          Aap ka un ke sath relation kya hai?
                        </label>
                        <select
                          id={`suspect-relation-${index}`}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                          {...register(`suspects.${index}.relationType`)}
                        >
                          <option value="">Optional</option>
                          {["Close friend", "Casual friend", "Classmate / colleague", "Kabhi kabhi baat hoti hai", "Notice karte hain magar baat kam hoti hai", "Mostly online connection"].map((option) => (
                            <option key={`${index}-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor={`suspect-reason-${index}`} className="text-sm font-medium text-slate-200">
                          Aap ko kyun lagta hai ke shayad yeh aap ko like karte hain?
                        </label>
                        <textarea
                          id={`suspect-reason-${index}`}
                          rows={3}
                          placeholder="Moments, behavior, vibe ya koi specific cheez likhein"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
                          {...register(`suspects.${index}.reasonText`)}
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <p className="text-sm font-medium text-slate-200">Woh kaun kaun se signs show karte hain?</p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {signOptions.map((option) => {
                            const selected = suspect?.signs?.includes(option) ?? false;
                            return (
                              <label
                                key={`${index}-${option}`}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                                  selected
                                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                                    : "border-white/10 bg-slate-950/70 text-slate-200"
                                }`}
                              >
                                <input type="checkbox" value={option} className="accent-cyan-300" {...register(`suspects.${index}.signs`)} />
                                {option}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`suspect-frequency-${index}`} className="text-sm font-medium text-slate-200">
                          Yeh signs kitni dafa hote hain?
                        </label>
                        <select
                          id={`suspect-frequency-${index}`}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                          {...register(`suspects.${index}.signFrequency`)}
                        >
                          <option value="">Optional</option>
                          {["Rarely", "Sometimes", "Often", "Very often", "Almost every time we interact"].map((option) => (
                            <option key={`${index}-freq-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`suspect-context-${index}`} className="text-sm font-medium text-slate-200">
                          Woh sab se zyada expressive kab lagte hain?
                        </label>
                        <select
                          id={`suspect-context-${index}`}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                          {...register(`suspects.${index}.expressionContext`)}
                        >
                          <option value="">Optional</option>
                          {["In person", "On chat", "In group settings", "Jab hum akele hon", "Hamesha subtle rehte hain"].map((option) => (
                            <option key={`${index}-context-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`suspect-reaction-${index}`} className="text-sm font-medium text-slate-200">
                          Jab aap kisi aur ka zikr karte hain to in ka reaction kaisa hota hai?
                        </label>
                        <select
                          id={`suspect-reaction-${index}`}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                          {...register(`suspects.${index}.reactionToOthers`)}
                        >
                          <option value="">Optional</option>
                          {["No reaction", "Slightly curious", "Quiet ya awkward", "Jokingly jealous", "Clearly uncomfortable", "Maine notice nahin kiya"].map((option) => (
                            <option key={`${index}-reaction-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={`suspect-absence-${index}`} className="text-sm font-medium text-slate-200">
                          Agar aap kuch din gayab ho jayein to yeh kya karein ge?
                        </label>
                        <select
                          id={`suspect-absence-${index}`}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                          {...register(`suspects.${index}.absenceResponse`)}
                        >
                          <option value="">Optional</option>
                          {["Probably kuch nahin", "Baad me notice karein ge", "Casually check in karein ge", "Message karein ge", "Definitely poochein ge kahan thay"].map((option) => (
                            <option key={`${index}-absence-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between gap-3">
                          <label htmlFor={`suspect-gut-${index}`} className="text-sm font-medium text-slate-200">
                            Aap ka gut is shakhs ke bare me kya kehta hai?
                          </label>
                          <p className="text-sm text-cyan-200">
                            {(suspect?.gutScore ?? 0) > 0 ? `${suspect?.gutScore}/5` : "Optional"}
                          </p>
                        </div>
                        <input
                          id={`suspect-gut-${index}`}
                          type="range"
                          min={0}
                          max={5}
                          className="w-full accent-cyan-300"
                          {...register(`suspects.${index}.gutScore`, { valueAsNumber: true })}
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Random guess</span>
                          <span>Mujhe strong feel hota hai</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleSuspects < 3 ? (
              <button
                type="button"
                onClick={() => setVisibleSuspects(3)}
                className="rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-300/5 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/10"
              >
                Ek aur suspect add karein
              </button>
            ) : null}

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(0)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900">
                Wapas
              </button>
              <button type="button" onClick={() => setStep(2)} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Agla marhala
              </button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Behavior pattern questions</h2>
              <p className="text-sm leading-6 text-slate-400">Yeh overall clues ko samajhne me help karte hain.</p>
            </div>

            {[
              { key: "recentAttention", title: "Kya kisi ne recently aap ko zyada attention dena shuru ki hai?", options: ["Haan, bohat clearly", "Thori si", "Shayad online only", "Main sure nahin", "No"] },
              { key: "firstSuspicionTrigger", title: "Sab se pehle kis cheez ne aap ko suspicious banaya?", options: ["Eye contact", "Fast replies", "Unexpected care", "Jealousy", "Random compliments", "Extra attention", "Un ke friends ka behavior", "Aik aisi vibe jo explain nahin hoti"] },
              { key: "friendsHint", title: "Kya un ke friends ne kabhi hint diya?", options: ["Haan, directly", "Indirectly / jokingly", "Mujhe laga kuch imply hua", "No", "Not sure"] },
              { key: "privateVsPublic", title: "Kya woh privately public se zyada expressive lagte hain?", options: ["Haan, bohat zyada", "Kuch had tak", "No, same everywhere", "Main bata nahin sakta/sakti"] },
              { key: "specialGestureLevel", title: "Kya unhon ne kabhi aap ke liye koi small but special cheez ki?", options: ["Haan, kai dafa", "Haan, 1 ya 2 dafa", "Shayad", "No"] },
              { key: "overthinkingCheck", title: "Kya mumkin hai ke aap simple kindness ko romantic interest samajh rahe hon?", options: ["Possibly yes", "Thora sa", "Not really", "Bilkul nahin"] },
              { key: "confessionWithoutWords", title: "Agar yeh person kabhi confess na bhi kare to bhi kya behavior special lagta hai?", options: ["Haan, definitely", "Probably", "Not sure", "Maybe not"] },
            ].map((question) => (
              <div key={question.key} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => (
                    <OptionCard
                      key={`${question.key}-${option}`}
                      title={option}
                      checked={watchedPattern?.[question.key as keyof SecretCrushValues["overallPattern"]] === option}
                      onSelect={() =>
                        setValue(
                          `overallPattern.${question.key as keyof SecretCrushValues["overallPattern"]}`,
                          option,
                        )
                      }
                    />
                  ))}
                </div>
                <input type="hidden" {...register(`overallPattern.${question.key as keyof SecretCrushValues["overallPattern"]}`)} />
              </div>
            ))}

            <div className="space-y-2">
              <label htmlFor="specialGestureText" className="text-sm font-medium text-slate-200">
                Agar chahein to likhein: unhon ne aap ke liye kya special kiya?
              </label>
              <input
                id="specialGestureText"
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
                {...register("overallPattern.specialGestureText")}
              />
            </div>

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900">
                Wapas
              </button>
              <button type="button" onClick={() => setStep(3)} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Agla marhala
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Reverse psychology check</h2>
              <p className="text-sm leading-6 text-slate-400">Is se overthinking aur real interest me farq samajhne me madad milti hai.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
              <p className="text-sm leading-7 text-slate-300">
                Reality check: subtle signs real ho sakte hain, lekin har warmth crush nahin hoti. Is liye result me hum confidence ke sath caution bhi dikhayen ge.
              </p>
            </div>

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900">
                Wapas
              </button>
              <button type="button" onClick={() => setStep(4)} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Agla marhala
              </button>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Final gut pick</h2>
              <p className="text-sm leading-6 text-slate-400">Agar abhi isi waqt aik naam par bet lagani ho to aap kis ko choose karein ge?</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {activeSuspects.map((suspect) => (
                <OptionCard
                  key={`final-${suspect.index}`}
                  title={suspect.label}
                  checked={watchedFinalPick === suspect.name}
                  onSelect={() => setValue("finalPick", suspect.name)}
                />
              ))}
              <OptionCard
                title="Main abhi decide nahin kar sakta/sakti"
                checked={watchedFinalPick === "Main abhi decide nahin kar sakta/sakti"}
                onSelect={() => setValue("finalPick", "Main abhi decide nahin kar sakta/sakti")}
              />
            </div>
            <input type="hidden" {...register("finalPick")} />

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(3)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900">
                Wapas
              </button>
              <button
                type="submit"
                disabled={pending || alreadySubmitted}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Clues analyze ho rahe hain..." : "Result dekhein"}
              </button>
            </div>
          </section>
        ) : null}
      </form>
    </div>
  );
}
