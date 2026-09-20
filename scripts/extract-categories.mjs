import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputPath = "C:/Users/pc/.gemini/antigravity/brain/8723df79-8b56-40c6-a948-948f84bfd7f5/.user_uploaded/media_1789047840716.jpg";
const outputDir = "d:/EaseTasks/Projects/turateks/public/categories";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function inspectAndSlice() {
  const metadata = await sharp(inputPath).metadata();
  console.log("Image metadata:", metadata.width, "x", metadata.height);

  // Read raw pixels to detect separator lines precisely
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Function to check if a row is mostly white (separator)
  function isRowWhite(y) {
    let whiteCount = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 240 && g > 240 && b > 240) whiteCount++;
    }
    return whiteCount / width > 0.85;
  }

  // Function to check if a col is mostly white (separator)
  function isColWhite(x) {
    let whiteCount = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 240 && g > 240 && b > 240) whiteCount++;
    }
    return whiteCount / height > 0.85;
  }

  const whiteRows = [];
  for (let y = 0; y < height; y++) {
    if (isRowWhite(y)) whiteRows.push(y);
  }

  const whiteCols = [];
  for (let x = 0; x < width; x++) {
    if (isColWhite(x)) whiteCols.push(x);
  }

  function getRanges(arr) {
    const ranges = [];
    if (arr.length === 0) return ranges;
    let start = arr[0], prev = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === prev + 1) {
        prev = arr[i];
      } else {
        ranges.push([start, prev]);
        start = arr[i];
        prev = arr[i];
      }
    }
    ranges.push([start, prev]);
    return ranges;
  }

  const rowRanges = getRanges(whiteRows);
  const colRanges = getRanges(whiteCols);

  console.log("Row separator ranges:", rowRanges);
  console.log("Col separator ranges:", colRanges);

  let yBands = [];
  if (rowRanges.length >= 2) {
    yBands = [
      [0, rowRanges[0][0] - 1],
      [rowRanges[0][1] + 1, rowRanges[1][0] - 1],
      [rowRanges[1][1] + 1, height - 1]
    ];
  } else {
    const h3 = Math.floor(height / 3);
    yBands = [[0, h3], [h3, h3 * 2], [h3 * 2, height]];
  }

  let xBands = [];
  if (colRanges.length >= 2) {
    xBands = [
      [0, colRanges[0][0] - 1],
      [colRanges[0][1] + 1, colRanges[1][0] - 1],
      [colRanges[1][1] + 1, width - 1]
    ];
  } else {
    const w3 = Math.floor(width / 3);
    xBands = [[0, w3], [w3, w3 * 2], [w3 * 2, width]];
  }

  console.log("Y bands:", yBands);
  console.log("X bands:", xBands);

  const fileNames = [
    ["rainwear.webp", "apron.webp", "reflective-raincoat.webp"],
    ["fishing-rainwear.webp", "motorcycle-rainwear.webp", "fishing-suit.webp"],
    ["rain-pants.webp", "booted-products.webp", "sleeves.webp"]
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

      const outName = fileNames[r][c];
      const outPath = path.join(outputDir, outName);

      console.log(`Extracting [${r},${c}] -> ${outName} (${extractWidth}x${extractHeight}) from (${left},${top})`);

      await sharp(inputPath)
        .extract({ left, top, width: extractWidth, height: extractHeight })
        .webp({ quality: 90 })
        .toFile(outPath);
    }
  }

  console.log("All 9 images successfully extracted to", outputDir);
}

inspectAndSlice().catch(console.error);
