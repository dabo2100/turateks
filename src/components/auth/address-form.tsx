"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveAddress } from "@/app/hesap/actions";
import { Button } from "@/components/ui/button";

export type AddressValue = {
  name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  company: string;
  taxId: string;
};

export function AddressForm({ initial }: { initial: AddressValue }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveAddress(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Adres kaydedildi");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-border p-4">
      <Field name="name" label="Ad Soyad" defaultValue={initial.name} required />
      <Field name="phone" label="Telefon" defaultValue={initial.phone} required />
      <Field name="city" label="İl" defaultValue={initial.city} required />
      <Field name="district" label="İlçe" defaultValue={initial.district} required />
      <label className="block text-sm">
        Adres
        <textarea
          name="address"
          required
          defaultValue={initial.address}
          rows={3}
          className="mt-1 w-full rounded-md border border-border p-2"
        />
      </label>
      <Field name="company" label="Firma (opsiyonel)" defaultValue={initial.company} />
      <Field name="taxId" label="VKN (opsiyonel)" defaultValue={initial.taxId} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-10" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Adresi kaydet"}
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full rounded-md border border-border p-2"
      />
    </label>
  );
}
