import Link from "next/link";

import { FOOTER_PRODUCT_NAV, LEGAL_NAV, MAIN_NAV } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/settings";
import { SITE, whatsappHref } from "@/lib/site";

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const s = settings ?? {
    name: SITE.name,
    tagline: SITE.tagline,
    phoneDisplay: SITE.phoneDisplay,
    phoneHref: SITE.phoneHref,
    email: SITE.email,
    whatsapp: SITE.whatsapp,
    address: SITE.address,
    taxMode: "included" as const,
    taxPercent: 20,
    printTerms: false,
  };
  return (
    <footer className="mt-auto bg-charcoal text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide uppercase">{s.name}</p>
          <p className="text-sm leading-6 text-white/70">{s.tagline}. Toptan ve perakende.</p>
          <p className="text-sm text-white/70">{s.address}</p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-white/50 uppercase">Ürünler</p>
          <ul className="space-y-2 text-sm text-white/80">
            {FOOTER_PRODUCT_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-white/50 uppercase">Firma</p>
          <ul className="space-y-2 text-sm text-white/80">
            {MAIN_NAV.filter((i) => i.href !== "/urunler").map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-white/50 uppercase">Yasal & iletişim</p>
          <ul className="space-y-2 text-sm text-white/80">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={s.phoneHref} className="hover:text-primary">
                {s.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:text-primary">
                {s.email}
              </a>
            </li>
            <li>
              <a href={whatsappHref(undefined, s.whatsapp)} className="hover:text-primary">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50">
          © {new Date().getFullYear()} {s.name}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
