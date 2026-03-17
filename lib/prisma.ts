import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

declare global {
  // Reuse one Prisma client instance during local hot reloads.
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
