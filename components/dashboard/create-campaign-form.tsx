"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { createCampaignAction } from "@/app/create-campaign/actions";

type CreateCampaignFormValues = {
  name: string;
  testType: "comparison" | "ideal" | "secret" | "personality";
  crushName: string;
  message: string;
  finalMessage: string;
};

const testTypeOptions = [
  {
    value: "comparison",
    label: "Crush Comparison",
    short: "CP",
    desc: "Compare a few people and follow where your answers keep leaning.",
  },
  {
    value: "ideal",
    label: "Ideal Partner",
    short: "IP",
    desc: "Discover the emotional traits and relationship style you want most.",
  },
  {
    value: "secret",
    label: "Secret Crush Finder",
    short: "SC",
    desc: "Turn subtle behavior into a playful confidence read for top suspects.",
  },
  {
    value: "personality",
    label: "Love Personality",
    short: "LP",
    desc: "A tighter question set that reveals love style and attachment energy.",
  },
] as const;

const steps = [
  "Pick a test type",
  "Name your campaign",
  "Write optional messaging",
  "Publish and share",
];

export function CreateCampaignForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCampaignFormValues>({
    defaultValues: {
      name: "",
      testType: "comparison",
      crushName: "",
      message: "",
      finalMessage: "",
    },
  });

  const selectedType = useWatch({ control, name: "testType" });
  const currentStep = selectedType ? 2 : 1;

  const onSubmit = handleSubmit((values) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createCampaignAction(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push(`/dashboard/campaign/${result.campaignId}`);
      router.refresh();
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="glass-card rounded-[2rem] p-6">
        <span className="badge-user">Progress</span>
        <h2 className="mt-4 text-2xl font-semibold text-white">Build flow</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
          This form keeps the backend logic untouched and only upgrades the way users move through
          campaign creation.
        </p>

        <div className="mt-6 space-y-3">
          {steps.map((step, index) => {
            const active = index <= currentStep;

            return (
              <div
                key={step}
                className={`rounded-2xl border px-4 py-4 ${
                  active
                    ? "border-rose-500/25 bg-rose-500/10 text-white"
                    : "border-white/8 bg-white/4 text-[var(--text-body)]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Step {index + 1}</p>
                <p className="mt-1 font-medium">{step}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-white/8 bg-slate-950/45 p-5">
          <p className="text-sm font-medium text-white">Current selection</p>
          <p className="mt-2 text-lg font-semibold text-rose-200">
            {testTypeOptions.find((option) => option.value === selectedType)?.label ?? "Choose a type"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Swap test types anytime before submitting. Nothing saves until you publish.
          </p>
        </div>
      </aside>

      <div className="glass-card gradient-border-user rounded-[2rem] p-6 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          {serverError ? (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {serverError}
            </div>
          ) : null}

          <section className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Step 1</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Choose the experience</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Select the campaign type that best matches the emotional journey you want to offer.
              </p>
            </div>

            <Controller
              name="testType"
              control={control}
              rules={{ required: "Test type is required." }}
              render={({ field }) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  {testTypeOptions.map((option) => {
                    const isSelected = field.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`relative rounded-[1.5rem] border p-5 text-left ${
                          isSelected
                            ? "border-rose-500/30 bg-rose-500/10 shadow-[var(--shadow-user)]"
                            : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/6"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 text-sm font-bold text-white">
                            {option.short}
                          </span>
                          {isSelected ? (
                            <span className="rounded-full border border-rose-500/25 bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-100">
                              Selected
                            </span>
                          ) : null}
                        </div>
                        <h4 className="mt-5 text-lg font-semibold text-white">{option.label}</h4>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{option.desc}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.testType ? <p className="text-sm text-rose-200">{errors.testType.message}</p> : null}
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Step 2</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Campaign details</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Add the headline people will see first, plus an optional target name.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium text-[var(--text-body)]">
                Campaign name
              </label>
              <input
                id="name"
                type="text"
                placeholder="For example: Do you secretly like me?"
                className="input-base input-user"
                {...register("name", {
                  required: "Campaign name is required.",
                  minLength: {
                    value: 2,
                    message: "Campaign name must be at least 2 characters.",
                  },
                })}
              />
              <p className="text-xs text-[var(--text-muted)]">
                This becomes the public title shown on the shared test page.
              </p>
              {errors.name ? <p className="text-sm text-rose-200">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="crushName" className="text-sm font-medium text-[var(--text-body)]">
                Target name
              </label>
              <input
                id="crushName"
                type="text"
                placeholder="Optional, for example Alex"
                className="input-base input-user"
                {...register("crushName")}
              />
              <p className="text-xs text-[var(--text-muted)]">
                Useful when the quiz is themed around one specific person.
              </p>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Step 3</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Optional messaging</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Give the public page a warmer intro and a more thoughtful finish.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-[var(--text-body)]">
                Intro message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Invite people in with a playful or thoughtful opening line."
                className="input-base input-user resize-none"
                {...register("message")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="finalMessage" className="text-sm font-medium text-[var(--text-body)]">
                Final message
              </label>
              <textarea
                id="finalMessage"
                rows={4}
                placeholder="Thank them, tease the result, or leave a memorable final note."
                className="input-base input-user resize-none"
                {...register("finalMessage")}
              />
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              When you publish, the app will generate a unique share slug and take you to analytics.
            </p>
            <button type="submit" disabled={pending} className="btn-user min-w-[14rem]">
              {pending ? "Creating campaign..." : "Create campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
