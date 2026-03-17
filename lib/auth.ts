import { compare } from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await compare(password, user.password);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

function normalizeAdminEmail(value?: string | null) {
  return value?.trim().toLowerCase();
}

export function isAdminEmail(email?: string | null) {
  const adminEmail = normalizeAdminEmail(env.ADMIN_EMAIL);
  const normalizedEmail = normalizeAdminEmail(email);

  return Boolean(adminEmail && normalizedEmail && adminEmail === normalizedEmail);
}

export async function requireAuth(redirectTo?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    const target = redirectTo ? `/login?callbackUrl=${encodeURIComponent(redirectTo)}` : "/login";
    redirect(target);
  }

  return session;
}

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

export async function requireAdmin(redirectTo = "/admin") {
  const session = await requireAuth(redirectTo);

  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  return session;
}
