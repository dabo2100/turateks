import { NextResponse } from "next/server";

import { clearAdminSessionCookie } from "@/lib/session";

export async function POST() {
  const cookie = clearAdminSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
