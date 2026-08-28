import type { NextConfig } from "next";

import { WP_PERMANENT_REDIRECTS } from "./src/lib/wp-redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return WP_PERMANENT_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Accel-Buffering", value: "no" },
        ],
      },
    ];
  },
};

export default nextConfig;
