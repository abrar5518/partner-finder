import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareTools } from "@/components/ui/share-tools";
import { env } from "@/lib/env";
import { getCampaignResponseBySlugAndResponseId } from "@/lib/campaigns";

type TestResultPageProps = {
  params: Promise<{
    slug: string;
    responseId: string;
  }>;
};

type ComparisonAnswers = {
  candidates?: Array<{
    name?: string;
    howYouKnowThem?: string;
    knownDuration?: string;
    currentRelationship?: string;
  }>;
  emotionalPull?: {
    messageOrPresenceReaction?: Array<{
      candidateName?: string;
      score?: number;
    }>;
    futureVision?: string;
    jealousyReaction?: string;
    emotionalUnderstanding?: string;
  };
  compatibility?: {
    supportGoals?: string;
    trueSelf?: string;
    difficultDay?: string;
    trustSecrets?: string;
  };
  attraction?: {
    physicalAttraction?: string;
    holdingHands?: string;
    happiestConfession?: string;
  };
  intuitionChoice?: string;
  reflections?: {
    realizationMoment?: string;
    softHeartThing?: string;
  };
};

type IdealAnswers = {
  warmup?: {
    relationshipStyle?: string;
    relationshipPriority?: string;
  };
  emotionalNeeds?: {
    stressSupport?: string;
    communicationStyle?: string;
    loveLanguage?: string;
  };
  lifestyleCompatibility?: {
    preferredLifestyle?: string;
    attractivePersonality?: string;
    ambitionLevel?: number;
  };
  attractionChemistry?: {
    attractiveVibe?: string;
    firstAttraction?: string;
  };
  futureVision?: {
    relationshipFuture?: string;
    topValue?: string;
  };
  dreamPartnerSummary?: string;
  nonNegotiableQuality?: string;
  idealPartnerType?: string;
};

type SecretAnswers = {
  confidenceLevel?: string;
  lifeContext?: string;
  suspects?: Array<{
    name?: string;
    relationType?: string;
    reasonText?: string;
    signs?: string[];
    signFrequency?: string;
    expressionContext?: string;
    reactionToOthers?: string;
    absenceResponse?: string;
    gutScore?: number;
  }>;
  overallPattern?: {
    recentAttention?: string;
    firstSuspicionTrigger?: string;
    friendsHint?: string;
    privateVsPublic?: string;
    specialGestureLevel?: string;
    specialGestureText?: string;
    overthinkingCheck?: string;
    confessionWithoutWords?: string;
  };
  finalPick?: string;
};

type PersonalityAnswers = {
  personalityProfile?: {
    emotionalExpression?: string;
    relationshipFear?: string;
    loveMeaning?: string;
    idealDateEnergy?: string;
    whenHurtNeed?: string;
    firstAttraction?: string;
    naturalLoveStyle?: string;
    longTermValue?: string;
  };
  personalityScores?: Record<string, number>;
  personalityArchetype?: string;
};

function formatList(items: string[]) {
  if (items.length === 0) return "balanced qualities";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function titleize(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function card(title: string, value: string, text?: string) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {text ? <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p> : null}
    </div>
  );
}

