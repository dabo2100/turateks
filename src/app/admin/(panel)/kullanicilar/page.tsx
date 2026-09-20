import { CreateAdminForm, RemoveAdminButton } from "@/components/admin/admin-users-forms";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const actor = await requireAdmin();
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "super_admin"] } },
    orderBy: [{ role: "desc" }, { email: "asc" }],
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Yöneticiler" description="Panele e-posta ve şifre ile giren hesaplar." />

      <AdminCard title="Yeni yönetici">
        <CreateAdminForm />
      </AdminCard>

      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>E-posta</th>
              <th className={adminThClass}>Ad</th>
              <th className={adminThClass}>Rol</th>
              <th className={adminThClass} />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className={adminTdClass}>{user.email}</td>
                <td className={adminTdClass}>{user.name ?? "—"}</td>
                <td className={adminTdClass}>{user.role === "super_admin" ? "Super admin" : "Admin"}</td>
                <td className={`${adminTdClass} text-right`}>
                  {actor.role === "super_admin" && user.role === "admin" ? <RemoveAdminButton id={user.id} /> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
