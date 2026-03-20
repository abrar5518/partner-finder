import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const MAX_VIDEO_SIZE_BYTES = 25 * 1024 * 1024;

function sanitizeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60) || "campaign";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const slug = sanitizeSlug(String(formData.get("slug") ?? ""));
  const file = formData.get("video");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Video file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ message: "Only video uploads are allowed." }, { status: 400 });
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Video is too large. Please keep recordings short." },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dir = join(process.cwd(), "public", "uploads", "reactions", slug);
  const fileName = `${Date.now()}-${randomUUID()}.webm`;

  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, fileName), buffer);

  return NextResponse.json({
    path: `/uploads/reactions/${slug}/${fileName}`,
  });
}
