import { NextResponse } from "next/server";

import { sendOtpEmail } from "@/lib/mail";
import * as otp from "@/lib/otp";
import type { OtpPurpose } from "@/lib/otp";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; purpose?: OtpPurpose };
  const email = body.email?.trim().toLowerCase() ?? "";
  const purpose = body.purpose;
  if (!email.includes("@") || (purpose !== "login" && purpose !== "checkout")) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  try {
    const { code } = await otp.issueOtp(email, purpose);
    const sent = await sendOtpEmail(email, code, purpose);
    return NextResponse.json({
      ok: true,
      email,
      smtp: sent.queued,
      hint: sent.logged ? "SMTP yok — kod sunucu konsolunda." : undefined,
    });
  } catch (err) {
    const wait = (err as { wait?: number }).wait;
    if (wait) {
      return NextResponse.json({ error: "WAIT", wait }, { status: 429 });
    }
    console.error(err);
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
  }
}
