import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
const { default: worker } = await import('../dist/server/index.js');
const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const render = path => worker.fetch(new Request(`https://open-pool.ru${path}`), env, ctx);
test('journal navigation reaches all articles and its category anchors exist', async () => {
  const html = await (await render('/blog')).text();
  const links = [...new Set([...html.matchAll(/href="(\/blog\/[^"?#]+)"/g)].map(m=>m[1]))];
  assert.equal(links.length,66);
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
  assert.match(html, /dateModified":"2026-10-13/);
});
