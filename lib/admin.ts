import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const [totalUsers, totalCampaigns, totalResponses, totalVisits, topCampaigns] =
    await Promise.all([
    prisma.user.count(),
    prisma.campaign.count(),
    prisma.response.count(),
    prisma.visit.count(),
    prisma.campaign.findMany({
      take: 5,
      orderBy: {
        responses: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            responses: true,
            visits: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalCampaigns,
    totalResponses,
    totalVisits,
    topCampaigns,
  };
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          campaigns: true,
        },
      },
    },
  });
}

export async function getAdminCampaigns(userId?: string) {
  return prisma.campaign.findMany({
    where: userId ? { userId } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      _count: {
        select: {
          responses: true,
        },
      },
    },
  });
}

export async function getAdminCampaignAnalyticsById(campaignId: string) {
  return prisma.campaign.findUnique({
    where: {
      id: campaignId,
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
      user: {
        select: {
          id: true,
          email: true,
        },
      },
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

export async function getAdminUserSummary(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
    },
  });
}
