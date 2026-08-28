import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sepet", "/hesap", "/odeme", "/admin", "/api"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}
