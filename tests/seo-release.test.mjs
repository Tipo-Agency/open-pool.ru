import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = (path) => worker.fetch(new Request(`https://open-pool.ru${path}`), env, ctx);
const revised = JSON.parse(await readFile(new URL("../app/editorial-content.json", import.meta.url), "utf8"));
const growth = JSON.parse(await readFile(new URL("../app/local-growth-content.json", import.meta.url), "utf8"));
test("63 editorial pages render full content, one H1, canonical and real modification dates", async () => {
  assert.equal(revised.length, 63);
  assert.equal(new Set(revised.map(a => a.slug)).size,63);
  for (const article of revised) {
    const res = await render(`/blog/${article.slug}`);
    assert.equal(res.status,200,article.slug);
    const body = await res.text();
    assert.equal((body.match(/<h1[ >]/g)||[]).length,1,article.slug);
    assert.ok(body.includes(`rel="canonical" href="https://open-pool.ru/blog/${article.slug}"`),article.slug);
    if (article.diagram) assert.ok(body.includes(article.diagram),article.slug);
    assert.ok(body.includes(`dateModified":"${article.modified}`),article.slug);
    assert.ok(body.includes(article.cta),article.slug);
    assert.doesNotMatch(body,/name="robots" content="noindex/);
    assert.doesNotMatch(body,/ARTICLE:|END:|UNVERIFIED|НЕПРОВЕРЕННЫЕ ФАКТЫ/);
    for (const match of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  }
});
test("sitemap includes existing and new local articles and preserves historical publication dates", async () => {
  const xml = await (await render('/sitemap.xml')).text();
  assert.equal((xml.match(/<loc>/g)||[]).length,82 + growth.length);
  for (const a of revised) assert.ok(xml.includes(`/blog/${a.slug}</loc>`));
  const page = await (await render('/blog/chto-vzyat-v-basseyn')).text();
  assert.match(page,/datePublished":"2026-08-18/);
  assert.match(page,/dateModified":"2026-10-21/);
});
test("new guides are linked, indexable and lead to the fully disclosed membership offer", async () => {
  const journal = await (await render('/blog')).text();
  const xml = await (await render('/sitemap.xml')).text();
  for (const article of growth) {
    const path = `/blog/${article.slug}`;
    assert.ok(journal.includes(`href="${path}"`), path);
    assert.ok(xml.includes(`${path}</loc>`), path);
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, path);
    assert.ok(html.includes(`rel="canonical" href="https://open-pool.ru${path}"`), path);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    if (article.cta !== '/uslugi/abonementy' || article.date !== '2026-10-18') continue;
    // Membership guides must disclose the full offer terms.
    assert.match(html, /href="\/uslugi\/abonementy"/);
    assert.match(html, /14 970/);
    assert.match(html, /Парковка не включена|парковка не включена/);
  }
});
test("legacy URLs redirect to exact equivalents while unknown URLs stay 404", async () => {
  for (const [old,next] of [['/contacts','/kontakty'],['/schedule','/raspisanie'],['/services','/uslugi'],['/sevices','/uslugi'],['/sale','/ceny'],['/publichnaya-oferta/page','/publichnaya-oferta']]) {
    const res=await render(old+'?utm_source=test');
    assert.equal(res.status,301);assert.equal(res.headers.get('location'),'https://open-pool.ru'+next+'?utm_source=test');
  }
  assert.equal((await render('/blog/not-a-real-article')).status,404);
});
test("topic landings and banya service are indexable and in the sitemap", async () => {
  const xml = await (await render('/sitemap.xml')).text();
  for (const path of ['/uslugi/banya-i-sauna', '/basseyn-50-metrov-habarovsk', '/otkrytyy-basseyn-zimoy']) {
    assert.ok(xml.includes(`${path}</loc>`), path);
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, path);
    assert.ok(html.includes(`rel="canonical" href="https://open-pool.ru${path}"`), path);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    assert.match(html, /data-form-name/);
  }
});
