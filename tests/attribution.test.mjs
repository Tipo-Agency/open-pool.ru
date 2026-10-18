import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAttribution } from '../app/attribution.ts';

test('recognizes untagged search visits and keeps maps separate', () => {
  assert.deepEqual(classifyAttribution({referrer:'https://www.google.com/search?q=pool'}), {channel:'Органика',source:'Google',medium:'organic'});
  assert.equal(classifyAttribution({referrer:'https://yandex.ru/search/?text=pool'}).source, 'Яндекс');
  assert.equal(classifyAttribution({referrer:'https://yandex.ru/maps/76/'}).channel, 'Карты');
  assert.equal(classifyAttribution({referrer:'https://maps.google.com/'}).channel, 'Карты');
});
test('campaign evidence wins over the referrer', () => {
  assert.equal(classifyAttribution({utmSource:'google',utmMedium:'cpc',referrer:'https://google.com/'}).channel,'Платная реклама');
  assert.equal(classifyAttribution({utmSource:'yandex',utmMedium:'cpc',calltouchTm:'st:context'}).channel,'РСЯ');
  assert.equal(classifyAttribution({yclid:'123',referrer:'https://yandex.ru/'}).channel,'Платная реклама');
  assert.equal(classifyAttribution({utmSource:'newsletter',utmMedium:'email',referrer:'https://google.com/'}).source,'newsletter');
});
test('does not infer sources from misleading domains or own navigation', () => {
  assert.equal(classifyAttribution({referrer:'https://google.com.example.org/'}).channel,'Переходы');
  assert.equal(classifyAttribution({referrer:'https://happy.example.org/'}).channel,'Переходы');
  assert.equal(classifyAttribution({referrer:'https://open-pool.ru/ceny'}).channel,'Прямой заход');
});
