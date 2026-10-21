import { SITE_URL } from "../seo";

// Served as plain text because MetadataRoute.Robots has no Clean-param directive for Yandex.
const CLEAN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid", "fbclid"];

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /__debug",
    "",
    "User-Agent: Yandex",
    "Allow: /",
    "Disallow: /__debug",
    `Clean-param: ${CLEAN_PARAMS.join("&")}`,
    "",
    "User-Agent: GPTBot",
    "User-Agent: ChatGPT-User",
    "User-Agent: OAI-SearchBot",
    "User-Agent: PerplexityBot",
    "User-Agent: ClaudeBot",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
