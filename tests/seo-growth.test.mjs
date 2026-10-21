import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
const { default: worker } = await import('../dist/server/index.js');
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = path => worker.fetch(new Request(`https://open-pool.ru${path}`), env, ctx);
test('journal navigation reaches all articles and its category anchors exist', async () => {
  const html = await (await render('/blog')).text();
  const links = [...new Set([...html.matchAll(/href="(\/blog\/[^"?#]+)"/g)].map(m=>m[1]))];
  const growth = JSON.parse(await readFile(new URL('../app/local-growth-content.json', import.meta.url), 'utf8'));
  assert.equal(links.length,66 + growth.length);
  for (const [,id] of html.matchAll(/href="#(topic-\d+)"/g)) assert.ok(html.includes(`id="${id}"`));
  for (const [,src] of html.matchAll(/src="(\/photos\/[^"?]+)"/g)) await access(new URL(`../public${src}`,import.meta.url));
  assert.doesNotMatch(html, /src="https:\/\/static.tildacdn.com/);
  assert.match(html,/srcSet="[^"]+\.webp/);
});
test('calorie search answer, readable table and next-step pages render together', async () => {
  const html = await (await render('/blog/skolko-kaloriy-szhigaet-plavanie')).text();
  assert.match(html, /Ккал за 60 минут/);
  assert.match(html, /около 406/);
  assert.match(html, /href="\/blog\/stili-plavaniya"/);
  assert.match(html, /href="\/blog\/pitaniya-do-i-posle-basseyna"/);
  assert.match(html, /href="\/uslugi\/svobodnoe-plavanie"/);
  assert.match(html, /Ккал за 45 минут/);
  assert.match(html, /около 305/);
  assert.match(html, /href="\/blog\/plavanie-dlya-pohudeniya"/);
  assert.match(html, /dateModified":"2026-10-21/);
});
test('october 21 articles render with one H1, self-canonical and Article JSON-LD', async () => {
  const growth = JSON.parse(await readFile(new URL('../app/local-growth-content.json', import.meta.url), 'utf8'));
  const fresh = growth.filter(article => article.date === '2026-10-21');
  assert.equal(fresh.length, 14);
  for (const article of fresh) {
    const response = await render(`/blog/${article.slug}`);
    assert.equal(response.status, 200, article.slug);
    const html = await response.text();
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, article.slug);
    assert.match(html, new RegExp(`rel="canonical" href="https://open-pool\\.ru/blog/${article.slug}"`), article.slug);
    assert.match(html, /"@type":"Article"/, article.slug);
  }
});
test('robots.txt keeps the sitemap, drops Host and cleans tracking parameters for Yandex', async () => {
  const robots = await (await render('/robots.txt')).text();
  assert.match(robots, /User-Agent: Yandex[\s\S]*Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid/);
  assert.match(robots, /Disallow: \/__debug/);
  assert.match(robots, /Sitemap: https:\/\/open-pool\.ru\/sitemap\.xml/);
  assert.doesNotMatch(robots, /^Host:/m);
});
