import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { readUserId } from "@/lib/session";

export async function GET(req: Request) {
  const userId = readUserId(req.headers.get("cookie"));
  if (!userId) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      city: true,
      district: true,
      address: true,
      company: true,
      taxId: true,
    },
  });
  return NextResponse.json({ user });
}
