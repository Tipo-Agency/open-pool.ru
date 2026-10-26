import type { MetadataRoute } from "next";
import { articles, services } from "./data";
import { topicLandings } from "./landing-data";
import { SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pageUpdates: Record<string, string> = { "": "2026-10-18", "/uslugi": "2026-10-18", "/ceny": "2026-10-18", "/raspisanie": "2026-10-05", "/kontakty": "2026-10-07", "/o-basseyne": "2026-10-18", "/galereya": "2026-10-26" };
  const serviceUpdated = new Date("2026-10-10");
  const staticPages = ["", "/uslugi", "/ceny", "/raspisanie", "/kontakty", "/o-basseyne", "/galereya", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "/blog" ? new Date(articles.reduce((latest, item) => (item.modified ?? item.date) > latest ? (item.modified ?? item.date) : latest, "2026-10-13")) : new Date(pageUpdates[path]),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.8 : 0.85,
  }));
  const servicePages = services.map((item) => ({ url: `${SITE_URL}/uslugi/${item.slug}`, lastModified: item.slug === "banya-i-sauna" ? new Date("2026-10-26") : ["abonementy", "razovoe-poseshchenie", "svobodnoe-plavanie"].includes(item.slug) ? new Date("2026-10-18") : ["obuchenie-plavaniyu-vzroslyh", "akvaaerobika"].includes(item.slug) ? new Date("2026-10-13") : serviceUpdated, changeFrequency: "monthly" as const, priority: 0.8 }));
  const landingPages = topicLandings.map((item) => ({ url: `${SITE_URL}${item.path}`, lastModified: new Date("2026-10-26"), changeFrequency: "monthly" as const, priority: 0.85 }));
  const articlePages = articles.map((item) => ({ url: `${SITE_URL}/blog/${item.slug}`, lastModified: new Date(item.modified ?? item.date), changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...staticPages, ...servicePages, ...landingPages, ...articlePages];
}
