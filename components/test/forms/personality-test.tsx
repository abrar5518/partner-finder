"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitPublicTestAction } from "@/app/test/actions";

type PersonalityValues = {
  personalityProfile: {
    emotionalExpression: string;
    relationshipFear: string;
    loveMeaning: string;
    idealDateEnergy: string;
    whenHurtNeed: string;
    firstAttraction: string;
    naturalLoveStyle: string;
    longTermValue: string;
  };
  website: string;
};

type PersonalityTestProps = {
  slug: string;
  campaignName: string;
};

const questions = [
  {
    key: "emotionalExpression",
    title: "Question 1 of 8",
    subtitle: "Relationships me aap naturally kis tarah hote hain?",
    options: [
      { value: "romanticDreamer", label: "Pyar openly aur romantically express karta/karti hun" },
      { value: "loyalProtector", label: "Khamoshi se loyal aur supportive rehta/rehti hun" },
      { value: "deepSoulmate", label: "Partner ko protect aur take care karta/karti hun" },
      { value: "independentSpirit", label: "Apni independence rakhte hue bhi deeply care karta/karti hun" },
    ],
  },
  {
    key: "relationshipFear",
    title: "Question 2 of 8",
    subtitle: "Aap ka sab se bara relationship fear kya hota hai?",
    options: [
      { value: "loyalProtector", label: "Betray ya cheat hona" },
      { value: "romanticDreamer", label: "Emotionally ignore kiya jana" },
      { value: "independentSpirit", label: "Apni freedom lose kar dena" },
      { value: "deepSoulmate", label: "Misunderstood feel karna" },
    ],
  },
  {
    key: "loveMeaning",
    title: "Question 3 of 8",
    subtitle: "Aap ke liye real love ka matlab kya hai?",
    options: [
      { value: "romanticDreamer", label: "Passion aur emotional connection" },
      { value: "loyalProtector", label: "Loyalty aur commitment" },
      { value: "deepSoulmate", label: "Mutual support aur protection" },
      { value: "independentSpirit", label: "Ek dosre ki space respect karna" },
    ],
  },
  {
    key: "idealDateEnergy",
    title: "Question 4 of 8",
    subtitle: "Aap ke liye perfect date kis type ki hoti hai?",
    options: [
      { value: "romanticDreamer", label: "Romantic candlelight dinner" },
      { value: "deepSoulmate", label: "Deep conversation wali raat" },
      { value: "loyalProtector", label: "Safe aur cozy evening together" },
      { value: "independentSpirit", label: "Spontaneous adventure" },
    ],
  },
  {
    key: "whenHurtNeed",
    title: "Question 5 of 8",
    subtitle: "Jab aap hurt hote hain to partner se kya chahte hain?",
    options: [
      { value: "deepSoulmate", label: "Emotional comfort" },
      { value: "romanticDreamer", label: "Reassurance ke sab theek hai" },
      { value: "loyalProtector", label: "Defend ya support kare" },
      { value: "independentSpirit", label: "Mujhe space de" },
    ],
  },
  {
    key: "firstAttraction",
    title: "Question 6 of 8",
    subtitle: "Jab aap kisi naye shakhs se milte hain to sab se pehle kya attract karta hai?",
    options: [
      { value: "romanticDreamer", label: "Charm aur chemistry" },
      { value: "loyalProtector", label: "Honesty aur consistency" },
      { value: "deepSoulmate", label: "Strength aur protective nature" },
      { value: "independentSpirit", label: "Confidence aur independence" },
    ],
  },
  {
    key: "naturalLoveStyle",
    title: "Question 7 of 8",
    subtitle: "Aap ka natural love style kis ke qareeb hai?",
    options: [
      { value: "romanticDreamer", label: "Passionate aur expressive" },
      { value: "loyalProtector", label: "Calm aur stable" },
      { value: "deepSoulmate", label: "Devoted aur protective" },
      { value: "independentSpirit", label: "Free-spirited aur unpredictable" },
    ],
  },
  {
    key: "longTermValue",
    title: "Question 8 of 8",
    subtitle: "Long-term relationship me aap ke liye sab se zyada kya matter karta hai?",
    options: [
      { value: "romanticDreamer", label: "Emotional intensity" },
      { value: "loyalProtector", label: "Trust aur loyalty" },
      { value: "deepSoulmate", label: "Safety aur security" },
      { value: "independentSpirit", label: "Freedom aur individuality" },
    ],
  },
] as const;

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
      className={`flex min-h-24 items-center rounded-2xl border px-4 py-4 text-left text-sm transition ${
        checked
          ? "border-cyan-300/50 bg-cyan-300/12 text-cyan-50 shadow-[0_0_0_1px_rgba(103,232,249,0.15)]"
          : "border-white/10 bg-slate-950/70 text-slate-200 hover:border-cyan-300/30 hover:bg-slate-950"
      }`}
    >
      {title}
    </button>
  );
}

