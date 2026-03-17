"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const passwordRules = {
  minLength: 6,
};

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password || !confirmPassword) {
    redirect("/register?error=missing_fields");
  }

  if (password.length < passwordRules.minLength) {
    redirect(`/register?error=password_too_short&min=${passwordRules.minLength}`);
  }

  if (password !== confirmPassword) {
    redirect("/register?error=password_mismatch");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    redirect("/register?error=email_taken");
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  redirect("/login?success=registered");
}
