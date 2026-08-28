import type { Metadata } from "next";

import { ContactForm } from "@/components/cms/contact-form";
import { LegalArticle } from "@/components/cms/legal-article";
import { DEFAULT_PAGES } from "@/lib/cms";
import { legalPageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { whatsappHref } from "@/lib/site";

export function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata(DEFAULT_PAGES[1].slug);
}

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div>
      <LegalArticle slug={DEFAULT_PAGES[1].slug} />
      <div className="mx-auto max-w-3xl px-4 pb-16 text-sm">
        <h2 className="text-lg font-semibold">İletişim bilgileri</h2>
        <p className="mt-3">{settings.address}</p>
        <p className="mt-2">
          <a className="text-primary" href={settings.phoneHref}>
            {settings.phoneDisplay}
          </a>
        </p>
        <p className="mt-1">
          <a className="text-primary" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
        </p>
        <p className="mt-1">
          <a className="text-primary" href={whatsappHref(undefined, settings.whatsapp)}>
            WhatsApp
          </a>
        </p>
        <h2 className="mt-10 text-lg font-semibold">Form</h2>
        <ContactForm />
        <h2 className="mt-10 text-lg font-semibold">Harita</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <iframe
            title="Turateks konum"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=15&output=embed`}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
