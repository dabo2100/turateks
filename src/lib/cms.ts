import { prisma } from "@/lib/db";

export const DEFAULT_PAGES = [
  {
    slug: "hakkimizda",
    title: "Hakkımızda",
    body: "Turateks Yağmurluk, Türkiye'de üretilen profesyonel yağmurluk ve koruyucu giysi üreticisidir. Bu metni yönetim panelinden düzenleyebilirsiniz.",
  },
  {
    slug: "iletisim",
    title: "İletişim",
    body: "Sipariş ve toptan talepleriniz için telefon, e-posta, WhatsApp veya aşağıdaki formu kullanın.",
  },
  {
    slug: "kvkk",
    title: "KVKK",
    body: "Kişisel verilerinizin korunması hakkında aydınlatma metni. Bu taslağı yönetim panelinden yasal metninizle değiştirin.",
  },
  {
    slug: "mesafeli-satis",
    title: "Mesafeli Satış Sözleşmesi",
    body: "Mesafeli satış sözleşmesi taslağı. Satın alma öncesi yükümlülüklerinizi buraya yazın.",
  },
  {
    slug: "iade",
    title: "İade Politikası",
    body: "Cayma hakkı ve iade koşulları taslağı. Kesin metni yönetim panelinden girin.",
  },
  {
    slug: "on-bilgilendirme",
    title: "Ön Bilgilendirme Formu",
    body: "Mesafeli sözleşmeler öncesi ön bilgilendirme formu taslağı.",
  },
] as const;

export async function ensureDefaultPages() {
  try {
    for (const page of DEFAULT_PAGES) {
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: {},
        create: page,
      });
    }
  } catch {
    // Database offline or unreachable
  }
}

export async function getPage(slug: string) {
  try {
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) return existing;
    await ensureDefaultPages();
    return await prisma.page.findUnique({ where: { slug } });
  } catch {
    const fallback = DEFAULT_PAGES.find((p) => p.slug === slug);
    if (!fallback) return null;
    return {
      id: fallback.slug,
      slug: fallback.slug,
      title: fallback.title,
      body: fallback.body,
      seoTitle: null,
      seoDesc: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
