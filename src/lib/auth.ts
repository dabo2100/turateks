import type { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { readAdminUserId, readUserId } from "@/lib/session";

export function superAdminEmail() {
  return (process.env.SUPER_ADMIN_EMAIL ?? "a_fattah_m@icloud.com").trim().toLowerCase();
}

export function isAdminRole(role: UserRole) {
  return role === "admin" || role === "super_admin";
}

export function isAdminUser(user: { role: UserRole }) {
  return isAdminRole(user.role);
}

function cookieHeaderFromJar(jar: Awaited<ReturnType<typeof cookies>>) {
  return jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function getSessionUser() {
  const jar = await cookies();
  const userId = readUserId(cookieHeaderFromJar(jar));
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getAdminSessionUser() {
  const jar = await cookies();
  const userId = readAdminUserId(cookieHeaderFromJar(jar));
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !isAdminRole(user.role) || !user.passwordHash) return null;
  return user;
}

export async function requireAdmin() {
  await ensureSuperAdmin();
  const user = await getAdminSessionUser();
  if (!user) redirect("/admin/giris");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireAdmin();
  if (user.role !== "super_admin") redirect("/admin");
  return user;
}

export async function ensureSuperAdmin() {
  const email = superAdminEmail();
  const password = process.env.SUPER_ADMIN_PASSWORD ?? "Admin@123";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.role === "super_admin" && existing.passwordHash) return existing;

  const passwordHash = existing?.passwordHash ?? (await hashPassword(password));
  return prisma.user.upsert({
    where: { email },
    update: {
      role: "super_admin",
      passwordHash,
    },
    create: {
      email,
      name: "Super Admin",
      role: "super_admin",
      passwordHash,
    },
  });
}
