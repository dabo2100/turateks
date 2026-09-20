"use client";

import { Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

const TITLE_MAP: { prefix: string; title: string }[] = [
  { prefix: "/admin/urunler/yeni", title: "Yeni ürün" },
  { prefix: "/admin/urunler", title: "Ürünler" },
  { prefix: "/admin/kategoriler", title: "Kategoriler" },
  { prefix: "/admin/siparisler", title: "Siparişler" },
  { prefix: "/admin/sayfalar", title: "Sayfalar" },
  { prefix: "/admin/blog/yeni", title: "Yeni yazı" },
  { prefix: "/admin/blog", title: "Blog" },
  { prefix: "/admin/ayarlar", title: "Ayarlar" },
  { prefix: "/admin/kullanicilar", title: "Yöneticiler" },
  { prefix: "/admin", title: "Özet" },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [navPath, setNavPath] = useState(pathname);

  if (navPath !== pathname) {
    setNavPath(pathname);
    setOpen(false);
  }

  const pageTitle = useMemo(() => {
    const match = TITLE_MAP.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
    return match?.title ?? "Yönetim";
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl bg-muted text-foreground"
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label="Menüyü aç"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Turateks</p>
          <p className="truncate text-xs text-muted-foreground">{pageTitle}</p>
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="admin-nav"
        className={cn(
          "z-50 flex min-h-0 flex-col border-r border-border bg-card",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-[min(280px,88vw)] max-lg:shadow-xl",
          "lg:relative lg:h-full lg:w-[260px] lg:shrink-0",
          "transition-transform duration-200 ease-out",
          open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-end px-2 pt-2 lg:hidden">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl hover:bg-muted"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminNav email={email} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="hidden items-center gap-4 border-b border-border bg-card/80 px-6 py-4 backdrop-blur lg:flex xl:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Yönetim</p>
            <h2 className="truncate text-lg font-semibold text-foreground">{pageTitle}</h2>
          </div>
          <label className="relative hidden max-w-md flex-1 xl:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              readOnly
              placeholder="Ara… (yakında)"
              className="h-11 w-full rounded-2xl border-0 bg-muted pr-4 pl-10 text-sm outline-none"
            />
          </label>
          <div className="flex items-center gap-3 rounded-2xl bg-muted px-3 py-2">
            <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {email.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Admin</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="p-4 sm:p-6 xl:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
