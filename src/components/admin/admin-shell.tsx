"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
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
      <header className="flex items-center gap-3 bg-charcoal px-4 py-3 text-white lg:hidden">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md hover:bg-white/10"
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label="Menüyü aç"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Turateks</p>
          <p className="truncate text-xs text-white/60">{email}</p>
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        id="admin-nav"
        className={cn(
          "z-50 flex min-h-0 flex-col bg-charcoal text-white",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-[min(250px,85vw)] max-lg:shadow-xl",
          "lg:relative lg:h-full lg:w-[max(10%,250px)] lg:min-w-[250px] lg:shrink-0",
          "transition-transform duration-200 ease-out",
          open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-end px-2 pt-2 lg:hidden">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-white/10"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminNav email={email} />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-surface lg:pr-[10%]">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
