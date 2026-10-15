import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { ContactActionProvider } from "@/components/contact/contact-actions";
import { MotionProvider } from "@/components/motion/motion-provider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// Türkçe karakterler (ğ, ş, ı, İ, ç, ö, ü) latin-ext alt kümesindedir (Bölüm 4.3).
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.fullName} — İstanbul ve Bodrum'da seçkin konutlar`,
    template: `%s · ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.fullName,
  // Demo: kurgusal ilanlar arama motorlarına düşmesin (K15)
  robots: siteConfig.demo ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.fullName,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0e1114",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <ContactActionProvider>{children}</ContactActionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
