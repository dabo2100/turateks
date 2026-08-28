import { saveSiteSettings } from "@/app/admin/(panel)/ayarlar/actions";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { fieldClass } from "@/lib/admin-ui";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ayarlar</h1>
      <form action={saveSiteSettings} className="grid max-w-xl gap-4">
        <label className="text-sm">
          Firma adı
          <input name="name" defaultValue={settings.name} className={fieldClass} />
        </label>
        <label className="text-sm">
          Slogan
          <input name="tagline" defaultValue={settings.tagline} className={fieldClass} />
        </label>
        <label className="text-sm">
          Telefon
          <input name="phoneDisplay" defaultValue={settings.phoneDisplay} className={fieldClass} />
        </label>
        <label className="text-sm">
          E-posta
          <input name="email" type="email" defaultValue={settings.email} className={fieldClass} />
        </label>
        <label className="text-sm">
          WhatsApp (90…)
          <input name="whatsapp" defaultValue={settings.whatsapp} className={fieldClass} />
        </label>
        <label className="text-sm">
          Adres
          <textarea name="address" defaultValue={settings.address} className={`${fieldClass} min-h-24`} />
        </label>
        <label className="text-sm">
          KDV
          <select name="taxMode" defaultValue={settings.taxMode} className={fieldClass}>
            <option value="included">Fiyatlara dahil</option>
            <option value="extra">Fiyata eklenir</option>
          </select>
        </label>
        <label className="text-sm">
          KDV %
          <input name="taxPercent" type="number" min={0} defaultValue={settings.taxPercent} className={fieldClass} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="printTerms" defaultChecked={settings.printTerms} />
          Sözleşmeleri faturaya bas
        </label>
        <label className="text-sm">
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
        <Button type="submit" className="h-10 w-fit px-4">
          Kaydet
        </Button>
      </form>
    </div>
  );
}
