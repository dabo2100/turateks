import { CreateAdminForm, RemoveAdminButton } from "@/components/admin/admin-users-forms";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const actor = await requireAdmin();
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "super_admin"] } },
    orderBy: [{ role: "desc" }, { email: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Yöneticiler</h1>
        <p className="text-sm text-muted-foreground">Panele e-posta ve şifre ile giren hesaplar.</p>
      </div>

      <CreateAdminForm />

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.name ?? "—"}</td>
                <td className="px-4 py-3">{user.role === "super_admin" ? "Super admin" : "Admin"}</td>
                <td className="px-4 py-3 text-right">
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
