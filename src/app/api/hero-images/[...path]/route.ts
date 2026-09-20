import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const FILE_MAP: Record<string, { artboard: string }> = {
  "tulum-cizmeli.jpg": {
    artboard: "Artboard 1.jpg",
  },
  "boy-pardesu.jpg": {
    artboard: "Artboard 2.jpg",
  },
  "balikci-tip.jpg": {
    artboard: "Artboard 3.jpg",
  },
  "motorcu-yagmurluk.jpg": {
    artboard: "Artboard 4.jpg",
  },
  "girgir-yagmurluk.jpg": {
    artboard: "Artboard 5.jpg",
  },
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await context.params;

  if (!pathSegments || pathSegments.length < 2) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const [mode, fileName] = pathSegments;
  const mapping = FILE_MAP[fileName];

  if (!mapping || (mode !== "desktop" && mode !== "mobile" && mode !== "widescreen")) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const baseDir = path.join(
    process.cwd(),
    "drive-download-20260909T100454Z-1-001",
  );

  let sourceFilePath = "";

  if (mode === "desktop" || mode === "widescreen") {
    const brainDir = "C:\\Users\\pc\\.gemini\\antigravity\\brain\\e5adb4df-27a9-4650-b30f-aa6d44c22129";
    const widescreenFiles: Record<string, string> = {
      "tulum-cizmeli.jpg": path.join(brainDir, ".user_uploaded", "media_1788953515488.jpg"),
      "girgir-yagmurluk.jpg": path.join(brainDir, "girgirci_hero_banner_1788953627455.jpg"),
      "balikci-tip.jpg": path.join(brainDir, "balikci_hero_banner_1788953677968.jpg"),
      "boy-pardesu.jpg": path.join(brainDir, "boy_pardesu_hero_banner_1788953700674.jpg"),
      "motorcu-yagmurluk.jpg": path.join(brainDir, "motorcu_hero_banner_1788953731694.jpg"),
    };

    if (widescreenFiles[fileName] && fs.existsSync(widescreenFiles[fileName])) {
      sourceFilePath = widescreenFiles[fileName];

      // Also ensure copied to public/images/hero-widescreen
      try {
        const publicDir = path.join(process.cwd(), "public", "images", "hero-widescreen");
        fs.mkdirSync(publicDir, { recursive: true });
        const dest = path.join(publicDir, fileName);
        fs.copyFileSync(sourceFilePath, dest);
      } catch {
        // ignore
      }
    } else {
      const desktopDir = path.join(baseDir, "1080x1440");
      try {
        if (fs.existsSync(desktopDir)) {
          const desktopFiles = fs.readdirSync(desktopDir);
          const match = desktopFiles.find((f) =>
            f.toLowerCase().includes(mapping.artboard.toLowerCase()),
          );
          if (match) {
            sourceFilePath = path.join(desktopDir, match);
          }
        }
      } catch {
        // directory error
      }
    }
  } else {
    try {
      const entries = fs.readdirSync(baseDir);
      const mobileFolderName = entries.find((e) => /telefon/i.test(e));
      if (mobileFolderName) {
        const mobileDir = path.join(baseDir, mobileFolderName);
        const mobileFiles = fs.readdirSync(mobileDir);
        const match = mobileFiles.find((f) =>
          f.toLowerCase().includes(mapping.artboard.toLowerCase()),
        );
        if (match) {
          sourceFilePath = path.join(mobileDir, match);
        }
      }
    } catch {
      // directory error
    }
  }

  if (!sourceFilePath || !fs.existsSync(sourceFilePath)) {
    return new NextResponse("Image Source Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(sourceFilePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
