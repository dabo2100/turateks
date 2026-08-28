"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createAdminUser, deleteAdminUser } from "@/app/admin/(panel)/kullanicilar/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/admin-ui";

export function CreateAdminForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid max-w-xl gap-3 rounded-xl border border-border bg-background p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          const result = await createAdminUser(data);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Yönetici eklendi");
          form.reset();
          router.refresh();
        });
      }}
    >
      <h2 className="font-semibold">Yeni yönetici</h2>
      <label className="text-sm">
        Ad
        <input name="name" className={fieldClass} disabled={pending} />
      </label>
      <label className="text-sm">
        E-posta
        <input name="email" type="email" required className={fieldClass} disabled={pending} />
      </label>
      <label className="text-sm">
        Şifre
        <input name="password" type="password" required minLength={8} className={fieldClass} disabled={pending} />
      </label>
      <Button type="submit" className="h-10 w-fit px-4" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Yönetici ekle"}
      </Button>
    </form>
  );
}

export function RemoveAdminButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-8 px-2 text-destructive"
      disabled={pending}
      onClick={() => {
        if (!confirm("Bu yöneticinin panel erişimi kaldırılsın mı?")) return;
        const data = new FormData();
        data.set("id", id);
        startTransition(async () => {
          const result = await deleteAdminUser(data);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Yönetici kaldırıldı");
            router.refresh();
          }
        });
      }}
    >
      Kaldır
    </Button>
  );
}
