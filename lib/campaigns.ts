import { nanoid } from "nanoid";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export async function generateUniqueCampaignSlug(name: string) {
  const base = slugifyName(name) || "campaign";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = `${base}-${nanoid(8).toLowerCase()}`;
    const existingCampaign = await prisma.campaign.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingCampaign) {
      return slug;
    }
  }

  return `${base}-${Date.now()}`;
}

export async function getUserCampaigns(userId: string) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      createdAt: true,
    },
  });
}

export async function getUserCampaignById(userId: string, campaignId: string) {
  return prisma.campaign.findFirst({
    where: {
      id: campaignId,
      userId,
    },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      message: true,
      finalMessage: true,
      createdAt: true,
    },
  });
}

export async function getCampaignBySlug(slug: string) {
  return prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      message: true,
      finalMessage: true,
      createdAt: true,
    },
  });
}

export async function getCampaignWithLatestResponseBySlug(slug: string) {
  return prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      message: true,
      finalMessage: true,
      createdAt: true,
      responses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          answers: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getCampaignResponseBySlugAndResponseId(
  slug: string,
  responseId: string,
) {
  return prisma.campaign.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      message: true,
      finalMessage: true,
      createdAt: true,
      responses: {
        where: {
          id: responseId,
        },
        take: 1,
        select: {
          id: true,
          answers: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function recordCampaignVisit(campaignId: string, options?: { ip?: string; userAgent?: string }) {
  return prisma.visit.create({
    data: {
      campaignId,
      ip: options?.ip,
      userAgent: options?.userAgent,
    },
    select: {
      id: true,
    },
  });
}

export async function getUserCampaignAnalyticsById(userId: string, campaignId: string) {
  return prisma.campaign.findFirst({
    where: {
      id: campaignId,
      userId,
    },
    select: {
      id: true,
      name: true,
      testType: true,
      crushName: true,
      slug: true,
      message: true,
      finalMessage: true,
      createdAt: true,
      responses: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          answers: true,
          createdAt: true,
        },
      },
      visits: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          visits: true,
          responses: true,
        },
      },
    },
  });
}

export type CampaignResponseAnswers = Prisma.JsonObject & {
  people?: Array<{
    name?: string;
    age?: number;
    traits?: string[];
    attractionLevel?: number;
    weaknesses?: string[];
  }>;
  chosenPerson?: string;
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
  idealPartnerType?: string;
  dreamPartnerSummary?: string;
  nonNegotiableQuality?: string;
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
  personalityScores?: {
    romanticDreamer?: number;
    loyalProtector?: number;
    independentSpirit?: number;
    deepSoulmate?: number;
  };
  personalityArchetype?: string;
  reactionVideo?: {
    path?: string;
    recordedAt?: string;
  };
  submittedAt?: string;
};
