import { NextResponse } from "next/server";

import { ensureSuperAdmin, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { adminSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  await ensureSuperAdmin();
  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !isAdminRole(user.role)) {
    return NextResponse.json({ error: "BAD_CREDENTIALS" }, { status: 401 });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "BAD_CREDENTIALS" }, { status: 401 });
  }

  const cookie = adminSessionCookie(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
