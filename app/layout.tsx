import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { BookingModal } from "./booking-modal";
import { SITE_NAME, SITE_URL } from "./seo";
import { TrackingHeadScripts, TrackingNoScript } from "./tracking";
import { TrackingEvents } from "./tracking-events";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
});

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
      <head><TrackingHeadScripts /></head>
      <body className={`${manrope.variable} ${unbounded.variable}`}>
        <TrackingNoScript />
        <TrackingEvents />
        {children}
        <BookingModal />
      </body>
    </html>
  );
}
