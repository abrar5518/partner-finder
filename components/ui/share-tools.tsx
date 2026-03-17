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

const platformLabels: Record<SharePlatform, string> = {
  whatsapp: "WhatsApp Share",
  facebook: "Facebook Share",
  twitter: "Twitter/X Share",
  telegram: "Telegram Share",
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
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4">
        <p className="break-all text-sm text-cyan-200">{link}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>

        {platforms.map((platform) => (
          <a
            key={platform}
            href={buildShareUrl(platform, link, message)}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-950"
          >
            {platformLabels[platform]}
          </a>
        ))}
      </div>
    </section>
  );
}
