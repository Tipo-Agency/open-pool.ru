import type { MetadataRoute } from "next";
import { articles, services } from "./data";
import { SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = new Date("2026-08-29");
  const staticPages = ["", "/uslugi", "/ceny", "/raspisanie", "/kontakty", "/o-basseyne", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: contentUpdated,
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.85,
  }));
  const servicePages = services.map((item) => ({ url: `${SITE_URL}/uslugi/${item.slug}`, lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.8 }));
  const articlePages = articles.map((item) => ({ url: `${SITE_URL}/blog/${item.slug}`, lastModified: new Date(item.date), changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...staticPages, ...servicePages, ...articlePages];
}
