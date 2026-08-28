import { createHmac } from "node:crypto";

const COOKIE = "turateks_session";
const ADMIN_COOKIE = "turateks_admin_session";

function secret() {
  return process.env.AUTH_SECRET || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "turateks-dev-secret";
}

function sign(payload: string) {
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function unsign(token: string) {
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  if (sig !== expected) return null;
  return payload;
}

function cookiePayload(name: string, userId: string) {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const value = sign(`u:${userId}:${exp}`);
  return {
    name,
    value,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
    },
  };
}

export function sessionCookie(userId: string) {
  return cookiePayload(COOKIE, userId);
}

export function adminSessionCookie(userId: string) {
  return cookiePayload(ADMIN_COOKIE, userId);
}

function readId(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  if (!match) return null;
  const payload = unsign(decodeURIComponent(match[1]));
  if (!payload) return null;
  const [, userId, exp] = payload.split(":");
  if (!userId || Number(exp) < Date.now()) return null;
  return userId;
}

export function readUserId(cookieHeader: string | null) {
  return readId(cookieHeader, COOKIE);
}

export function readAdminUserId(cookieHeader: string | null) {
  return readId(cookieHeader, ADMIN_COOKIE);
}

function clearCookie(name: string) {
  return {
    name,
    value: "",
    options: {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    },
  };
}

export function clearSessionCookie() {
  return clearCookie(COOKIE);
}

export function clearAdminSessionCookie() {
  return clearCookie(ADMIN_COOKIE);
}
