import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { BookingModal } from "./booking-modal";
import { SITE_NAME, SITE_URL } from "./seo";
import { TrackingHeadScripts, TrackingNoScript } from "./tracking";
import { TrackingEvents } from "./tracking-events";
import { MobileActionBar } from "./conversion";
import { BrandMotion } from "./brand-motion";
import { CookieNotice } from "./cookie-notice";

// Geologica, шрифт сети «Наутилус» по брендбуку 2026. Свои woff2 из брендбука, без Google Fonts.
const geologicaFaces = [
  ["cyrillic-ext", "U+0460-052F, U+1C80-1C8A, U+20B4, U+20BD, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"],
  ["cyrillic", "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"],
  ["latin-ext", "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF"],
  ["latin", "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
].map(([subset, range]) => `@font-face {
  font-family: 'Geologica';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/geologica-${subset}-wght-normal.woff2') format('woff2');
  unicode-range: ${range};
}`).join("\n");

const fontVariables = {
  "--font-sans": "'Geologica', system-ui, sans-serif",
  "--font-manrope": "'Geologica', system-ui, sans-serif",
  "--font-unbounded": "'Geologica', system-ui, sans-serif",
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
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Открытый бассейн Наутилус в Хабаровске" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Плывите под открытым небом",
    description: "50-метровый открытый бассейн в Хабаровске. Вода +28 °C круглый год.",
    images: ["/og.jpg"],
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
      <head><TrackingHeadScripts /><link rel="preload" href="/fonts/geologica-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><style>{geologicaFaces}</style></head>
      <body style={fontVariables}>
        <TrackingNoScript />
        <TrackingEvents />
        {children}
        <MobileActionBar />
        <BookingModal />
        <BrandMotion />
        <CookieNotice />
        <div className="op-scroll-progress" aria-hidden="true" />
      </body>
    </html>
  );
}
