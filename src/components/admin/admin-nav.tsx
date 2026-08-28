"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/siparisler", label: "Siparişler" },
  { href: "/admin/sayfalar", label: "Sayfalar" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
  { href: "/admin/kullanicilar", label: "Yöneticiler" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-xs tracking-wide text-white/50 uppercase">Yönetim</p>
        <p className="mt-1 text-sm font-semibold">Turateks</p>
        <p className="mt-1 truncate text-xs text-white/50">{email}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "mb-1 block rounded-md px-3 py-2.5 text-sm",
                active ? "bg-primary text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-white/10 px-4 py-4 text-sm">
        <Link href="/" className="block text-white/70 hover:text-white">
          Siteye dön
        </Link>
        <LogoutButton
          className="text-sm text-white/70 hover:text-white"
          logoutUrl="/api/admin/logout"
          redirectTo="/admin/giris"
        />
      </div>
    </div>
  );
}