export function PersonalityTest({ slug, campaignName }: PersonalityTestProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadySubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(`submitted_test_${slug}`) === "true",
  );
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, control } = useForm<PersonalityValues>({
    defaultValues: {
      personalityProfile: {
        emotionalExpression: "",
        relationshipFear: "",
        loveMeaning: "",
        idealDateEnergy: "",
        whenHurtNeed: "",
        firstAttraction: "",
        naturalLoveStyle: "",
        longTermValue: "",
      },
      website: "",
    },
  });
  const watchedProfile = useWatch({ control, name: "personalityProfile" });

  const onSubmit = handleSubmit((values) => {
    if (alreadySubmitted) {
      setServerError("Aap yeh test pehle complete kar chuke hain.");
      return;
    }

    const scoreKeys = [
      values.personalityProfile.emotionalExpression,
      values.personalityProfile.relationshipFear,
      values.personalityProfile.loveMeaning,
      values.personalityProfile.idealDateEnergy,
      values.personalityProfile.whenHurtNeed,
      values.personalityProfile.firstAttraction,
      values.personalityProfile.naturalLoveStyle,
      values.personalityProfile.longTermValue,
    ].filter(Boolean);

    const scores = {
      romanticDreamer: 0,
      loyalProtector: 0,
      independentSpirit: 0,
      deepSoulmate: 0,
    };
    scoreKeys.forEach((key) => {
      if (key in scores) {
        scores[key as keyof typeof scores] += 1;
      }
    });

    const dominantType =
      (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof scores | undefined) ??
      "loyalProtector";

    setServerError(null);

    startTransition(async () => {
      const result = await submitPublicTestAction({
        slug,
        testType: "personality",
        website: values.website,
        answers: {
          personalityProfile: {
            emotionalExpression: values.personalityProfile.emotionalExpression || undefined,
            relationshipFear: values.personalityProfile.relationshipFear || undefined,
            loveMeaning: values.personalityProfile.loveMeaning || undefined,
            idealDateEnergy: values.personalityProfile.idealDateEnergy || undefined,
            whenHurtNeed: values.personalityProfile.whenHurtNeed || undefined,
            firstAttraction: values.personalityProfile.firstAttraction || undefined,
            naturalLoveStyle: values.personalityProfile.naturalLoveStyle || undefined,
            longTermValue: values.personalityProfile.longTermValue || undefined,
          },
          personalityScores: scores,
          personalityArchetype: dominantType,
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Love Personality Test</h2>
        <p className="text-sm text-slate-400">
          {campaignName} ke liye 8 psychology-based sawalon ke zariye aap ka natural love style samjha jaye ga.
        </p>
        <p className="text-sm text-slate-500">Aap ke answers aap ki natural love style reveal karte hain. Yahan koi right ya wrong answer nahin.</p>
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {serverError}
        </div>
      ) : null}

      <div className="hidden" aria-hidden="true">
        <label htmlFor="personality-website">Website</label>
        <input id="personality-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-4">
        {questions.map((question) => (
          <div key={question.key} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">{question.title}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{question.subtitle}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {question.options.map((option) => (
                <OptionCard
                  key={`${question.key}-${option.value}`}
                  title={option.label}
                  checked={
                    watchedProfile?.[question.key as keyof PersonalityValues["personalityProfile"]] === option.value
                  }
                  onSelect={() =>
                    setValue(`personalityProfile.${question.key as keyof PersonalityValues["personalityProfile"]}`, option.value)
                  }
                />
              ))}
            </div>
            <input type="hidden" {...register(`personalityProfile.${question.key as keyof PersonalityValues["personalityProfile"]}`)} />
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm leading-6 text-slate-300">
        Aap ki choices attachment style, emotional intensity, aur independence preference ke bare me clues deti hain.
      </div>

      <button
        type="submit"
        disabled={pending || alreadySubmitted}
        className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Love style analyze ho rahi hai..." : "Result dekhein"}
      </button>
    </form>
  );
}
