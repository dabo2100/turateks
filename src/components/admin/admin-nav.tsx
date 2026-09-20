"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const MAIN_LINKS = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
];

const CONTENT_LINKS = [
  { href: "/admin/sayfalar", label: "Sayfalar", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

const SYSTEM_LINKS = [
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
  { href: "/admin/kullanicilar", label: "Yöneticiler", icon: Users },
];

function NavGroup({
  title,
  links,
  pathname,
}: {
  title: string;
  links: typeof MAIN_LINKS;
  pathname: string;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">{title}</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[var(--admin-mint-soft,#e6f7ef)] text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-xl",
                  active ? "bg-primary/70 text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/giris");
    router.refresh();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            T
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">Turateks</p>
            <p className="truncate text-xs text-muted-foreground">Yönetim paneli</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <NavGroup title="Ana menü" links={MAIN_LINKS} pathname={pathname} />
        <NavGroup title="İçerik" links={CONTENT_LINKS} pathname={pathname} />
        <NavGroup title="Sistem" links={SYSTEM_LINKS} pathname={pathname} />
      </div>

      <div className="border-t border-border px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--admin-mint-soft,#e6f7ef)] text-xs font-semibold text-foreground">
            {email.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Admin</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <Link href="/" className="text-muted-foreground transition hover:text-foreground">
            Siteye dön
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Çıkış
          </button>
        </div>
      </div>
    </div>
  );
}
