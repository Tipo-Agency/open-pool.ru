import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { BookingModal } from "./booking-modal";
import { SITE_NAME, SITE_URL } from "./seo";
import { TrackingHeadScripts, TrackingNoScript } from "./tracking";
import { TrackingEvents } from "./tracking-events";
import { MobileActionBar } from "./conversion";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
});

// The ruble alone otherwise downloads Unbounded's entire Latin Extended file.
const rubleFontFace = `@font-face {
  font-family: 'Open Pool Ruble';
  font-style: normal;
  font-weight: 200 900;
  font-display: swap;
  src: url('/fonts/open-pool-ruble-wght-v1.woff2') format('woff2');
  unicode-range: U+20BD;
}`;
const fontVariables = {
  "--font-unbounded": `'Open Pool Ruble', ${unbounded.style.fontFamily}`,
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Открытый бассейн Наутилус в Хабаровске",
    template: "%s | Наутилус",
  },
  description:
    "Открытый 50-метровый бассейн в Хабаровске. Плавание, аквааэробика, занятия для детей и взрослых.",
  applicationName: "Наутилус",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Спорт и отдых",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  keywords: ["открытый бассейн Хабаровск", "бассейн Хабаровск", "плавание Хабаровск", "аквааэробика Хабаровск", "абонемент в бассейн"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: "Плывите под открытым небом",
    description: "50-метровый открытый бассейн в Хабаровске. Вода +28 °C круглый год.",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Открытый бассейн Наутилус в Хабаровске" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Плывите под открытым небом",
    description: "50-метровый открытый бассейн в Хабаровске. Вода +28 °C круглый год.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  other: { "geo.region": "RU-KHA", "geo.placename": "Хабаровск" },
  icons: { icon: "/logo-nautilus.svg", shortcut: "/logo-nautilus.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head><TrackingHeadScripts /><style>{rubleFontFace}</style></head>
      <body className={`${manrope.variable} ${unbounded.variable}`} style={fontVariables}>
        <TrackingNoScript />
        <TrackingEvents />
        {children}
        <MobileActionBar />
        <BookingModal />
      </body>
    </html>
  );
}
