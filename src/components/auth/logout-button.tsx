"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({
  className = "text-sm text-muted-foreground",
  logoutUrl = "/api/auth/logout",
  redirectTo = "/hesap",
}: {
  className?: string;
  logoutUrl?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await fetch(logoutUrl, { method: "POST" });
        router.push(redirectTo);
        router.refresh();
      }}
    >
      Çıkış
    </button>
  );
}
