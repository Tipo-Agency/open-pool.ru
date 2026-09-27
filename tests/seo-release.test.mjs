import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = (path) => worker.fetch(new Request(`https://open-pool.ru${path}`), env, ctx);
const revised = JSON.parse(await readFile(new URL("../app/editorial-content.json", import.meta.url), "utf8"));
test("53 editorial pages render full content, one H1, canonical and real modification dates", async () => {
  assert.equal(revised.length, 53);
  assert.equal(new Set(revised.map(a => a.slug)).size,53);
  for (const article of revised) {
    const res = await render(`/blog/${article.slug}`);
    assert.equal(res.status,200,article.slug);
    const body = await res.text();
    assert.equal((body.match(/<h1[ >]/g)||[]).length,1,article.slug);
    assert.ok(body.includes(`rel="canonical" href="https://open-pool.ru/blog/${article.slug}"`),article.slug);
    assert.ok(body.includes(article.diagram),article.slug);
    assert.ok(body.includes(`dateModified":"${article.modified}`),article.slug);
    assert.ok(body.includes(article.cta),article.slug);
    assert.doesNotMatch(body,/name="robots" content="noindex/);
    assert.doesNotMatch(body,/ARTICLE:|END:|UNVERIFIED|НЕПРОВЕРЕННЫЕ ФАКТЫ/);
    for (const match of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  }
});
test("sitemap includes all 66 articles and preserves historical publication dates", async () => {
  const xml = await (await render('/sitemap.xml')).text();
  assert.equal((xml.match(/<loc>/g)||[]).length,79);
  for (const a of revised) assert.ok(xml.includes(`/blog/${a.slug}</loc>`));
  const page = await (await render('/blog/chto-vzyat-v-basseyn')).text();
  assert.match(page,/datePublished":"2026-08-18/);
  assert.match(page,/dateModified":"2026-09-23/);
});
test("legacy URLs redirect to exact equivalents while unknown URLs stay 404", async () => {
  for (const [old,next] of [['/contacts','/kontakty'],['/schedule','/raspisanie'],['/services','/uslugi']]) {
    const res=await render(old+'?utm_source=test');
    assert.equal(res.status,301);assert.equal(res.headers.get('location'),'https://open-pool.ru'+next+'?utm_source=test');
  }
  assert.equal((await render('/blog/not-a-real-article')).status,404);
});
