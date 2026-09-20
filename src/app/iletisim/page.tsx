import type { Metadata } from "next";

import { ContactSection } from "@/components/contact/contact-section";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, contactPageJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = absoluteUrl("/iletisim");
  const title = `İletişim & Toptan Sipariş Hattı | ${settings.name} Yağmurluk İmalatı`;
  const description = `${settings.name} fabrika ve merkez satış ofisi iletişim bilgileri. Toptan yağmurluk siparişi, kurumsal logo baskı ve toptan fiyat teklifleri için hemen arayın veya WhatsApp'tan yazın.`;

  return {
    title,
    description,
    keywords: [
      "turateks iletişim",
      "toptan yağmurluk",
      "yağmurluk imalatçısı bursa",
      "toptan yağmurluk fiyatları",
      "yağmurluk fabrikası",
      "kurumsal logo baskılı yağmurluk",
      "su geçirmez yağmurluk toptan",
      "pvc balıkçı yağmurluk imalatı",
      "iş güvenliği yağmurluk toptan",
      "promosyon yağmurluk üretimi",
      "yağmurluk toptan satış bursa",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "tr_TR",
      siteName: settings.name,
      images: [
        {
          url: absoluteUrl("/brand/hero/hero-factory.png"),
          width: 1200,
          height: 630,
          alt: `${settings.name} İletişim & Toptan Sipariş Hattı`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/brand/hero/hero-factory.png")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ContactPage() {
  const settings = await getSettings();
  const jsonLdData = contactPageJsonLd(settings);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ContactSection settings={settings} />
    </>
  );
}
