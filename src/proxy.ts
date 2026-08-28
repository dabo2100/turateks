import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isGonePath } from "@/lib/wp-redirects";

export function proxy(request: NextRequest) {
  if (!isGonePath(request.nextUrl.pathname)) return;
  return new NextResponse("Bu sayfa kaldırıldı.", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/hizmetlerimiz",
    "/hizmetlerimiz/:path*",
    "/hizmetlerimiz",
    "/hizmetlerimiz/:path*",
    "/services",
    "/services/:path*",
    "/urun-etiketi/:path*",
    "/product-tag/:path*",
    "/tag/:path*",
    "/feed",
    "/comments/feed",
  ],
};
