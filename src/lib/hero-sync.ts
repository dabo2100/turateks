import fs from "node:fs";
import path from "node:path";

/**
 * Server-side synchronization: copies files from drive-download folder into public/images/hero-1080
 * and public/images/hero-mobile to guarantee fresh, static serving with zero caching issues.
 */
export function ensureHeroAssetsSynced(): void {
  if (typeof window !== "undefined") return;

  try {
    const brainDir = "C:\\Users\\pc\\.gemini\\antigravity\\brain\\e5adb4df-27a9-4650-b30f-aa6d44c22129";
    const widescreenPublic = path.join(process.cwd(), "public", "images", "hero-widescreen");
    const desktopPublic = path.join(process.cwd(), "public", "images", "hero-1080");
    const mobilePublic = path.join(process.cwd(), "public", "images", "hero-mobile");

    fs.mkdirSync(widescreenPublic, { recursive: true });
    fs.mkdirSync(desktopPublic, { recursive: true });
    fs.mkdirSync(mobilePublic, { recursive: true });

    const widescreenMapping: [string, string][] = [
      [path.join(brainDir, ".user_uploaded", "media_1788953515488.jpg"), "tulum-cizmeli.jpg"],
      [path.join(brainDir, "girgirci_hero_banner_1788953627455.jpg"), "girgir-yagmurluk.jpg"],
      [path.join(brainDir, "balikci_hero_banner_1788953677968.jpg"), "balikci-tip.jpg"],
      [path.join(brainDir, "boy_pardesu_hero_banner_1788953700674.jpg"), "boy-pardesu.jpg"],
      [path.join(brainDir, "motorcu_hero_banner_1788953731694.jpg"), "motorcu-yagmurluk.jpg"],
    ];

    for (const [srcFile, targetFile] of widescreenMapping) {
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(widescreenPublic, targetFile));
        // hero-1080 is reserved for the original 1080x1440 artboards only
      }
    }

    const baseDir = path.join(process.cwd(), "drive-download-20260909T100454Z-1-001");
    if (!fs.existsSync(baseDir)) return;

    // Desktop source: strictly from 1080x1440 folder
    const desktopDir = path.join(baseDir, "1080x1440");
    if (fs.existsSync(desktopDir)) {
      const desktopFiles = fs.readdirSync(desktopDir);
      const desktopMapping: [string, string][] = [
        ["Artboard 1", "tulum-cizmeli.jpg"],
        ["Artboard 2", "boy-pardesu.jpg"],
        ["Artboard 3", "balikci-tip.jpg"],
        ["Artboard 4", "motorcu-yagmurluk.jpg"],
        ["Artboard 5", "girgir-yagmurluk.jpg"],
      ];

      const dimsInfo: Record<string, string> = {};
      function getJpegDimensions(buffer: Buffer) {
        for (let i = 0; i < buffer.length - 8; i++) {
          if (buffer[i] === 0xff && (buffer[i + 1] === 0xc0 || buffer[i + 1] === 0xc2)) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return `${width}x${height} (ratio ${(width/height).toFixed(2)})`;
          }
        }
        return "unknown";
      }

      for (const [sourceName, targetName] of desktopMapping) {
        const match = desktopFiles.find((f) =>
          f.toLowerCase().includes(sourceName.toLowerCase()),
        );
        if (match) {
          const srcPath = path.join(desktopDir, match);
          const destPath = path.join(desktopPublic, targetName);
          fs.copyFileSync(srcPath, destPath);
          const buf = fs.readFileSync(srcPath);
          dimsInfo[match] = getJpegDimensions(buf);
        }
      }
      fs.writeFileSync(path.join(process.cwd(), "public", "images", "dims.json"), JSON.stringify(dimsInfo, null, 2));
    }

    // Mobile source: strictly from 'telefon ölçüsü' folder
    const entries = fs.readdirSync(baseDir);
    const mobileFolderName = entries.find((e) => /telefon/i.test(e));
    if (mobileFolderName) {
      const mobileDir = path.join(baseDir, mobileFolderName);
      const mobileFiles = fs.readdirSync(mobileDir);
      const mobileMapping: [string, string][] = [
        ["Artboard 1", "tulum-cizmeli.jpg"],
        ["Artboard 2", "boy-pardesu.jpg"],
        ["Artboard 3", "balikci-tip.jpg"],
        ["Artboard 4", "motorcu-yagmurluk.jpg"],
        ["Artboard 5", "girgir-yagmurluk.jpg"],
      ];

      for (const [sourceName, targetName] of mobileMapping) {
        const found = mobileFiles.find((f) =>
          f.toLowerCase().includes(sourceName.toLowerCase()),
        );
        if (found) {
          const srcPath = path.join(mobileDir, found);
          const destPath = path.join(mobilePublic, targetName);
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  } catch {
    // Gracefully handle any fs permission restrictions
  }
}

// Auto-run once when loaded in Node server
if (typeof window === "undefined") {
  try {
    ensureHeroAssetsSynced();
  } catch {
    // ignore
  }
}
