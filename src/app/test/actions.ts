"use server";

import type { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type SubmitPublicTestInput = {
  slug: string;
  testType?: string;
  answers: Prisma.InputJsonValue;
  website?: string;
  reactionVideoPath?: string;
};

type SubmitPublicTestResult =
  | {
      success: true;
      redirectTo: string;
    }
  | {
      success: false;
      message: string;
    };

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const submissionTracker = new Map<string, number[]>();

function getClientIdentifier(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const recentTimestamps = (submissionTracker.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionTracker.set(identifier, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  submissionTracker.set(identifier, recentTimestamps);
  return false;
}

export async function submitPublicTestAction(
  input: SubmitPublicTestInput,
): Promise<SubmitPublicTestResult> {
  const headerStore = await headers();
  const clientIdentifier = getClientIdentifier(headerStore);
  const slug = input.slug.trim();
  const testType = input.testType ?? "comparison";
  const website = input.website?.trim() ?? "";
  const reactionVideoPath = input.reactionVideoPath?.trim() ?? "";
  const answers = input.answers;

  if (website) {
    return {
      success: false,
      message: "Submission rejected.",
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "Campaign link is invalid.",
    };
  }

  if (isRateLimited(clientIdentifier)) {
    return {
      success: false,
      message: "Too many submissions. Please try again later.",
    };
  }

  if (testType === "comparison") {
    const answerObject =
      typeof answers === "object" && answers !== null && !Array.isArray(answers)
        ? (answers as {
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
          })
        : null;

    const candidates = (answerObject?.candidates ?? [])
      .map((candidate) => ({
        name: candidate.name?.trim() ?? "",
        howYouKnowThem: candidate.howYouKnowThem?.trim() ?? "",
        knownDuration: candidate.knownDuration?.trim() ?? "",
        currentRelationship: candidate.currentRelationship?.trim() ?? "",
      }))
      .filter((candidate) => candidate.name);
    const candidateNames = new Set(candidates.map((candidate) => candidate.name));
    const futureVision = answerObject?.emotionalPull?.futureVision?.trim() ?? "";
    const emotionalUnderstanding =
      answerObject?.emotionalPull?.emotionalUnderstanding?.trim() ?? "";
    const jealousyReaction = Number(answerObject?.emotionalPull?.jealousyReaction ?? 0);
    const reactionScores = (answerObject?.emotionalPull?.messageOrPresenceReaction ?? [])
      .map((entry) => ({
        candidateName: entry.candidateName?.trim() ?? "",
        score: Number(entry.score ?? 0),
      }))
      .filter((entry) => entry.candidateName);
    const supportGoals = answerObject?.compatibility?.supportGoals?.trim() ?? "";
    const trueSelf = answerObject?.compatibility?.trueSelf?.trim() ?? "";
    const difficultDay = answerObject?.compatibility?.difficultDay?.trim() ?? "";
    const trustSecrets = answerObject?.compatibility?.trustSecrets?.trim() ?? "";
    const physicalAttraction = answerObject?.attraction?.physicalAttraction?.trim() ?? "";
    const holdingHands = answerObject?.attraction?.holdingHands?.trim() ?? "";
    const happiestConfession = answerObject?.attraction?.happiestConfession?.trim() ?? "";
    const intuitionChoice = answerObject?.intuitionChoice?.trim() ?? "";

    if (candidates.length > 3) {
      return {
        success: false,
        message: "You can only submit up to 3 names.",
      };
    }

    if (candidateNames.size !== candidates.length) {
      return {
        success: false,
        message: "Each candidate name must be unique.",
      };
    }

    for (const reaction of reactionScores) {
      if (
        !candidateNames.has(reaction.candidateName) ||
        (reaction.score !== 0 && (reaction.score < 1 || reaction.score > 5))
      ) {
        return {
          success: false,
          message: "Please add a valid emotional reaction score for each candidate.",
        };
      }
    }

    const candidateOrUnsure =
      !futureVision || futureVision === "Abhi sure nahin" || candidateNames.has(futureVision);
    if (!candidateOrUnsure) {
      return {
        success: false,
        message: "Please choose a valid future vision option.",
      };
    }

    if (jealousyReaction !== 0 && (jealousyReaction < 1 || jealousyReaction > 5)) {
      return {
        success: false,
        message: "Please choose how you would feel if they dated someone else.",
      };
    }

    const candidateChoices = [
      emotionalUnderstanding,
      supportGoals,
      trueSelf,
      difficultDay,
      trustSecrets,
      physicalAttraction,
      holdingHands,
      happiestConfession,
      intuitionChoice,
    ];

    if (candidateChoices.some((value) => value && !candidateNames.has(value))) {
      return {
        success: false,
        message: "One or more selected answers do not match the candidate list.",
      };
    }
  }

  const enrichedAnswers =
    reactionVideoPath &&
    typeof answers === "object" &&
    answers !== null &&
    !Array.isArray(answers)
      ? ({
          ...answers,
          reactionVideo: {
            path: reactionVideoPath,
            recordedAt: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue)
      : answers;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!campaign) {
    return {
      success: false,
      message: "This campaign could not be found.",
    };
  }

  const response = await prisma.response.create({
    data: {
      campaignId: campaign.id,
      answers: enrichedAnswers,
    },
  });

  return {
    success: true,
    redirectTo: `/test/${campaign.slug}/result/${response.id}`,
  };
}
