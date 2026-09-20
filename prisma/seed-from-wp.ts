/**
 * One-way import: WordPress source DB → Prisma app DB.
 *
 * Local defaults expect the cPanel export in `wp-upload/`:
 * - SQL imported into local database `turkey_wp`
 * - `uploads.zip` extracted to `wp-upload/extracted/uploads`
 *
 * Every source setting can be overridden with WP_DB_* / WP_UPLOADS_PATH.
 */
import { createConnection } from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

const LOCAL_WP_UPLOADS = path.resolve(__dirname, "../wp-upload/extracted/uploads");
const LEGACY_WP_UPLOADS = path.resolve(__dirname, "../../app/public/wp-content/uploads");
const WP_UPLOADS = process.env.WP_UPLOADS_PATH
  ? path.resolve(process.env.WP_UPLOADS_PATH)
  : fs.existsSync(LOCAL_WP_UPLOADS)
    ? LOCAL_WP_UPLOADS
    : LEGACY_WP_UPLOADS;
const PUBLIC_UPLOADS = path.resolve(__dirname, "../public/uploads");

const WP_URL = {
  host: process.env.WP_DB_HOST ?? "127.0.0.1",
  port: Number(process.env.WP_DB_PORT ?? 3306),
  user: process.env.WP_DB_USER ?? "root",
  password: process.env.WP_DB_PASSWORD ?? "",
  database: process.env.WP_DB_NAME ?? "turkey_wp",
};

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tryToKurus(raw: string | number | null) {
  if (raw == null || raw === "") return 0;
  const n = Number(String(raw).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function copyUpload(relative: string) {
  const src = path.join(WP_UPLOADS, relative.replace(/\//g, path.sep));
  if (!fs.existsSync(src)) return null;
  const dest = path.join(PUBLIC_UPLOADS, relative.replace(/\//g, path.sep));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return `/uploads/${relative.replace(/\\/g, "/")}`;
}

async function metaMap(conn: Awaited<ReturnType<typeof createConnection>>, postId: number) {
  const [rows] = await conn.query(
    "SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?",
    [postId],
  );
  const map = new Map<string, string>();
  for (const r of rows as { meta_key: string; meta_value: string }[]) {
    map.set(r.meta_key, r.meta_value);
  }
  return map;
}

async function attachmentFile(
  conn: Awaited<ReturnType<typeof createConnection>>,
  attachId: number,
) {
  const [rows] = await conn.query(
    "SELECT meta_value FROM wp_postmeta WHERE post_id = ? AND meta_key = '_wp_attached_file'",
    [attachId],
  );
  const file = (rows as { meta_value: string }[])[0]?.meta_value;
  return file ?? null;
}

async function main() {
  const wp = await createConnection(WP_URL);

  const [products] = await wp.query(
    `SELECT ID, post_title, post_name, post_content, post_excerpt
     FROM wp_posts
     WHERE post_type = 'product' AND post_status = 'publish'
     ORDER BY ID`,
  );

  const rows = products as {
    ID: number;
    post_title: string;
    post_name: string;
    post_content: string;
    post_excerpt: string;
  }[];

  console.log(`WP published products: ${rows.length}`);

  if (rows.length === 0) {
    throw new Error("WordPress source contains no published products; import cancelled.");
  }
  if (!fs.existsSync(WP_UPLOADS)) {
    throw new Error(`WordPress uploads directory not found: ${WP_UPLOADS}`);
  }

  const [catRows] = await wp.query(
    `SELECT t.term_id, t.name, t.slug
     FROM wp_terms t
     JOIN wp_term_taxonomy tt ON tt.term_id = t.term_id
     WHERE tt.taxonomy = 'product_cat'`,
  );

  for (const c of catRows as { slug: string; name: string }[]) {
    if (c.slug === "uncategorized") continue;
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    });
  }

  const fallbackCat = await prisma.category.upsert({
    where: { slug: "urunler" },
    update: { name: "Ürünler" },
    create: { slug: "urunler", name: "Ürünler" },
  });

  let imported = 0;
  let importedImages = 0;
  let missingImages = 0;
  const usedSkus = new Set<string>();

  for (const p of rows) {
    const meta = await metaMap(wp, p.ID);
    const [cats] = await wp.query(
      `SELECT t.name, t.slug
       FROM wp_terms t
       JOIN wp_term_taxonomy tt ON tt.term_id = t.term_id
       JOIN wp_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
       WHERE tr.object_id = ? AND tt.taxonomy = 'product_cat'`,
      [p.ID],
    );
    const productCats = cats as { name: string; slug: string }[];
    const primaryCat =
      productCats.find((c) => c.slug !== "uncategorized") ?? productCats[0];
    const category = primaryCat
      ? await prisma.category.findUnique({ where: { slug: primaryCat.slug } })
      : fallbackCat;

    const wholesale =
      productCats.some((c) => /toptan/i.test(c.slug) || /toptan/i.test(c.name)) ||
      /\d+\s*adet/i.test(p.post_title);

    const price = tryToKurus(meta.get("_price") ?? meta.get("_regular_price") ?? "0");
    let sku = (meta.get("_sku") || `WP-${p.ID}`).trim();
    if (usedSkus.has(sku)) sku = `${sku}-${p.ID}`;
    usedSkus.add(sku);

    const description = stripHtml(p.post_content || p.post_excerpt || p.post_title);

    const saved = await prisma.product.upsert({
      where: { slug: p.post_name },
      update: {
        name: p.post_title,
        sku,
        description,
        wholesale,
        isNew: false,
        categoryId: (category ?? fallbackCat).id,
      },
      create: {
        slug: p.post_name,
        name: p.post_title,
        sku,
        description,
        wholesale,
        isNew: false,
        categoryId: (category ?? fallbackCat).id,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.priceTier.deleteMany({ where: { productId: saved.id } });
    await prisma.productTag.deleteMany({ where: { productId: saved.id } });

    const galleryIds = [
      meta.get("_thumbnail_id"),
      ...(meta.get("_product_image_gallery") ?? "").split(","),
    ]
      .map((x) => Number(String(x).trim()))
      .filter((n) => Number.isFinite(n) && n > 0);

    let sortOrder = 0;
    for (const aid of galleryIds) {
      const file = await attachmentFile(wp, aid);
      if (!file) continue;
      const url = copyUpload(file);
      if (!url) {
        missingImages += 1;
        console.warn(`  ! Missing image: ${file}`);
        continue;
      }
      await prisma.productImage.create({
        data: {
          productId: saved.id,
          label: path.basename(file),
          url,
          sortOrder: sortOrder++,
        },
      });
      importedImages += 1;
    }

    await prisma.priceTier.create({
      data: {
        productId: saved.id,
        minQty: wholesale ? 10 : 1,
        maxQty: null,
        unitPrice: price || 0,
      },
    });

    imported += 1;
    console.log(`  ✓ ${p.post_name} (${sku})`);
  }

  await wp.end();
  const totalProducts = await prisma.product.count();
  console.log(
    `Imported ${imported} WordPress products and ${importedImages} images into turkey ` +
      `(missing images: ${missingImages}, total products: ${totalProducts}).`,
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
