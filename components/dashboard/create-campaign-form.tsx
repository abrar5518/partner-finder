"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { createCampaignAction } from "@/app/create-campaign/actions";

type CreateCampaignFormValues = {
  name: string;
  testType: "comparison" | "ideal" | "secret" | "personality";
  crushName: string;
  message: string;
  finalMessage: string;
};

const testTypeOptions = [
  { value: "comparison", label: "Crush Comparison" },
  { value: "ideal", label: "Ideal Partner" },
  { value: "secret", label: "Secret Crush Finder" },
  { value: "personality", label: "Love Personality Test" },
] as const;

export function CreateCampaignForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
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
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {serverError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Campaign Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="My Secret Crush Test"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          {...register("name", {
            required: "Campaign name is required.",
            minLength: {
              value: 2,
              message: "Campaign name must be at least 2 characters.",
            },
          })}
        />
        {errors.name ? (
          <p className="text-sm text-rose-200">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="testType" className="text-sm font-medium text-slate-200">
          Select Test Type
        </label>
        <select
          id="testType"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          {...register("testType", {
            required: "Test type is required.",
          })}
        >
          {testTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.testType ? (
          <p className="text-sm text-rose-200">{errors.testType.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="crushName" className="text-sm font-medium text-slate-200">
          Optional Crush Name
        </label>
        <input
          id="crushName"
          type="text"
          placeholder="Optional display name"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          {...register("crushName")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-200">
          Intro Message
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Add a short intro before the questions start."
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          {...register("message")}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="finalMessage" className="text-sm font-medium text-slate-200">
          Final Message
        </label>
        <textarea
          id="finalMessage"
          rows={4}
          placeholder="Add a closing message shown at the end."
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          {...register("finalMessage")}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating Campaign..." : "Create Campaign"}
      </button>
    </form>
  );
}
