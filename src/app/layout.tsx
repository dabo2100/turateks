import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { StoreShell } from "@/components/layout/store-shell";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { JsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { organizationJsonLd, siteUrl } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.name,
      template: `%s | ${settings.name}`,
    },
    description: `${settings.tagline}. Türkiye'de üretilen profesyonel yağmurluk ve koruyucu giysi. Toptan ve perakende.`,
    openGraph: {
      locale: "tr_TR",
      type: "website",
      siteName: settings.name,
    },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-full flex-col bg-background text-foreground">
        <JsonLd
          data={organizationJsonLd({
            name: settings.name,
            email: settings.email,
            phoneDisplay: settings.phoneDisplay,
            address: settings.address,
          })}
        />
        <StoreShell
          footer={<SiteFooter settings={settings} />}
          fab={<WhatsappFab phone={settings.whatsapp} />}
        >
          {children}
        </StoreShell>
        <Toaster />
      </body>
    </html>
  );
}
