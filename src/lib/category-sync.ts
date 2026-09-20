import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CATEGORY_FILES = [
  "rainwear.webp",
  "apron.webp",
  "reflective-raincoat.webp",
  "fishing-rainwear.webp",
  "motorcycle-rainwear.webp",
  "fishing-suit.webp",
  "rain-pants.webp",
  "booted-products.webp",
  "sleeves.webp",
];

export async function ensureCategoryAssetsSynced(): Promise<void> {
  if (typeof window !== "undefined") return;

  try {
    const publicDir = path.join(process.cwd(), "public", "categories");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const allExist = CATEGORY_FILES.every((file) => {
      const p = path.join(publicDir, file);
      return fs.existsSync(p) && fs.statSync(p).size > 1000;
    });

    if (allExist) {
      return;
    }

    const possibleSourcePaths = [
      "C:/Users/pc/.gemini/antigravity/brain/8723df79-8b56-40c6-a948-948f84bfd7f5/.user_uploaded/media_1789047840716.jpg",
      path.join(process.cwd(), "public", "categories", "grid-source.jpg"),
    ];

    const sourcePath = possibleSourcePaths.find((p) => fs.existsSync(p));
    if (!sourcePath) {
      console.warn("[category-sync] Source grid image not found");
      return;
    }

    // Dynamically import sharp to avoid bundling issues if called in client contexts
    const normalizedSource = path.normalize(sourcePath);
    const sharpInstance = sharp(normalizedSource);
    const metadata = await sharpInstance.metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 675;

    const { data, info } = await sharpInstance.raw().toBuffer({ resolveWithObject: true });
    const channels = info.channels;

    function isRowWhite(y: number) {
      let whiteCount = 0;
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r > 225 && g > 225 && b > 225) whiteCount++;
      }
      return whiteCount / width > 0.65;
    }

    function isColWhite(x: number) {
      let whiteCount = 0;
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * channels;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r > 225 && g > 225 && b > 225) whiteCount++;
      }
      return whiteCount / height > 0.65;
    }

    const whiteRows: number[] = [];
    for (let y = 0; y < height; y++) {
      if (isRowWhite(y)) whiteRows.push(y);
    }

    const whiteCols: number[] = [];
    for (let x = 0; x < width; x++) {
      if (isColWhite(x)) whiteCols.push(x);
    }

    function getRanges(arr: number[]): [number, number][] {
      const ranges: [number, number][] = [];
      if (arr.length === 0) return ranges;
      let start = arr[0], prev = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] === prev + 1) {
          prev = arr[i];
        } else {
          if (prev - start >= 2) {
            ranges.push([start, prev]);
          }
          start = arr[i];
          prev = arr[i];
        }
      }
      if (prev - start >= 2) {
        ranges.push([start, prev]);
      }
      return ranges;
    }

    const rowRanges = getRanges(whiteRows);
    const colRanges = getRanges(whiteCols);

    // Pick separator closest to 33% and 66%
    let yBands: [number, number][];
    if (rowRanges.length >= 2) {
      const target1 = height / 3;
      const target2 = (height * 2) / 3;
      const sep1 = rowRanges.reduce((prev, curr) =>
        Math.abs((curr[0] + curr[1]) / 2 - target1) < Math.abs((prev[0] + prev[1]) / 2 - target1) ? curr : prev
      );
      const remaining = rowRanges.filter((r) => r !== sep1);
      const sep2 = remaining.reduce((prev, curr) =>
        Math.abs((curr[0] + curr[1]) / 2 - target2) < Math.abs((prev[0] + prev[1]) / 2 - target2) ? curr : prev
      );
      const [firstSep, secondSep] = sep1[0] < sep2[0] ? [sep1, sep2] : [sep2, sep1];

      yBands = [
        [0, firstSep[0] - 1],
        [firstSep[1] + 1, secondSep[0] - 1],
        [secondSep[1] + 1, height - 1],
      ];
    } else {
      const sepH = Math.max(4, Math.round(height * 0.015));
      const hCell = Math.floor((height - sepH * 2) / 3);
      yBands = [
        [0, hCell],
        [hCell + sepH, hCell * 2 + sepH],
        [hCell * 2 + sepH * 2, height - 1],
      ];
    }

    let xBands: [number, number][];
    if (colRanges.length >= 2) {
      const target1 = width / 3;
      const target2 = (width * 2) / 3;
      const sep1 = colRanges.reduce((prev, curr) =>
        Math.abs((curr[0] + curr[1]) / 2 - target1) < Math.abs((prev[0] + prev[1]) / 2 - target1) ? curr : prev
      );
      const remaining = colRanges.filter((r) => r !== sep1);
      const sep2 = remaining.reduce((prev, curr) =>
        Math.abs((curr[0] + curr[1]) / 2 - target2) < Math.abs((prev[0] + prev[1]) / 2 - target2) ? curr : prev
      );
      const [firstSep, secondSep] = sep1[0] < sep2[0] ? [sep1, sep2] : [sep2, sep1];

      xBands = [
        [0, firstSep[0] - 1],
        [firstSep[1] + 1, secondSep[0] - 1],
        [secondSep[1] + 1, width - 1],
      ];
    } else {
      const sepW = Math.max(4, Math.round(width * 0.015));
      const wCell = Math.floor((width - sepW * 2) / 3);
      xBands = [
        [0, wCell],
        [wCell + sepW, wCell * 2 + sepW],
        [wCell * 2 + sepW * 2, width - 1],
      ];
    }

    const fileGrid = [
      ["rainwear.webp", "apron.webp", "reflective-raincoat.webp"],
      ["fishing-rainwear.webp", "motorcycle-rainwear.webp", "fishing-suit.webp"],
      ["rain-pants.webp", "booted-products.webp", "sleeves.webp"],
    ];

    const INSET = 2;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const [leftRaw, rightRaw] = xBands[c];
        const [topRaw, bottomRaw] = yBands[r];

        const left = Math.max(0, leftRaw + (c > 0 ? INSET : 0));
        const right = Math.min(width - 1, rightRaw - (c < 2 ? INSET : 0));
        const top = Math.max(0, topRaw + (r > 0 ? INSET : 0));
        const bottom = Math.min(height - 1, bottomRaw - (r < 2 ? INSET : 0));

        const extractWidth = right - left + 1;
        const extractHeight = bottom - top + 1;

        const outName = fileGrid[r][c];
        const outPath = path.join(publicDir, outName);

        await sharp(sourcePath)
          .extract({ left, top, width: extractWidth, height: extractHeight })
          .webp({ quality: 90 })
          .toFile(outPath);
      }
    }

    console.log("[category-sync] Sliced all 9 category images successfully into public/categories");
  } catch (err) {
    console.error("[category-sync] Error extracting category images:", err);
  }
}

if (typeof window === "undefined") {
  ensureCategoryAssetsSynced().catch(() => {});
}

