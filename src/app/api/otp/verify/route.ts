import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import * as otp from "@/lib/otp";
import type { OtpPurpose } from "@/lib/otp";
import { sessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    code?: string;
    purpose?: OtpPurpose;
    name?: string;
  };
  const email = body.email?.trim().toLowerCase() ?? "";
  const purpose = body.purpose;
  if (!email || !body.code || (purpose !== "login" && purpose !== "checkout")) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  const ok = await otp.consumeOtp(email, purpose, body.code);
  if (!ok) {
    return NextResponse.json({ error: "BAD_CODE" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: body.name || null, role: "customer" },
  });

  const cookie = sessionCookie(user.id);
  const res = NextResponse.json({ ok: true, userId: user.id });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
