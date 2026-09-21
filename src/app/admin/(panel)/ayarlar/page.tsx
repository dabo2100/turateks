import { saveSiteSettings } from "@/app/admin/(panel)/ayarlar/actions";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Ayarlar" description="Mağaza iletişim bilgileri ve vergi tercihleri." />
      <AdminCard>
        <form action={saveSiteSettings} className="grid max-w-2xl gap-4">
          <label className={labelClass}>
            Firma adı
            <input name="name" defaultValue={settings.name} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Slogan
            <input name="tagline" defaultValue={settings.tagline} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Telefon
            <input name="phoneDisplay" defaultValue={settings.phoneDisplay} className={fieldClass} />
          </label>
          <label className={labelClass}>
            E-posta
            <input name="email" type="email" defaultValue={settings.email} className={fieldClass} />
          </label>
          <label className={labelClass}>
            WhatsApp (90…)
            <input name="whatsapp" defaultValue={settings.whatsapp} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Adres
            <textarea name="address" defaultValue={settings.address} className={`${fieldClass} min-h-24`} />
          </label>
          <label className={labelClass}>
            Facebook Sayfası
            <input
              name="facebook"
              type="url"
              defaultValue={settings.facebook}
              placeholder="https://www.facebook.com/..."
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Instagram Profili
            <input
              name="instagram"
              type="url"
              defaultValue={settings.instagram}
              placeholder="https://www.instagram.com/..."
              className={fieldClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              KDV
              <select name="taxMode" defaultValue={settings.taxMode} className={fieldClass}>
                <option value="included">Fiyatlara dahil</option>
                <option value="extra">Fiyata eklenir</option>
              </select>
            </label>
            <label className={labelClass}>
              KDV %
              <input name="taxPercent" type="number" min={0} defaultValue={settings.taxPercent} className={fieldClass} />
            </label>
          </div>
          <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-sm font-medium">
            <input type="checkbox" name="printTerms" defaultChecked={settings.printTerms} className="size-4 accent-[var(--admin-mint-strong,#6bcf9b)]" />
            Sözleşmeleri faturaya bas
          </label>
          <label className={labelClass}>
            Google Search Console doğrulama
            <input
              name="googleSiteVerification"
              defaultValue={settings.googleSiteVerification}
              placeholder="content=… değeri"
              className={fieldClass}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Search Console → HTML etiketi içindeki <code>content</code> değeri. Boş bırakılabilir.
            </span>
          </label>
          <Button type="submit" className="h-11 w-fit rounded-2xl px-5">
            Kaydet
          </Button>
        </form>
      </AdminCard>
    </div>
  );
}
