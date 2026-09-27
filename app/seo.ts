import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;
export const SITE_URL = (configuredSiteUrl || "https://open-pool.ru").replace(/\/$/, "");
export const SITE_NAME = "Открытый бассейн «Наутилус»";
export const DEFAULT_SOCIAL_IMAGE = "/og.png";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  publishedTime,
  index = true,
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} | Наутилус`;
  const openGraph: Metadata["openGraph"] = type === "article"
    ? { type, locale: "ru_RU", siteName: SITE_NAME, title: socialTitle, description, url: path, publishedTime, images: [{ url: image, alt: title }] }
    : { type, locale: "ru_RU", siteName: SITE_NAME, title: socialTitle, description, url: path, images: [{ url: image, alt: title }] };

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph,
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image] },
  };
}
