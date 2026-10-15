import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Docker imajı için (K16). Vercel bu ayara ihtiyaç duymaz.
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    // Demo görselleri Unsplash'in kendi CDN'inde boyutlandırılır (K12).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [60, 75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