function buildComparisonResult(raw: ComparisonAnswers) {
  const candidates = (Array.isArray(raw.candidates) ? raw.candidates : [])
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate?.name?.trim()))
    .map((candidate) => ({
      name: candidate.name?.trim() ?? "Unknown",
      howYouKnowThem: candidate.howYouKnowThem?.trim() || "Unknown",
      knownDuration: candidate.knownDuration?.trim() || "Unknown",
      currentRelationship: candidate.currentRelationship?.trim() || "Unknown",
    }));

  const scores = new Map<
    string,
    {
      name: string;
      howYouKnowThem: string;
      knownDuration: string;
      currentRelationship: string;
      emotional: number;
      trust: number;
      future: number;
      attraction: number;
      intuition: number;
      total: number;
      wins: number;
      emotionalSignals: number;
      trustSignals: number;
      attractionSignals: number;
    }
  >();

  candidates.forEach((candidate) => {
    scores.set(candidate.name, {
      ...candidate,
      emotional: 0,
      trust: 0,
      future: 0,
      attraction: 0,
      intuition: 0,
      total: 0,
      wins: 0,
      emotionalSignals: 0,
      trustSignals: 0,
      attractionSignals: 0,
    });
  });

  const reactions = Array.isArray(raw.emotionalPull?.messageOrPresenceReaction)
    ? raw.emotionalPull?.messageOrPresenceReaction ?? []
    : [];
  reactions.forEach((reaction) => {
    const name = reaction.candidateName?.trim() ?? "";
    const entry = scores.get(name);
    const score = Number(reaction.score ?? 0);
    if (!entry || score < 1 || score > 5) return;
    entry.emotional += (score / 5) * 30;
    entry.emotionalSignals = score;
  });

  const jealousyReaction = Number(raw.emotionalPull?.jealousyReaction ?? 0);
  if (jealousyReaction >= 1 && jealousyReaction <= 5) {
    const futureName = raw.emotionalPull?.futureVision?.trim() ?? "";
    if (futureName && futureName !== "Abhi sure nahin") {
      const futureEntry = scores.get(futureName);
      if (futureEntry) {
        futureEntry.future += 10 + jealousyReaction * 2;
      }
    }
  }

  const emotionalUnderstanding = raw.emotionalPull?.emotionalUnderstanding?.trim() ?? "";
  if (emotionalUnderstanding) {
    const entry = scores.get(emotionalUnderstanding);
    if (entry) {
      entry.emotional += 10;
      entry.trust += 8;
      entry.wins += 1;
    }
  }

  const supportGoals = raw.compatibility?.supportGoals?.trim() ?? "";
  const trueSelf = raw.compatibility?.trueSelf?.trim() ?? "";
  const difficultDay = raw.compatibility?.difficultDay?.trim() ?? "";
  const trustSecrets = raw.compatibility?.trustSecrets?.trim() ?? "";
  [supportGoals, trueSelf, difficultDay, trustSecrets].forEach((name, index) => {
    const entry = scores.get(name);
    if (!entry) return;
    entry.trust += [7, 7, 5.5, 5.5][index] ?? 0;
    entry.trustSignals += 1;
    entry.wins += 1;
  });

  const physicalAttraction = raw.attraction?.physicalAttraction?.trim() ?? "";
  const holdingHands = raw.attraction?.holdingHands?.trim() ?? "";
  const happiestConfession = raw.attraction?.happiestConfession?.trim() ?? "";
  [physicalAttraction, holdingHands, happiestConfession].forEach((name, index) => {
    const entry = scores.get(name);
    if (!entry) return;
    entry.attraction += [5, 5, 5][index] ?? 0;
    entry.attractionSignals += 1;
    entry.wins += 1;
  });

  const intuitionChoice = raw.intuitionChoice?.trim() ?? "";
  if (intuitionChoice) {
    const entry = scores.get(intuitionChoice);
    if (entry) {
      entry.intuition += 10;
      entry.wins += 1;
    }
  }

  scores.forEach((entry) => {
    entry.total = Math.round(
      Math.min(
        100,
        entry.emotional + entry.trust + entry.future + entry.attraction + entry.intuition,
      ),
    );
  });

  const rankedCandidates = [...scores.values()].sort((left, right) => right.total - left.total);
  const leader = rankedCandidates[0] ?? null;
  const runnerUp = rankedCandidates[1] ?? null;
  const certaintyGap = leader && runnerUp ? leader.total - runnerUp.total : 0;

  const futureVision = raw.emotionalPull?.futureVision?.trim() ?? "";
  const reflectionMoment =
    raw.reflections?.realizationMoment?.trim() || "There was a quiet moment where your feelings became more real to you.";
  const softHeartThing =
    raw.reflections?.softHeartThing?.trim() || "Something about their presence softens your heart more than you usually admit.";

  const strongestSignals = [
    leader?.emotional >= 24 ? `you feel the strongest emotional spark with ${leader.name}` : null,
    leader?.trust >= 18 ? `you trust ${leader?.name} more deeply than the others` : null,
    futureVision === leader?.name
      ? `when you imagined your future, ${leader?.name} appeared first`
      : null,
    leader?.attraction >= 10 ? `${leader?.name} also stands out in physical attraction` : null,
    intuitionChoice === leader?.name
      ? `your quick gut decision also pointed toward ${leader?.name}`
      : null,
  ].filter((item): item is string => Boolean(item));

  const headline =
    certaintyGap >= 12
      ? `Your heart seems to lean toward ${leader?.name ?? "someone special"}`
      : `Your feelings are leaning toward ${leader?.name ?? "someone special"}`;

  const summary =
    leader
      ? strongestSignals.length > 0
        ? `Based on your answers, ${strongestSignals.slice(0, 3).join(", ")}.`
        : `${leader.name} quietly stayed ahead across your emotional, comfort, and instinct-based answers.`
      : "Your answers suggest you are still exploring your feelings.";

  const psychologyNotes = [
    "Emotional projection",
    "Loss reaction",
    "Future visualization",
    "Intuition decision",
    "Comfort and trust indicators",
  ];

  return {
    rankedCandidates,
    leader,
    runnerUp,
    certaintyGap,
    futureVision,
    intuitionChoice,
    reflectionMoment,
    softHeartThing,
    jealousyReaction,
    headline,
    summary,
    strongestSignals,
    psychologyNotes,
  };
}

