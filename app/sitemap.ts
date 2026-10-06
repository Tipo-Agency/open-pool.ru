import type { MetadataRoute } from "next";
import { articles, services } from "./data";
import { SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pageUpdates: Record<string, string> = { "": "2026-10-07", "/uslugi": "2026-10-07", "/ceny": "2026-10-05", "/raspisanie": "2026-10-05", "/kontakty": "2026-10-07", "/o-basseyne": "2026-10-07" };
  const serviceUpdated = new Date("2026-10-07");
  const staticPages = ["", "/uslugi", "/ceny", "/raspisanie", "/kontakty", "/o-basseyne", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "/blog" ? new Date(articles.reduce((latest, item) => (item.modified ?? item.date) > latest ? (item.modified ?? item.date) : latest, "2026-08-29")) : new Date(pageUpdates[path]),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.85,
  }));
  const servicePages = services.map((item) => ({ url: `${SITE_URL}/uslugi/${item.slug}`, lastModified: serviceUpdated, changeFrequency: "monthly" as const, priority: 0.8 }));
  const articlePages = articles.map((item) => ({ url: `${SITE_URL}/blog/${item.slug}`, lastModified: new Date(item.modified ?? item.date), changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...staticPages, ...servicePages, ...articlePages];
}
