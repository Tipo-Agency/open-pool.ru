import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished pool homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<title>Открытый бассейн в Хабаровске \| Наутилус<\/title>/i);
  assert.match(html, /50 метров/);
  assert.match(html, /Подобрать абонемент/);
  assert.match(html, /Найдём ваш формат плавания/);
  assert.match(html, /Для кого выбираем плавание/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /SportsActivityLocation/);
  assert.match(html, /<meta property="og:image" content="https:\/\/open-pool\.ru\/og\.png"/);
  assert.match(html, /\/logo-nautilus\.svg/);
  assert.doesNotMatch(html, /brand-mark/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("schedule page stays useful when the 1C feed is not configured", async () => {
  const response = await render("/raspisanie");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Занятия в бассейне/);
  assert.match(html, /Расписание занятий сейчас не загружается/);
  assert.match(html, /Будни:/);
  assert.doesNotMatch(html, /schedule-live|Свободных мест:/);
});

test("renders commercial and article routes with unique SEO metadata", async () => {
  const serviceResponse = await render("/uslugi/abonementy");
  const articleResponse = await render("/blog/kak-nachat-plavat-vzroslomu");
  assert.equal(serviceResponse.status, 200);
  assert.equal(articleResponse.status, 200);
  const serviceHtml = await serviceResponse.text();
  const articleHtml = await articleResponse.text();
  assert.match(serviceHtml, /<title>Абонементы в открытый бассейн в Хабаровске \| Наутилус<\/title>/i);
  assert.match(serviceHtml, /https:\/\/schema\.org.*Service/);
  assert.match(articleHtml, /Как взрослому начать плавать с нуля в Хабаровске/);
  assert.match(articleHtml, /https:\/\/schema\.org.*Article/);
  assert.match(articleHtml, /Частые вопросы/);
  assert.match(articleHtml, /rel="canonical" href="https:\/\/open-pool\.ru\/blog\/kak-nachat-plavat-vzroslomu"/);
  assert.match(articleHtml, /BreadcrumbList/);
  assert.match(articleHtml, /Подходящие форматы плавания/);
  assert.match(articleHtml, /Занятия в Хабаровске/);
  assert.match(articleHtml, /article_service_click|Посмотреть условия/);
});

test("publishes crawl directives and sitemap for the live domain", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);
  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);
  const [robots, sitemap] = await Promise.all([robotsResponse.text(), sitemapResponse.text()]);
  assert.match(robots, /Sitemap: https:\/\/open-pool\.ru\/sitemap\.xml/);
  assert.match(robots, /OAI-SearchBot/);
  assert.match(sitemap, /<loc>https:\/\/open-pool\.ru<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/open-pool\.ru\/blog\/reabilitaciya-posle-pereloma-nogi-basseyn<\/loc>/);
  assert.doesNotMatch(`${robots}\n${sitemap}`, /chatgpt\.site|pool\.tipa\.uz/);
});

