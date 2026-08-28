import { createHash, randomInt } from "node:crypto";

import { prisma } from "@/lib/db";

export type OtpPurpose = "login" | "checkout";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_MS = 45 * 1000;

function secret() {
  return process.env.AUTH_SECRET || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "turateks-dev-secret";
}

export function hashOtp(email: string, purpose: OtpPurpose, code: string) {
  return createHash("sha256")
    .update(`${email.toLowerCase().trim()}|${purpose}|${code}|${secret()}`)
    .digest("hex");
}

export function makeOtp() {
  return randomInt(0, 10000).toString().padStart(4, "0");
}

export async function issueOtp(email: string, purpose: OtpPurpose) {
  const normalized = email.toLowerCase().trim();
  const latest = await prisma.emailOtp.findFirst({
    where: { email: normalized, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_MS) {
    const wait = Math.ceil((RESEND_MS - (Date.now() - latest.createdAt.getTime())) / 1000);
    throw Object.assign(new Error("WAIT"), { wait });
  }

  const code = makeOtp();
  await prisma.emailOtp.create({
    data: {
      email: normalized,
      purpose,
      codeHash: hashOtp(normalized, purpose, code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  return { email: normalized, code };
}

export async function consumeOtp(email: string, purpose: OtpPurpose, code: string) {
  const normalized = email.toLowerCase().trim();
  const digits = code.replace(/\D/g, "").slice(0, 4);
  if (digits.length !== 4) return false;

  const row = await prisma.emailOtp.findFirst({
    where: {
      email: normalized,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!row) return false;
  if (row.codeHash !== hashOtp(normalized, purpose, digits)) return false;

  await prisma.emailOtp.update({
    where: { id: row.id },
    data: { consumedAt: new Date() },
  });
  return true;
}
