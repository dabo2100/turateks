import { cn } from "@/lib/utils";

export const fieldClass =
  "mt-1.5 w-full rounded-2xl border-0 bg-[var(--admin-input,#eef0f3)] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40";

export const labelClass = "block text-sm font-semibold text-foreground";

export const adminCardClass = "rounded-2xl bg-card p-5 shadow-none sm:p-6";

export const adminTableWrapClass = "overflow-x-auto rounded-2xl bg-card";

export const adminThClass = "px-4 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase";

export const adminTdClass = "px-4 py-3.5";

export const adminPrimaryBtnClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[var(--admin-mint-strong,#6bcf9b)] disabled:opacity-50";

export const adminOutlineBtnClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50";

export function adminSectionTitle(className?: string) {
  return cn("text-base font-semibold text-foreground", className);
}
