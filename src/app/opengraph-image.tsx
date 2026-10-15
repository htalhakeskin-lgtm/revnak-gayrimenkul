import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SPARKLE_PATH } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.fullName} — İstanbul ve Bodrum'da seçkin konutlar`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fraunces = await readFile(join(process.cwd(), "assets/fonts/Fraunces-Regular.ttf"));

/** Markalı paylaşım görseli (M21) */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0e1114 0%, #171b20 60%, #2a2f36 100%)",
          color: "#f5f1ea",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18.5" stroke="#f5f1ea" strokeOpacity="0.35" />
            <path d={SPARKLE_PATH} fill="#c5a46d" />
            <circle cx="30.5" cy="9.5" r="1.4" fill="#c5a46d" fillOpacity="0.7" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, letterSpacing: 14 }}>REVNAK</span>
            <span style={{ fontSize: 16, letterSpacing: 10, color: "#9aa0a8" }}>GAYRİMENKUL</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, lineHeight: 1.05 }}>Boğaz&apos;dan Ege&apos;ye,</span>
          <span style={{ fontSize: 76, lineHeight: 1.05 }}>seçkin yaşam alanları.</span>
          <span style={{ marginTop: 28, fontSize: 26, color: "#c5a46d" }}>Bebek · Yeniköy · Nişantaşı · Moda · Yalıkavak</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, style: "normal", weight: 400 }] },
  );
}
