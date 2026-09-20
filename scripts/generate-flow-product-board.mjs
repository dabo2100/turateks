import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const uploads = path.join(root, "public", "uploads", "2024", "10");
const categories = path.join(root, "public", "categories");
const output = path.join(root, "public", "brand", "flow-product-reference-board.png");

const W = 3840;
const H = 2160;
const margin = 90;
const gap = 34;
const headerH = 260;
const cardW = Math.floor((W - margin * 2 - gap * 2) / 3);
const cardH = Math.floor((H - headerH - margin - gap * 2) / 3);

const groups = [
  {
    title: "BOY PARDESÜ YAĞMURLUK",
    en: "FULL-LENGTH WATERPROOF RAINCOATS",
    files: ["Pardesu-haki-logo.png", "Pardesu-haki-1-logo.png", "Pardesu-ref-neon-sari-1-logo.png", "Pardesu-ref-neon-sari-2-logo.png"],
    note: "Haki ve reflektörlü neon sarı modeller",
  },
  {
    title: "MOTORCU & KURYE TAKIMI",
    en: "MOTORCYCLE & COURIER RAIN SUITS",
    files: ["Motorcu-takim1-logo.png", "Motorcu-takim2-logo.png", "Motorcu-takim3-logo.png", "motokurye-reflektorlu-musamba-yagmurluk-tam-takim.jpg"],
    note: "Reflektörlü gece görünürlüğü — motosiklet kullanımı",
  },
  {
    title: "BALIKÇI TİP TAKIM",
    en: "PROFESSIONAL FISHERMAN RAIN SUITS",
    files: ["Balikci-takim-haki-logo-2.png", "Balikci-takim-haki-logo-3.png", "fishing-rainwear.webp"],
    note: "Balıkçı ve deniz çalışanları için su geçirmez takım",
  },
  {
    title: "GIRGIRCI TAKIM MUŞAMBA",
    en: "TRAWLER FISHING WATERPROOF SUITS",
    files: ["Girgirci-takim-1-logo.png", "Girgirci-takim-2-logo.png", "Girgirci-takim-3-logo.png", "Girgirci-takim-4-logo.png", "Girgirci-takim-5-logo-1.png"],
    note: "Zorlu deniz şartları — profesyonel balıkçı teknesi",
  },
  {
    title: "FERMUARLI & KAMUFLAJ TAKIM",
    en: "ZIPPERED & CAMOUFLAGE RAIN SUITS",
    files: ["Fermuarli-takim-haki-logo.png", "Fermuarli-kamuflaj-takim-logo-1.png", "Fermuarli-kamuflaj-takim-logo-2.png", "kamuflaj-boydan-ust-musamba-yagmurluk.jpg"],
    note: "Haki ve kamuflaj — açık hava ve saha kullanımı",
  },
  {
    title: "PROFESYONEL ÖNLÜKLER",
    en: "THREE DIFFERENT PROFESSIONAL APRON USES",
    files: ["chef-onlugu-musamba.jpg", "Bulasikci-onlugu.jpg", "Mermerci-onlugu-1-logo.png", "Mermerci-onlugu-2-logo.png"],
    note: "Şef | Bulaşıkçı | MERMERCİ: TAŞ/MERMER ATÖLYESİ — MUTFAK DEĞİL",
    warning: true,
  },
  {
    title: "ÇİZMELİ ÜRÜNLER",
    en: "ONE-PIECE BOOTED WATERPROOF WADERS",
    files: ["booted-products.webp"],
    note: "Su içinde çalışma — entegre çizme, tek parça koruma",
  },
  {
    title: "PANTOLON YAĞMURLUK",
    en: "WATERPROOF RAIN PANTS",
    files: ["rain-pants.webp"],
    note: "Belden aşağı su koruması — ayrı yağmurluk pantolonu",
  },
  {
    title: "KOLLUK",
    en: "WATERPROOF PROTECTIVE SLEEVES",
    files: ["sleeves.webp"],
    note: "Kollar için ayrı koruyucu parça — apron veya iş kıyafetiyle",
  },
];

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07111f"/><stop offset="1" stop-color="#10263a"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="18" flood-opacity=".3"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="3400" cy="-60" r="620" fill="#f58220" opacity=".07"/>
  <text x="90" y="104" font-family="Arial, Segoe UI, sans-serif" font-size="67" font-weight="800" fill="#ffffff">TURATEKS YAĞMURLUK</text>
  <text x="90" y="170" font-family="Arial, Segoe UI, sans-serif" font-size="29" font-weight="500" fill="#a9bed0">FLOW VISUAL REFERENCE • Preserve every product exactly as photographed</text>
  <text x="90" y="218" font-family="Arial, Segoe UI, sans-serif" font-size="26" font-weight="700" fill="#f58220">IMPORTANT: Each panel is a different product category. Do not mix professional use cases.</text>
  ${groups.map((g, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * (cardW + gap);
    const y = headerH + row * (cardH + gap);
    const noteColor = g.warning ? "#fff3cf" : "#b9c9d7";
    const bar = g.warning ? `<rect x="${x + 22}" y="${y + cardH - 82}" width="${cardW - 44}" height="55" rx="13" fill="#a33a16"/><text x="${x + cardW / 2}" y="${y + cardH - 45}" text-anchor="middle" font-family="Arial, Segoe UI, sans-serif" font-size="22" font-weight="800" fill="#ffffff">${esc(g.note)}</text>` : `<text x="${x + 28}" y="${y + cardH - 36}" font-family="Arial, Segoe UI, sans-serif" font-size="21" font-weight="600" fill="${noteColor}">${esc(g.note)}</text>`;
    return `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="28" fill="#f7fafc"/><rect x="${x}" y="${y}" width="${cardW}" height="105" rx="28" fill="#0b1724"/><rect x="${x}" y="${y + 78}" width="${cardW}" height="27" fill="#0b1724"/><rect x="${x}" y="${y}" width="12" height="105" rx="6" fill="#f58220"/><text x="${x + 36}" y="${y + 45}" font-family="Arial, Segoe UI, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${esc(g.title)}</text><text x="${x + 36}" y="${y + 80}" font-family="Arial, Segoe UI, sans-serif" font-size="18" font-weight="600" fill="#8fb1ca">${esc(g.en)}</text>${bar}</g>`;
  }).join("")}
