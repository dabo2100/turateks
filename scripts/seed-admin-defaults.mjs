import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

const prisma = new PrismaClient();

const pages = [
  { slug: "hakkimizda", title: "Hakkımızda", body: "Taslak metin. Yönetim panelinden düzenleyin." },
  { slug: "iletisim", title: "İletişim", body: "Taslak iletişim metni." },
  { slug: "kvkk", title: "KVKK", body: "Taslak KVKK metni." },
  { slug: "mesafeli-satis", title: "Mesafeli Satış Sözleşmesi", body: "Taslak sözleşme." },
  { slug: "iade", title: "İade Politikası", body: "Taslak iade metni." },
  { slug: "on-bilgilendirme", title: "Ön Bilgilendirme Formu", body: "Taslak ön bilgilendirme." },
];

const env = fs.readFileSync(".env", "utf8");
if (!/^ADMIN_EMAIL=/m.test(env)) {
  const from = (env.match(/^SMTP_FROM=(.*)$/m) || env.match(/^CONTACT_TO_EMAIL=(.*)$/m) || [, "owner@example.com"])[1]
    .replace(/['"]/g, "")
    .trim();
  fs.appendFileSync(".env", `\nADMIN_EMAIL="${from}"\n`);
}

for (const page of pages) {
  await prisma.page.upsert({ where: { slug: page.slug }, update: {}, create: page });
}

console.log("seeded pages", await prisma.page.count());
await prisma.$disconnect();
