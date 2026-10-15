import { ImageResponse } from "next/og";
import { SPARKLE_PATH } from "@/components/layout/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e1114" }}>
        <svg width="128" height="128" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18.5" stroke="#f5f1ea" strokeOpacity="0.35" />
          <path d={SPARKLE_PATH} fill="#c5a46d" />
          <circle cx="30.5" cy="9.5" r="1.4" fill="#c5a46d" fillOpacity="0.7" />
        </svg>
      </div>
    ),
    size,
  );
}
