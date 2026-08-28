import { NextResponse } from "next/server";

import { isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendAdminResetEmail } from "@/lib/mail";
import { hashResetToken, makeResetToken } from "@/lib/password";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.passwordHash && isAdminRole(user.role)) {
    const token = makeResetToken();
    await prisma.passwordResetToken.create({
      data: {
        email,
        tokenHash: hashResetToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${base.replace(/\/$/, "")}/admin/sifre-sifirla/${token}`;
    await sendAdminResetEmail(email, resetUrl);
  }

  return NextResponse.json({ ok: true });
}
