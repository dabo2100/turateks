import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ensureCategoryAssetsSynced } from "@/lib/category-sync";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;

  if (!name) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const publicPath = path.join(process.cwd(), "public", "categories", name);

  // If already exists on disk, stream it
  if (fs.existsSync(publicPath)) {
    const fileBuffer = fs.readFileSync(publicPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": name.endsWith(".png") ? "image/png" : "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Otherwise trigger sync
  await ensureCategoryAssetsSynced();

  if (fs.existsSync(publicPath)) {
    const fileBuffer = fs.readFileSync(publicPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": name.endsWith(".png") ? "image/png" : "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return new NextResponse("Image Not Found", { status: 404 });
}
