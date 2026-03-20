"use client";

import { useState } from "react";

type SharePlatform = "whatsapp" | "facebook" | "twitter" | "telegram";

type ShareToolsProps = {
  title: string;
  description: string;
  link: string;
  message: string;
  platforms: SharePlatform[];
};

const platformMeta: Record<
  SharePlatform,
  {
    label: string;
    short: string;
    accent: string;
  }
> = {
  whatsapp: {
    label: "WhatsApp",
    short: "WA",
    accent: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
  },
  facebook: {
    label: "Facebook",
    short: "FB",
    accent: "border-sky-500/25 bg-sky-500/10 text-sky-200",
  },
  twitter: {
    label: "X",
    short: "X",
    accent: "border-slate-300/20 bg-white/5 text-slate-100",
  },
  telegram: {
    label: "Telegram",
    short: "TG",
    accent: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
  },
};

function buildShareUrl(platform: SharePlatform, link: string, message: string) {
  const encodedLink = encodeURIComponent(link);
  const encodedMessage = encodeURIComponent(`${message} ${link}`);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedMessage}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedLink}&text=${encodeURIComponent(message)}`;
    default:
      return link;
  }
}

export function ShareTools({
  title,
  description,
  link,
  message,
  platforms,
}: ShareToolsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <span className="badge-user">Share campaign</span>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-body)]">{description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {platforms.map((platform) => (
            <a
              key={platform}
              href={buildShareUrl(platform, link, message)}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${platformMeta[platform].accent}`}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/20 bg-black/10 text-[11px] font-bold">
                {platformMeta[platform].short}
              </span>
              {platformMeta[platform].label}
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[1.6rem] p-4">
        <p className="text-sm font-medium text-white">Sharable URL</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Copy once, paste anywhere. Great for stories, DMs, and groups.
        </p>
        <div className="mt-4 rounded-2xl border border-white/6 bg-black/20 p-3">
          <p className="break-all font-mono text-sm text-rose-200">{link}</p>
        </div>
        <button type="button" onClick={() => void handleCopy()} className="btn-user mt-4 w-full">
          {copied ? "Copied link" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