test("removes the disposable starter preview", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("renders conversion modal, app links, map and rehabilitation content", async () => {
  const [homeResponse, articleResponse, blogResponse] = await Promise.all([
    render("/"),
    render("/blog/reabilitaciya-posle-pereloma-nogi-basseyn"),
    render("/blog"),
  ]);
  const [homeHtml, articleHtml, blogHtml] = await Promise.all([
    homeResponse.text(), articleResponse.text(), blogResponse.text(),
  ]);
  assert.match(homeHtml, /id="booking"/);
  assert.match(homeHtml, /apps\.apple\.com\/ru\/app/);
  assert.match(homeHtml, /yandex\.ru\/map-widget\/v1/);
  assert.match(articleHtml, /Бассейн после перелома ноги/);
  assert.match(articleHtml, /rehabilitation-pool\.jpg/);
  assert.match(blogHtml, /66(?:<!-- -->)? материалов/);
  const articleImages = [...blogHtml.matchAll(/<img src="([^"]*\/articles\/[^"]+\.jpg)"/g)].map((match) => match[1]);
  assert.equal(articleImages.length, 40);
  assert.equal(new Set(articleImages).size, 40);
});

test("renders complete legal documents from the official publication", async () => {
  const [privacyResponse, offerResponse, rulesResponse] = await Promise.all([
    render("/politika-konfidencialnosti"),
    render("/publichnaya-oferta"),
    render("/pravila-poseshcheniya"),
  ]);
  assert.equal(privacyResponse.status, 200);
  assert.equal(offerResponse.status, 200);
  assert.equal(rulesResponse.status, 200);
  const [privacyHtml, offerHtml, rulesHtml] = await Promise.all([
    privacyResponse.text(), offerResponse.text(), rulesResponse.text(),
  ]);
  assert.match(privacyHtml, /Соглашение на обработку персональных данных/);
  assert.match(privacyHtml, /support@e-kontur\.ru/);
  assert.match(offerHtml, /ПУБЛИЧНАЯ ОФЕРТА О ЗАКЛЮЧЕНИИ ДОГОВОРА/);
  assert.match(offerHtml, /ООО «Спортинвест»/);
  assert.match(rulesHtml, /ТРЕБОВАНИЯ БЕЗОПАСНОСТИ ПЕРЕД ПОСЕЩЕНИЕМ БАССЕЙНА/);
  assert.match(rulesHtml, /Принять душ, одеться, просушить волосы под феном/);
});

test("pins the three legal documents to the verified source snapshots", async () => {
  const source = await readFile(new URL("../app/legal-data.ts", import.meta.url), "utf8");
  const contents = [...source.matchAll(/content:\s*("(?:\\.|[^"\\])*")/gs)].map((match) => JSON.parse(match[1]));
  assert.equal(contents.length, 3);
  assert.deepEqual(contents.map((content) => content.length), [13571, 7130, 4182]);
  assert.deepEqual(contents.map((content) => createHash("sha256").update(content).digest("hex")), [
    "838153a7ed92da61d96b17bc639cdb0b540f46c131dc66a805f00d9c112b2e6f",
    "f6a4ea4f885d79797732843a02384616bc897e8b53688cf2ed3c9c866cff8f21",
    "0bf812ae971da0a59a9eb432f0ff241a2475b1cf4fdf25efe5c989560326f367",
  ]);
});

test("renders focused paid-search landing pages with noindex and contextual forms", async () => {
  const paths = [
    "/reklama/otkrytyy-basseyn",
    "/reklama/razovoe-poseshchenie",
    "/reklama/abonementy",
    "/reklama/akvaaerobika",
    "/reklama/plavanie-dlya-detey",
    "/reklama/obuchenie-plavaniyu-vzroslyh",
  ];
  for (const path of paths) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /name="robots" content="noindex, follow/);
    assert.match(html, /name="goal"/);
    assert.match(html, /name="consent"/);
    assert.match(html, /Советская улица, 1 к4/);
    assert.match(html, /FAQPage/);
  }
});

test("renders current pool tariffs and the 20 visit paid-search offer", async () => {
  const [pricesResponse, landingResponse] = await Promise.all([
    render("/ceny"),
    render("/reklama/abonementy"),
  ]);
  assert.equal(pricesResponse.status, 200);
  assert.equal(landingResponse.status, 200);
  const [pricesHtml, landingHtml] = await Promise.all([pricesResponse.text(), landingResponse.text()]);
  assert.match(pricesHtml, /23 900/);
  assert.match(pricesHtml, /7 967 ₽/);
  assert.match(pricesHtml, /20 дней заморозки/);
  assert.match(pricesHtml, /65 000/);
  assert.match(pricesHtml, /OfferCatalog/);
  assert.match(landingHtml, /20 посещений бассейна за 11 900 ₽/);
  assert.match(landingHtml, /595 ₽ за посещение при покупке абонемента/);
  assert.match(landingHtml, /Хочу 20 посещений/);
  assert.match(landingHtml, /class="button button-lime pool-mobile-cta" href="#pool-lead-form"/);
  assert.match(landingHtml, /id="pool-lead-form"/);
  assert.match(landingHtml, /Срок действия 60 дней, без заморозки/);
  assert.match(landingHtml, /Сауна, пляж и парковка не включены/);
  assert.match(landingHtml, /name="goal"[^>]*value="абонемент на 20 посещений за 11 900 ₽"/);
  assert.doesNotMatch(landingHtml, /Зафиксировать тариф|21 500/);
});

test("renders the new promotion with full price and a distinct lead form", async () => {
  const response = await render("/reklama/30-poseshcheniy");
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<!--.*?-->/g, "");
  assert.match(html, /30 посещений бассейна\. Баня в подарок/);
  assert.match(html, /Полная оплата абонемента: 14 970 ₽/);
  assert.match(html, /499 ₽ за посещение в абонементе/);
  assert.match(html, /Срок действия 90 дней, сеанс 70 минут/);
  assert.match(html, /Реклама: акция 30 посещений \+ баня/);
  assert.match(html, /Парковка не включена/);
  assert.match(html, /name="robots" content="noindex, follow/);
  assert.doesNotMatch(html, /20 посещений бассейна за 11 900/);
});

test("September tariffs separate included amenities and publish accurate offer prices", async () => {
  const response = await render("/ceny");
  const html = (await response.text()).replace(/<!--.*?-->/g, "");
  assert.match(html, /16 сентября 2026 года/);
  const cards = [...html.matchAll(/<article class="price-card[\s\S]*?<\/article>/g)].map(([card]) => card);
  const card = (name) => {
    const found = cards.find((item) => item.includes(`<h3>${name}</h3>`));
    assert.ok(found, `Missing tariff ${name}`);
    return found;
  };
  assert.equal(cards.length, 8);
  assert.match(card("20 посещений"), /11 900/);
  assert.match(card("20 посещений"), /595 ₽ за посещение/);
  assert.match(card("20 посещений"), /Сауна, пляж и парковка не включены/);
  assert.match(card("30 дней"), /10 900/);
  assert.match(card("30 дней"), /<s>12 900 ₽<\/s>/);
  assert.match(card("30 дней"), /Сауна и пляж в подарок/);
  assert.match(card("30 дней"), /Парковка не включена/);
  for (const name of ["90 дней", "180 дней", "365 дней"]) {
    assert.match(card(name), /Сауна, пляж и парковка включены/);
  }
  assert.match(card("180 дней"), /35 900/);
  assert.match(card("Семейный: 30 посещений"), /16 500/);
  assert.match(card("Семейный: 120 дней"), /29 900/);
  assert.match(card("50 посещений на 365 дней"), /Сеанс 100 минут/);
  assert.match(card("50 посещений на 365 дней"), /598 ₽ за посещение/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const offers = schemas.find((schema) => schema["@type"] === "OfferCatalog").itemListElement;
  assert.deepEqual(offers.map((offer) => offer.price), ["10900", "23900", "35900", "65000", "11900", "16500", "29900", "29900"]);
  for (const path of ["/", "/ceny", "/uslugi/abonementy", "/uslugi/razovoe-poseshchenie", "/reklama/abonementy", "/reklama/razovoe-poseshchenie"]) {
    const page = await render(path);
    assert.equal(page.status, 200);
    const text = (await page.text()).replace(/<!--.*?-->/g, "");
    assert.doesNotMatch(text, /21 500|7 167|67 900|5 659|38 800|13 400|31 390|33 000/);
    assert.match(text, /[Пп]арковка.*(?:не включена|только в безлимитные)/);
  }
});

test("uses reliable document navigation without the broken client Link runtime", async () => {
  const [components, page, prices] = await Promise.all([
    readFile(new URL("../app/components.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ceny/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(`${components}\n${page}\n${prices}`, /from ["']next\/link["']/);
  assert.match(components, /href="\/publichnaya-oferta"/);
  assert.match(components, /href="\/pravila-poseshcheniya"/);
});

test("renders Calltouch tracking and validates lead requests before delivery", async () => {
  const homeResponse = await render("/");
  const html = await homeResponse.text();
  assert.match(html, /mod\.calltouch\.ru\/init-min\.js/);
  assert.match(html, /yykb6p7o/);
  assert.match(html, /mc\.yandex\.ru\/metrika\/tag\.js/);
  assert.match(html, /name="consent"/);
  assert.match(html, /Отправить заявку/);

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("lead-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const invalidResponse = await worker.fetch(
    new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "А", phone: "123", formName: "test", startedAt: Date.now() - 1000 }),
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(await invalidResponse.json(), { ok: false, message: "Проверьте имя и телефон" });

  let postedBody = "";
  const calltouchMock = createServer((request, response) => {
    request.setEncoding("utf8");
    request.on("data", (chunk) => { postedBody += chunk; });
    request.on("end", () => {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ requestId: 987654 }));
    });
  });
  await new Promise((resolve) => calltouchMock.listen(0, "127.0.0.1", resolve));
  const address = calltouchMock.address();
  assert.ok(address && typeof address === "object");
  process.env.CALLTOUCH_API_BASE_URL = `http://127.0.0.1:${address.port}`;
  try {
    const validResponse = await worker.fetch(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Тестовый клиент",
          phone: "+7 999 000-00-00",
          formName: "Тест формы",
          startedAt: Date.now() - 1000,
          calltouch: { sessionId: 2326581504 },
          attribution: { pageUrl: "https://example.test/?utm_source=yandex", utmSource: "yandex", yclid: "test-click" },
        }),
      }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(validResponse.status, 200);
    assert.equal((await validResponse.json()).ok, true);
  } finally {
    delete process.env.CALLTOUCH_API_BASE_URL;
    await new Promise((resolve, reject) => calltouchMock.close((error) => error ? reject(error) : resolve()));
  }
  const sent = new URLSearchParams(postedBody);
  assert.equal(sent.get("sessionId"), "2326581504");
  assert.equal(sent.get("phoneNumber"), "79990000000");
  assert.match(sent.get("comment") || "", /utm_source: yandex/);
  assert.match(sent.get("comment") || "", /yclid: test-click/);
});
