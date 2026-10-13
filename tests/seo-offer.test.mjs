import assert from "node:assert/strict";
import test from "node:test";

const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = async (path) => {
  const response = await worker.fetch(new Request(`https://open-pool.ru${path}`), env, ctx);
  assert.equal(response.status, 200, path);
  return response.text();
};

test("organic tariff pages disclose the complete package price and conditions", async () => {
  for (const path of ["/ceny", "/uslugi/abonementy"]) {
    const html = await render(path);
    const card = html.match(/<section[^>]*id="pool-sauna-offer"[\s\S]*?<\/section>/)?.[0];
    assert.ok(card, `${path}: offer is visible in server HTML`);
    const text = card.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
    for (const term of ["30 посещений", "14 970 ₽", "полная стоимость абонемента", "90 дней", "Сеанс 70 минут", "Баня в подарок", "Парковка не включена", "полном использовании", "1 500 ₽"]) {
      assert.ok(text.includes(term), `${path}: ${term}`);
    }
    const offer = [...card.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1])).find(schema => schema["@type"] === "Offer");
    assert.equal(offer.price, "14970", `${path}: schema uses total payable price`);
    assert.equal(offer.priceCurrency, "RUB");
    assert.equal(offer.priceValidUntil, undefined, "no invented deadline");
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    assert.equal((html.match(/id="pool-sauna-offer"/g) || []).length, 1);
  }
});

test("paid landing preserves noindex and the same confirmed package", async () => {
  const html = await render("/reklama/30-poseshcheniy");
  assert.match(html, /name="robots" content="noindex/);
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  for (const term of ["14 970", "30 посещений", "90 дней", "70 минут", "499"]) assert.ok(text.includes(term), term);
  assert.doesNotMatch(text, /Акция завершилась|до пятницы|до 9 октября/i);
});
