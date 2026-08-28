import { notFound } from "next/navigation";

import { getPage } from "@/lib/cms";

export async function LegalArticle({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground/90">{page.body}</div>
    </article>
  );
}
