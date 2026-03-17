"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteUserAction(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");

  if (!userId) {
    return;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/campaigns");
}

export async function deleteCampaignAction(formData: FormData) {
  await requireAdmin();

  const campaignId = String(formData.get("campaignId") ?? "");

  if (!campaignId) {
    return;
  }

  await prisma.campaign.delete({
    where: {
      id: campaignId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/campaigns");
}
