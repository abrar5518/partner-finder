"use server";

import { revalidatePath } from "next/cache";
import { generateUniqueCampaignSlug } from "@/lib/campaigns";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateCampaignInput = {
  name: string;
  testType: "comparison" | "ideal" | "secret" | "personality";
  crushName?: string;
  message?: string;
  finalMessage?: string;
};

type CreateCampaignResult =
  | {
      success: true;
      campaignId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createCampaignAction(
  input: CreateCampaignInput,
): Promise<CreateCampaignResult> {
  const session = await requireAuth("/create-campaign");
  const name = input.name.trim();
  const testType = input.testType;
  const crushName = input.crushName?.trim() || undefined;
  const message = input.message?.trim() || undefined;
  const finalMessage = input.finalMessage?.trim() || undefined;

  if (!name) {
    return {
      success: false,
      message: "Campaign name is required.",
    };
  }

  if (!["comparison", "ideal", "secret", "personality"].includes(testType)) {
    return {
      success: false,
      message: "Please select a valid test type.",
    };
  }

  const slug = await generateUniqueCampaignSlug(name);

  const campaign = await prisma.campaign.create({
    data: {
      name,
      testType,
      crushName,
      slug,
      message,
      finalMessage,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/campaigns");

  return {
    success: true,
    campaignId: campaign.id,
  };
}
