type AttributionRecord = Record<string, unknown>;

const value = (record: AttributionRecord, key: string) => String(record[key] || "").trim().toLowerCase();

/** Приводит источники к стабильному справочнику для Calltouch и 1С. */
export function classifyAttribution(record: AttributionRecord) {
  const source = value(record, "utmSource");
  const medium = value(record, "utmMedium");
  const referrer = value(record, "referrer");
  const calltouchTm = value(record, "calltouchTm");
  const sourceType = calltouchTm.match(/(?:^|_)st:([^_]+)/)?.[1] || "";

  if (source === "yandex" && (medium === "cpc" || medium === "ppc")) {
    const isNetwork = /rsya|context|network|сет/.test(sourceType) || /rsya|context|network/.test(calltouchTm);
    return { channel: isNetwork ? "РСЯ" : "Поиск", source: "Яндекс", medium: isNetwork ? "rsya" : "cpc" };
  }
  if (medium === "organic" || medium === "org") {
    if (source.includes("yandex") || source.includes("яндекс")) return { channel: "Органика", source: "Яндекс", medium: "organic" };
    if (source.includes("google") || source.includes("гугл")) return { channel: "Органика", source: "Google", medium: "organic" };
    return { channel: "Органика", source: source || "Неизвестный поисковик", medium: "organic" };
  }
  if (/2gis|дубльгис/.test(source) || /2gis/.test(referrer)) return { channel: "Карты", source: "2ГИС", medium: "maps" };
  if (/yandex.?maps|яндекс.?карты/.test(source) || /yandex\.ru\/maps/.test(referrer)) return { channel: "Карты", source: "Яндекс Карты", medium: "maps" };
  if (/google.?maps|гугл.?карты/.test(source) || /google\.[^/]+\/maps/.test(referrer)) return { channel: "Карты", source: "Google Карты", medium: "maps" };
  if (/instagram|insta|vk|vkontakte|tiktok|telegram|facebook|social|соц/.test(source) || /instagram|vk\.com|t\.me|tiktok/.test(referrer)) {
    const socialSource = /instagram|insta/.test(source + referrer) ? "Instagram"
      : /vk|vkontakte/.test(source + referrer) ? "VK"
        : /telegram|t\.me/.test(source + referrer) ? "Telegram"
          : /tiktok/.test(source + referrer) ? "TikTok" : "Соцсети";
    return { channel: "Соцсети", source: socialSource, medium: "social" };
  }
  if (/app|mobile|прилож/.test(source) || /app|mobile|e-kontur/.test(referrer)) return { channel: "Мобильное приложение", source: "Приложение Наутилус", medium: "app" };
  if (/offline|офлайн|qr|ресепшен|администратор/.test(source + medium + referrer)) return { channel: "Офлайн", source: "Офлайн", medium: "offline" };
  if (source === "direct" || source === "(direct)" || medium === "none" || medium === "(none)" || (!source && !medium && !referrer)) return { channel: "Прямой заход", source: "Прямой заход", medium: "direct" };
  if (medium === "referral" || referrer) return { channel: "Переходы", source: source || "Внешний сайт", medium: "referral" };
  if (medium === "cpc" || medium === "ppc") return { channel: "Платная реклама", source: source || "Неизвестный источник", medium };
  return { channel: "Не определено", source: source || "Не указан", medium: medium || "Не указан" };
}
