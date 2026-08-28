import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { hashPassword, hashResetToken } from "@/lib/password";

export async function POST(req: Request) {
  const body = (await req.json()) as { token?: string; password?: string };
  const token = body.token?.trim() ?? "";
  const password = body.password ?? "";
  if (token.length < 20 || password.length < 8) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  const row = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: hashResetToken(token),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!row) {
    return NextResponse.json({ error: "BAD_TOKEN" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: row.email },
      data: { passwordHash: await hashPassword(password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