function renderComparison(raw: ComparisonAnswers) {
  const analysis = buildComparisonResult(raw);

  return (
    <>
      <section className="rounded-[2rem] border border-rose-300/15 bg-[radial-gradient(circle_at_top,_rgba(251,113,133,0.20),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.92),rgba(17,24,39,0.96))] p-8 shadow-2xl shadow-rose-950/20">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-rose-300/30 bg-rose-300/10 px-4 py-1 text-sm font-medium text-rose-100">
            Heart Reading Result
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {analysis.headline}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-slate-200">{analysis.summary}</p>
            {analysis.leader ? (
              <p className="max-w-3xl text-sm leading-7 text-slate-300">
                This suggests your feelings for <span className="font-semibold text-white">{analysis.leader.name}</span> may be deeper than you realize.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {card(
          "Top Match",
          analysis.leader?.name ?? "Still unclear",
          analysis.leader
            ? `${analysis.leader.total}% weighted heart score across emotion, trust, future vision, attraction, and intuition.`
            : "Your answers were too mixed to point strongly toward one person.",
        )}
        {card(
          "Future Vision",
          analysis.futureVision || "Not sure yet",
          analysis.futureVision === "Abhi sure nahin"
            ? "Your heart is still gathering clarity when you imagine the future."
            : "The person you pictured in your future often matters more than people expect.",
        )}
        {card(
          "Gut Choice",
          analysis.intuitionChoice || "Not answered",
          "Your 3-second decision is one of the strongest hidden indicators in this test.",
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-white">Weighted Score Breakdown</h2>
          <p className="mt-2 text-sm text-slate-400">
            Emotional pull 30%, trust and comfort 25%, future vision 20%, attraction 15%, intuition 10%.
          </p>
          <div className="mt-5 space-y-5">
            {analysis.rankedCandidates.map((candidate) => (
              <article key={candidate.name} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {candidate.howYouKnowThem} | {candidate.currentRelationship} | {candidate.knownDuration}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-100">
                    {candidate.total}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-300 via-cyan-300 to-emerald-300"
                    style={{ width: `${candidate.total}%` }}
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-5">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Emotion</p>
                    <p className="mt-2 text-sm font-semibold text-white">{candidate.emotional.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trust</p>
                    <p className="mt-2 text-sm font-semibold text-white">{candidate.trust.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Future</p>
                    <p className="mt-2 text-sm font-semibold text-white">{candidate.future.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attraction</p>
                    <p className="mt-2 text-sm font-semibold text-white">{candidate.attraction.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Intuition</p>
                    <p className="mt-2 text-sm font-semibold text-white">{candidate.intuition.toFixed(1)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Why This Person Stands Out</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {analysis.strongestSignals.length > 0 ? (
                analysis.strongestSignals.map((signal) => (
                  <p key={signal}>• {titleize(signal)}</p>
                ))
              ) : (
                <p>Your feelings look mixed, so your heart may still be deciding.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Hidden Feelings You Wrote</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <div>
                <p className="text-slate-500">Moment you noticed your feelings</p>
                <p className="mt-2 text-slate-100">{analysis.reflectionMoment}</p>
              </div>
              <div>
                <p className="text-slate-500">What softens your heart</p>
                <p className="mt-2 text-slate-100">{analysis.softHeartThing}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Psychology Signals Used</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.psychologyNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function renderIdeal(raw: IdealAnswers) {
  const scores = {
    romantic: 0,
    protector: 0,
    playful: 0,
    soulmate: 0,
  };

  const warmupStyle = raw.warmup?.relationshipStyle?.trim() ?? "";
  const relationshipPriority = raw.warmup?.relationshipPriority?.trim() ?? "";
  const stressSupport = raw.emotionalNeeds?.stressSupport?.trim() ?? "";
  const communicationStyle = raw.emotionalNeeds?.communicationStyle?.trim() ?? "";
  const loveLanguage = raw.emotionalNeeds?.loveLanguage?.trim() ?? "";
  const preferredLifestyle = raw.lifestyleCompatibility?.preferredLifestyle?.trim() ?? "";
  const attractivePersonality = raw.lifestyleCompatibility?.attractivePersonality?.trim() ?? "";
  const ambitionLevel = Number(raw.lifestyleCompatibility?.ambitionLevel ?? 0);
  const attractiveVibe = raw.attractionChemistry?.attractiveVibe?.trim() ?? "";
  const firstAttraction = raw.attractionChemistry?.firstAttraction?.trim() ?? "";
  const relationshipFuture = raw.futureVision?.relationshipFuture?.trim() ?? "";
  const topValue = raw.futureVision?.topValue?.trim() ?? "";

  if (warmupStyle.includes("Romantic")) scores.romantic += 3;
  if (warmupStyle.includes("Calm") || warmupStyle.includes("loyal")) scores.protector += 3;
  if (warmupStyle.includes("Funny") || warmupStyle.includes("playful")) scores.playful += 3;
  if (warmupStyle.includes("Deep") || warmupStyle.includes("emotional")) scores.soulmate += 3;

  if (relationshipPriority.includes("Trust") || relationshipPriority.includes("security")) scores.protector += 2;
  if (relationshipPriority.includes("Love")) scores.romantic += 2;
  if (relationshipPriority.includes("Emotional")) scores.soulmate += 2;
  if (relationshipPriority.includes("Fun")) scores.playful += 2;

  if (stressSupport.includes("emotional comfort") || stressSupport.includes("sunay")) scores.soulmate += 2;
  if (stressSupport.includes("advice") || stressSupport.includes("space")) scores.protector += 2;
  if (stressSupport.includes("fun")) scores.playful += 2;

  if (communicationStyle.includes("Sara din") || communicationStyle.includes("meaningful")) scores.romantic += 2;
  if (communicationStyle.includes("balanced")) scores.protector += 1;
  if (communicationStyle.includes("zaroorat")) scores.protector += 1;

  if (loveLanguage.includes("words") || loveLanguage.includes("sweet")) scores.romantic += 3;
  if (loveLanguage.includes("Quality")) scores.soulmate += 3;
  if (loveLanguage.includes("Physical")) scores.romantic += 2;
  if (loveLanguage.includes("Helpful")) scores.protector += 3;
  if (loveLanguage.includes("Loyalty")) scores.protector += 3;

  if (preferredLifestyle.includes("Travel") || preferredLifestyle.includes("Social")) scores.playful += 3;
  if (preferredLifestyle.includes("Calm") || preferredLifestyle.includes("Family")) scores.protector += 2;
  if (preferredLifestyle.includes("Balanced")) scores.soulmate += 2;

  if (attractivePersonality.includes("Confident")) scores.romantic += 2;
  if (attractivePersonality.includes("Kind") || attractivePersonality.includes("Calm")) scores.protector += 2;
  if (attractivePersonality.includes("Funny")) scores.playful += 2;
  if (attractivePersonality.includes("Intelligent")) scores.soulmate += 2;

  if (ambitionLevel >= 4) scores.protector += 2;
  if (attractiveVibe.includes("romantic")) scores.romantic += 3;
  if (attractiveVibe.includes("Protective") || attractiveVibe.includes("stable")) scores.protector += 3;
  if (attractiveVibe.includes("Fun")) scores.playful += 3;
  if (attractiveVibe.includes("Mysterious") || attractiveVibe.includes("deep")) scores.soulmate += 3;

  if (firstAttraction.includes("smile") || firstAttraction.includes("confidence")) scores.romantic += 1;
  if (firstAttraction.includes("kindness")) scores.protector += 1;
  if (firstAttraction.includes("personality")) scores.playful += 1;
  if (firstAttraction.includes("intelligence")) scores.soulmate += 1;

  if (relationshipFuture.includes("Marriage") || relationshipFuture.includes("Long term")) scores.protector += 2;
  if (relationshipFuture.includes("Slow emotional")) scores.soulmate += 2;
  if (topValue.includes("Passion")) scores.romantic += 2;
  if (topValue.includes("Stability") || topValue.includes("Loyalty")) scores.protector += 2;
  if (topValue.includes("Mutual growth")) scores.playful += 1;
  if (topValue.includes("Emotional")) scores.soulmate += 2;

  const typeMap = {
    romantic: {
      name: "Romantic Supporter",
      summary: "Aap ka ideal partner pyar ko openly show karta hai, baat samajhta hai, aur emotional connection ko strong rakhta hai.",
    },
    protector: {
      name: "Loyal Protector",
      summary: "Aap stability, trust, loyalty, aur safe relationship energy ko sab se zyada value dete hain.",
    },
    playful: {
      name: "Playful Adventurer",
      summary: "Aap ko aisa partner pasand hai jo life me fun, movement, aur halka sa spark lekar aaye.",
    },
    soulmate: {
      name: "Deep Soulmate",
      summary: "Aap ka dil un logon ki taraf jata hai jo emotionally deep, samajhdar, aur thoughtful hon.",
    },
  } as const;

  const dominantKey =
    (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof typeMap | undefined) ??
    "protector";
  const dominant = typeMap[dominantKey];

  const strengths = [
    relationshipPriority || "trust aur connection",
    loveLanguage || "consistent care",
    preferredLifestyle || "balanced life",
  ].filter(Boolean);
  const mustHaveQualities = [
    relationshipPriority || "trustworthy",
    loveLanguage || "emotionally expressive",
    attractivePersonality || "balanced personality",
    topValue || "clear values",
  ].filter(Boolean);
  const bestFitQualities = [
    attractiveVibe || "calm aur caring",
    relationshipFuture || "serious intention",
    stressSupport || "emotionally available",
  ].filter(Boolean);
  const dreamPartnerSummary =
    raw.dreamPartnerSummary?.trim() ||
    "Aap ka ideal partner emotionally available, loyal, aur naturally caring hota hai.";
  const nonNegotiableQuality =
    raw.nonNegotiableQuality?.trim() || "Trust aur consistency";
  const simpleAdvice =
    dominantKey === "romantic"
      ? "Aap ke liye aisa partner best rahe ga jo pyar openly show kare, communication clear rakhe, aur aap ko emotionally reassure kare."
      : dominantKey === "playful"
        ? "Aap ke liye aisa partner best rahe ga jo light-hearted ho, life me energy laye, aur relationship ko boring na hone de."
        : dominantKey === "soulmate"
          ? "Aap ke liye aisa partner best rahe ga jo deep emotional understanding rakhe, thoughtful ho, aur aap ki inner feelings ko samajh sake."
          : "Aap ke liye aisa partner best rahe ga jo loyal, stable, dependable, aur emotionally safe environment dene wala ho.";
  const avoidType =
    dominantKey === "romantic"
      ? "cold ya emotionally unavailable log"
      : dominantKey === "playful"
        ? "bohat rigid aur dull energy wale log"
        : dominantKey === "soulmate"
          ? "surface-level aur emotionally closed log"
          : "unreliable aur inconsistent log";

  return (
    <>
      <section className="rounded-[2rem] border border-fuchsia-300/15 bg-[radial-gradient(circle_at_top,_rgba(232,121,249,0.20),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.92),rgba(17,24,39,0.96))] p-8 shadow-2xl shadow-fuchsia-950/20">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-1 text-sm font-medium text-fuchsia-100">
            Ideal Partner Result
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Your Ideal Partner Type: {dominant.name}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-slate-200">{dominant.summary}</p>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              Aap naturally un relationships ki taraf jate hain jahan {formatList(strengths.map((item) => item.toLowerCase()))} sab se pehle aate hain.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {card("Aap Ko Kaisa Partner Suit Karega", dominant.name, simpleAdvice)}
        {card("Aap Ko Sab Se Zyada Kya Chahiye", relationshipPriority || "Abhi open", "Yeh aap ke relationship decision ka core signal hai.")}
        {card("Aap Ka Future Mood", relationshipFuture || "Abhi explore kar rahe hain", "Long-term soch aap ke ideal partner type ko shape karti hai.")}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-white">Seedha Aur Simple Result</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              {simpleAdvice}
            </p>
            <p>
              Aap ko aisa partner dhoondna chahiye jis me {formatList(mustHaveQualities.map((item) => item.toLowerCase()))} jaisi qualities hon.
            </p>
            <p>
              Psychological level par aap un logon ke sath best connect karte hain jo {formatList(bestFitQualities.map((item) => item.toLowerCase()))} energy rakhte hon.
            </p>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-slate-500">Aap ka non-negotiable</p>
              <p className="mt-2 text-slate-100">{nonNegotiableQuality}</p>
            </div>
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
              <p className="text-slate-500">Aap ko kis type se bachna chahiye</p>
              <p className="mt-2 text-slate-100">{avoidType}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-white">Partner Me Yeh Cheezen Dhoondein</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <p>Aap un logon ke sath zyada suit kar sakte hain jo:</p>
            <div className="flex flex-wrap gap-2">
              {bestFitQualities.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <p className="leading-7 text-slate-200">
                Jo log apne ideal partner ko clearly samajh lete hain, woh aam tor par behtar relationship choice karte hain.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-slate-500">Aap ke answers ka short meaning</p>
              <p className="mt-2 leading-7 text-slate-100">{dreamPartnerSummary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">Next Step</p>
        <div className="mt-4 space-y-4">
          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            Ab aap ke liye best next step yeh hai ke dekha jaye jo shakhs aap ke dimagh me hai kya woh aap ke ideal partner profile se match karta hai ya nahin.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Compare Your Crush With Your Ideal Partner
          </Link>
        </div>
      </section>
    </>
  );
}

function renderSecret(raw: SecretAnswers) {
  const highValueSigns = new Set([
    "Meri choti details yaad rakhta/rakhti hai",
    "Baat karne ka bahana dhoondta/dhoondti hai",
    "Notice karta/karti hai jab main upset hota/hoti hun",
    "Jealous ya protective lagta/lagti hai",
    "Group me mujhe special attention deta/deti hai",
    "Mera relationship status pooch chuka/chuki hai",
  ]);
  const suspects = (Array.isArray(raw.suspects) ? raw.suspects : [])
    .map((suspect) => {
      const name = suspect.name?.trim() ?? "";
      const signs = Array.isArray(suspect.signs) ? suspect.signs.filter(Boolean) : [];
      const highValueCount = signs.filter((sign) => highValueSigns.has(sign)).length;
      const frequencyScore =
        suspect.signFrequency === "Almost every time we interact"
          ? 20
          : suspect.signFrequency === "Very often"
            ? 16
            : suspect.signFrequency === "Often"
              ? 12
              : suspect.signFrequency === "Sometimes"
                ? 8
                : suspect.signFrequency === "Rarely"
                  ? 4
                  : 0;
      const contextScore =
        suspect.expressionContext === "Jab hum akele hon"
          ? 10
          : suspect.expressionContext === "On chat"
            ? 7
            : suspect.expressionContext === "In person"
              ? 6
              : suspect.expressionContext === "In group settings"
                ? 4
                : suspect.expressionContext === "Hamesha subtle rehte hain"
                  ? 5
                  : 0;
      const reactionScore =
        suspect.reactionToOthers === "Clearly uncomfortable"
          ? 10
          : suspect.reactionToOthers === "Jokingly jealous"
            ? 8
            : suspect.reactionToOthers === "Quiet ya awkward"
              ? 6
              : suspect.reactionToOthers === "Slightly curious"
                ? 3
                : 0;
      const absenceScore =
        suspect.absenceResponse === "Definitely poochein ge kahan thay"
          ? 10
          : suspect.absenceResponse === "Message karein ge"
            ? 8
            : suspect.absenceResponse === "Casually check in karein ge"
              ? 5
              : suspect.absenceResponse === "Baad me notice karein ge"
                ? 2
                : 0;
      const intuitionScore = Math.min(15, (Number(suspect.gutScore ?? 0) / 5) * 15);
      const textBonus = Math.min(5, Math.round((suspect.reasonText?.trim().length ?? 0) / 40));
      const signScore = Math.min(30, signs.length * 1.5 + highValueCount * 3);
      const total = Math.round(signScore + frequencyScore + contextScore + reactionScore + absenceScore + intuitionScore + textBonus);

      return {
        name: name || "Unknown",
        relationType: suspect.relationType?.trim() || "Unknown",
        reason: suspect.reasonText?.trim() || "Aap ko is person ki vibe unusual lagi.",
        signs,
        total,
        highValueCount,
        expressionContext: suspect.expressionContext?.trim() || "Unknown",
      };
    })
    .filter((suspect) => suspect.name)
    .sort((a, b) => b.total - a.total);

  const topMatch = suspects[0] ?? null;
  const confidenceLevel =
    (topMatch?.total ?? 0) >= 75
      ? "Very strong possibility"
      : (topMatch?.total ?? 0) >= 58
        ? "Strong possibility"
        : (topMatch?.total ?? 0) >= 40
          ? "Moderate possibility"
          : "Low possibility";
  const resultType =
    (topMatch?.total ?? 0) >= 75
      ? "Strong Secret Admirer"
      : (topMatch?.expressionContext === "Jab hum akele hon" || raw.overallPattern?.privateVsPublic === "Haan, bohat zyada")
        ? "Quiet But Interested"
        : (topMatch?.total ?? 0) >= 40
          ? "Mixed Signals"
          : "Probably Friendly, Not Romantic";
  const whyPoints = [
    topMatch && topMatch.signs.length >= 4 ? "Repeated attention sirf normal friendliness se zyada lag rahi hai" : null,
    topMatch && topMatch.highValueCount >= 2 ? "Unhon ne aap ki details aur mood jaise deeper signs show kiye hain" : null,
    topMatch?.expressionContext === "Jab hum akele hon" || raw.overallPattern?.privateVsPublic?.includes("Haan")
      ? "Private ya direct interaction me behavior zyada strong lagta hai"
      : null,
    raw.finalPick && topMatch && raw.finalPick === topMatch.name
      ? "Aap ki intuition bhi isi person ki taraf point kar rahi hai"
      : null,
  ].filter((item): item is string => Boolean(item));
  const emotionalReading =
    resultType === "Strong Secret Admirer"
      ? "Yeh random guess nahin lagta. Yahan repeated attention, emotional curiosity, aur special focus nazar aa raha hai."
      : resultType === "Quiet But Interested"
        ? "Yahan signs subtle hain, lekin private ya selective behavior me real interest ki smell aati hai."
        : resultType === "Mixed Signals"
          ? "Kuch signs genuine lag rahe hain, lekin abhi pattern itna consistent nahin ke confidently confirm kiya ja sake."
          : "Warmth to hai, lekin abhi jo pattern nazar aa raha hai woh crush se zyada normal friendliness bhi ho sakta hai.";
  const caution =
    raw.overallPattern?.overthinkingCheck?.includes("Possibly") || raw.overallPattern?.overthinkingCheck?.includes("Thora")
      ? "Reality check: yahan kuch real signs hain, lekin overthinking ka thora chance bhi maujood hai."
      : "Reality check: signs promising hain, lekin subtle log phir bhi hard to read ho sakte hain. Yeh guaranteed nahin, magar khaali guess bhi nahin lagta.";

  return (
    <>
      <section className="rounded-[2rem] border border-pink-300/15 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.20),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.92),rgba(17,24,39,0.96))] p-8 shadow-2xl shadow-pink-950/20">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-pink-300/30 bg-pink-300/10 px-4 py-1 text-sm font-medium text-pink-100">
            Secret Crush Reading
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Most likely person who likes you: {topMatch?.name ?? "Abhi clear nahin"}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-slate-200">{emotionalReading}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {card("Result Type", resultType, "Yeh aap ke collected signals ki overall category hai.")}
        {card("Crush Confidence Meter", confidenceLevel, topMatch ? `${topMatch.total}% signal strength` : "Abhi data weak hai")}
        {card("Aap Ka Final Gut Pick", raw.finalPick || "Abhi decide nahin kiya", "Intuition ko bhi result me weight diya gaya hai.")}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-white">Why we think so</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            {whyPoints.length > 0 ? (
              whyPoints.map((point) => <p key={point}>• {point}</p>)
            ) : (
              <p>Clues abhi limited hain, is liye result zyada cautious side par rakha gaya hai.</p>
            )}
          </div>

          {topMatch ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-500">Is person ka vibe</p>
              <p className="mt-2 text-lg font-semibold text-white">{topMatch.name}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{topMatch.reason}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topMatch.signs.map((sign) => (
                  <span
                    key={`${topMatch.name}-${sign}`}
                    className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-100"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">The vibe</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{emotionalReading}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Reality check</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{caution}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-xl font-semibold text-white">Suspect Breakdown</h2>
        <div className="mt-5 grid gap-4">
          {suspects.length > 0 ? (
            suspects.map((suspect) => (
              <article key={suspect.name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{suspect.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{suspect.relationType}</p>
                  </div>
                  <span className="text-lg font-semibold text-cyan-200">{suspect.total}%</span>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-400">Aap ne kisi ka naam add nahin kiya, is liye result sirf overall vibe par based hai.</p>
          )}
        </div>
      </section>
    </>
  );
}

function renderPersonality(raw: PersonalityAnswers) {
  const labels: Record<string, string> = {
    romanticDreamer: "The Romantic Dreamer",
    loyalProtector: "The Loyal Protector",
    independentSpirit: "The Independent Spirit",
    deepSoulmate: "The Deep Soulmate",
  };
  const entries = Object.entries(raw.personalityScores ?? {})
    .map(([key, value]) => ({
      key,
      label: labels[key] ?? titleize(key),
      value: typeof value === "number" ? value : 0,
    }))
    .sort((left, right) => right.value - left.value);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0) || 1;
  const dominantKey = raw.personalityArchetype ?? entries[0]?.key ?? "loyalProtector";
  const dominant = labels[dominantKey] ?? "The Loyal Protector";
  const explanation =
    dominantKey === "loyalProtector"
      ? "You value trust, loyalty, aur emotional safety sab se zyada."
      : dominantKey === "independentSpirit"
        ? "Aap ko closeness chahiye magar apni individuality aur freedom ke sath."
        : dominantKey === "deepSoulmate"
          ? "Aap deep emotional understanding, honesty, aur meaningful connection dhoondte hain."
          : "Aap love ko passion, feeling, aur visible affection ke sath mehsoos karte hain.";
  const bestMatch =
    dominantKey === "loyalProtector"
      ? "emotionally steady, loyal, aur dependable log"
      : dominantKey === "independentSpirit"
        ? "self-aware, non-controlling, aur open-minded log"
        : dominantKey === "deepSoulmate"
          ? "emotionally intelligent, thoughtful, aur honest log"
          : "romantic, expressive, aur emotionally warm log";

  return (
    <>
      <section className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        {card(
          "Love Personality Result",
          dominant,
          explanation,
        )}

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-white">Score Breakdown</h2>
          <div className="mt-5 space-y-4">
            {entries.map((entry) => {
              const percentage = Math.round((entry.value / total) * 100);

              return (
                <div key={entry.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-100">{entry.label}</span>
                    <span className="text-cyan-200">{percentage}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-300 via-cyan-300 to-emerald-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {card("Dominant Style", dominant)}
        {card(
          "Aap Ko Kaisa Partner Suit Karega",
          bestMatch,
          "Yeh un logon ki energy hai jin ke sath aap zyada naturally connect kar sakte hain.",
        )}
        {card("Relationship Theme", explanation)}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">Next Step</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            Find out which of your friends ya crush aap ki love personality se best match karta hai.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Compare With Crush
          </Link>
        </div>
      </section>
    </>
  );
}

export default async function TestResultPage({ params }: TestResultPageProps) {
  const { slug, responseId } = await params;
  const campaign = await getCampaignResponseBySlugAndResponseId(slug, responseId);

  if (!campaign) notFound();

  const response = campaign.responses[0];
  if (!response) notFound();

  const answers =
    response.answers && typeof response.answers === "object" && !Array.isArray(response.answers)
      ? response.answers
      : {};
  const testType = campaign.testType || "comparison";
  const publicCampaignLink = `${env.SITE_URL}/test/${campaign.slug}`;
  const resultShareMessage =
    testType === "comparison"
      ? "I just got a heart-reading result on this anonymous crush test. Try it yourself."
      : testType === "ideal"
        ? "I just got my ideal partner result on this anonymous crush test. Try it yourself."
        : testType === "secret"
          ? "I just checked the hidden signals on this anonymous crush test. Try it yourself."
          : "I just got my love personality result on this anonymous crush test. Try it yourself.";

  const meta =
    testType === "ideal"
      ? {
          badge: "Ideal Partner Result",
          text: "your ideal partner summary and preference breakdown.",
        }
      : testType === "secret"
        ? {
            badge: "Secret Crush Signals",
            text: "the probability breakdown of who may secretly like you.",
          }
          : testType === "personality"
              ? {
                  badge: "Love Personality Result",
                  text: "your relationship personality type and emotional style.",
                }
          : {
              badge: "Heart Reading Result",
              text: "your weighted emotional result and hidden feelings summary.",
            };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
                {meta.badge}
              </span>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">Your Result</h1>
                <p className="max-w-2xl text-slate-300">
                  Based on your response for <span className="font-medium text-white">{campaign.name}</span>, here is{" "}
                  {meta.text}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Submission{" "}
              <span className="text-slate-100">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(response.createdAt)}
              </span>
            </p>
          </div>
        </section>

        {testType === "ideal"
          ? renderIdeal(answers as IdealAnswers)
          : testType === "secret"
            ? renderSecret(answers as SecretAnswers)
            : testType === "personality"
              ? renderPersonality(answers as PersonalityAnswers)
              : renderComparison(answers as ComparisonAnswers)}

        <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Final Message</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {campaign.finalMessage || "Thanks for completing this crush test."}
            </p>
          </div>
        </section>

        {testType === "comparison" ? (
          <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
              People who took this test also discovered
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Link
                href="/register"
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-300/40 hover:bg-slate-950"
              >
                <h3 className="text-lg font-semibold text-white">Take Secret Crush Test</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Check whether the person on your mind might secretly like you too.
                </p>
              </Link>
              <Link
                href="/register"
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-300/40 hover:bg-slate-950"
              >
                <h3 className="text-lg font-semibold text-white">Take Love Personality Test</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Discover your love style, emotional pattern, and relationship energy.
                </p>
              </Link>
            </div>
          </section>
        ) : null}

        <ShareTools
          title="Share Your Result"
          description="Invite friends to take the same anonymous test using the public campaign link."
          link={publicCampaignLink}
          message={resultShareMessage}
          platforms={["whatsapp", "facebook", "twitter"]}
        />

        <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900/80 to-emerald-400/10 p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">Viral CTA</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Want to discover who secretly likes YOU?
              </h2>
              <p className="max-w-2xl text-sm text-slate-300">
                Create your own anonymous crush test and send it to friends.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Create My Test
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
