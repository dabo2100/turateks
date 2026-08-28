"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const createSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createAdminUser(formData: FormData) {
  const actor = await requireAdmin();
  const parsed = createSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: "E-posta ve en az 8 karakterlik şifre gerekli." };
  }

  const { email, password } = parsed.data;
  const name = parsed.data.name?.trim() || null;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.role === "super_admin") {
    return { error: "Bu e-posta zaten super admin." };
  }
  const passwordHash = await hashPassword(password);
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "admin", passwordHash, name: name ?? existing.name },
    });
  } else {
    await prisma.user.create({
      data: { email, name, role: "admin", passwordHash },
    });
  }
  revalidatePath("/admin/kullanicilar");
  return { ok: true as const, actorId: actor.id };
}

export async function deleteAdminUser(formData: FormData) {
  const actor = await requireAdmin();
  if (actor.role !== "super_admin") {
    return { error: "Yalnızca super admin silebilir." };
  }
  const id = String(formData.get("id") ?? "");
  if (!id || id === actor.id) {
    return { error: "Bu kullanıcı silinemez." };
  }
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "admin") {
    return { error: "Kullanıcı silinemedi." };
  }
  await prisma.user.update({
    where: { id },
    data: { role: "customer", passwordHash: null },
  });
  revalidatePath("/admin/kullanicilar");
  return { ok: true as const };
}