</svg>`;

const composites = [{ input: Buffer.from(svg), left: 0, top: 0 }];

const brandLogo = await sharp(path.join(root, "public", "brand", "logo.png"))
  .resize(330, 150, { fit: "contain" })
  .png()
  .toBuffer();
composites.push({ input: brandLogo, left: W - margin - 330, top: 48 });

for (let i = 0; i < groups.length; i++) {
  const g = groups[i];
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cardX = margin + col * (cardW + gap);
  const cardY = headerH + row * (cardH + gap);
  const imgTop = cardY + 122;
  const imgBottomPad = g.warning ? 102 : 70;
  const availableH = cardH - 122 - imgBottomPad;
  const innerW = cardW - 44;
  const n = g.files.length;
  const cellGap = 12;
  const cellW = Math.floor((innerW - cellGap * (n - 1)) / n);
  for (let j = 0; j < n; j++) {
    const isCategory = g.files[j].endsWith(".webp");
    const src = path.join(isCategory ? categories : uploads, g.files[j]);
    const buf = await sharp(src)
      .resize(cellW, availableH, { fit: "contain", background: { r: 247, g: 250, b: 252, alpha: 1 } })
      .png()
      .toBuffer();
    composites.push({ input: buf, left: cardX + 22 + j * (cellW + cellGap), top: imgTop });
  }
}

await sharp({ create: { width: W, height: H, channels: 4, background: "#07111f" } })
  .composite(composites)
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(output);

console.log(output);
