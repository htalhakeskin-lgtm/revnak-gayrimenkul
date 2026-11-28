import type { NextConfig } from "next";

/**
 * Live preview in the portfolio (talha-keskin-site → docs/onizleme-izinleri.md): public pages may
 * be framed only by the origins in PORTFOLIO_ORIGINS (space separated, plain https origins).
 * Empty or unset → 'none', exactly as before. Changing the list needs a redeploy, not a code change.
 */
const portfolioOrigins = (process.env.PORTFOLIO_ORIGINS ?? "")
  .split(/\s+/)
  .filter((origin) => /^https:\/\/[a-z0-9.-]+$/i.test(origin));
const frameAncestors = portfolioOrigins.length > 0 ? portfolioOrigins.join(" ") : "'none'";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
    return [
      { source: "/:path*", headers: securityHeaders },
      // Public pages: only the portfolio may frame them. The office panel is never framed.
      {
        source: "/((?!panel/|panel$).*)",
        headers: [{ key: "Content-Security-Policy", value: `frame-ancestors ${frameAncestors}` }],
      },
      {
        source: "/panel/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }],
      },
      {
        source: "/panel",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" }],
      },
    ];
  },
};

export default nextConfig;
