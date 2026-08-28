import type { Metadata } from "next";

import { LegalArticle } from "@/components/cms/legal-article";
import { DEFAULT_PAGES } from "@/lib/cms";
import { legalPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return legalPageMetadata(DEFAULT_PAGES[4].slug);
}

export default function ReturnPolicyPage() {
  return <LegalArticle slug={DEFAULT_PAGES[4].slug} />;
}
