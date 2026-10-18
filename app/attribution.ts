type AttributionRecord = Record<string, unknown>;
const value = (record: AttributionRecord, key: string) => String(record[key] || "").trim().toLowerCase();

/** Сохраняет явную рекламную разметку; поисковый источник выводит только из известного домена. */
export function classifyAttribution(record: AttributionRecord) {
  const source = value(record, "utmSource");
  const medium = value(record, "utmMedium");
  const referrer = value(record, "referrer");
  const calltouchTm = value(record, "calltouchTm");
  const sourceType = calltouchTm.match(/(?:^|_)st:([^_]+)/)?.[1] || "";
  let ref: URL | undefined;
  try { ref = new URL(referrer); } catch { /* No valid referrer. */ }
  const host = ref?.hostname || "";
  const domain = (name: string) => host === name || host.endsWith(`.${name}`);
  const yandex = ["yandex.ru", "yandex.com", "yandex.kz", "yandex.by", "yandex.uz", "ya.ru"].some(domain);
  const google = /^([a-z0-9-]+\.)*google\.(com|ru|kz|uz|by|co\.uk|de|fr|com\.tr)$/.test(host);
  const paid = ["cpc", "ppc", "paid", "paidsearch", "paid_search", "display", "cpm", "paid_social"].includes(medium);
  const yandexPaid = (source === "yandex" && paid) || (!source && !medium && Boolean(value(record, "yclid")));
  if (yandexPaid) {
    const isNetwork = /rsya|context|network|сет/.test(sourceType) || /rsya|context|network/.test(calltouchTm);
    // A click ID alone does not distinguish Search from the ad network.
    const channel = isNetwork ? "РСЯ" : sourceType === "search" || (source === "yandex" && ["cpc", "ppc"].includes(medium)) ? "Поиск" : "Платная реклама";
    return { channel, source: "Яндекс", medium: isNetwork ? "rsya" : medium || "cpc" };
  }
  if (paid || (!source && !medium && value(record, "gclid"))) {
    return { channel: "Платная реклама", source: source || (value(record, "gclid") ? "Google" : "Неизвестный источник"), medium: medium || "cpc" };
  }
  if (medium === "organic" || medium === "org") {
    return { channel: "Органика", source: /yandex|яндекс/.test(source) ? "Яндекс" : /google|гугл/.test(source) ? "Google" : source || "Неизвестный поисковик", medium: "organic" };
  }
  // Use a referrer only when explicit campaign attribution is absent.
  if (/2gis|дубльгис/.test(source) || (!source && !medium && ["2gis.ru", "2gis.com"].some(domain))) return { channel: "Карты", source: "2ГИС", medium: "maps" };
  if (/yandex.?maps|яндекс.?карты/.test(source) || (!source && !medium && yandex && ref?.pathname.startsWith("/maps"))) return { channel: "Карты", source: "Яндекс Карты", medium: "maps" };
  if (/google.?maps|гугл.?карты/.test(source) || (!source && !medium && google && (ref?.pathname.startsWith("/maps") || host.startsWith("maps.")))) return { channel: "Карты", source: "Google Карты", medium: "maps" };
  if (!source && !medium && (yandex || google)) return { channel: "Органика", source: yandex ? "Яндекс" : "Google", medium: "organic" };
  const social = /instagram|insta|vk|vkontakte|tiktok|telegram|facebook|social|соц/.test(source);
  const socialRef = !source && !medium && ["instagram.com", "vk.com", "t.me", "tiktok.com", "facebook.com"].some(domain);
  if (social || socialRef) {
    const hint = source || host;
    const socialSource = /instagram|insta/.test(hint) ? "Instagram" : /vk|vkontakte/.test(hint) ? "VK" : /telegram|t\.me/.test(hint) ? "Telegram" : /tiktok/.test(hint) ? "TikTok" : /facebook/.test(hint) ? "Facebook" : "Соцсети";
    return { channel: "Соцсети", source: socialSource, medium: "social" };
  }
  if (/^(app|mobile|foxfit)$|прилож/.test(source)) return { channel: "Мобильное приложение", source: "Приложение Наутилус", medium: "app" };
  if (/offline|офлайн|^qr$|ресепшен|администратор/.test(source) || medium === "offline") return { channel: "Офлайн", source: "Офлайн", medium: "offline" };
  if (source === "direct" || source === "(direct)" || medium === "none" || medium === "(none)" || (!source && !medium && (!referrer || domain("open-pool.ru")))) return { channel: "Прямой заход", source: "Прямой заход", medium: "direct" };
  if (medium === "referral" || (!source && !medium && ref)) return { channel: "Переходы", source: source || host || "Внешний сайт", medium: "referral" };
  return { channel: "Не определено", source: source || "Не указан", medium: medium || "Не указан" };
}
