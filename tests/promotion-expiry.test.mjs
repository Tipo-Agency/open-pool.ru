import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

test("confirmed offer stays active and a separately dated promotion expires safely", async () => {
  const source = await readFile(new URL("../app/reklama/data.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  const dependency = (path) => path === "../data" ? { images: {} } : {
    visitTariffs: [{ price: "11 900", summary: "595 ₽ за посещение" }], featuredTariff: { price: "23 900" },
  };
  new Function("require", "exports", compiled.outputText)(dependency, exports);
  const current = exports.getAdLanding("30-poseshcheniy", new Date("2026-10-11T12:00:00Z"));
  assert.equal(current.bundle.totalPrice, 14970);
  assert.equal(current.bundle.visitPrice, 499);
  assert.equal(current.promotion, undefined);
  assert.equal(exports.getAdLanding("30-poseshcheniy", new Date("2026-10-20")).bundle.visits, 30);
  exports.adLandings.push({ ...current, slug: "dated-promotion-test", promotion: {
    expiresAt: "2026-10-09T23:59:59+10:00", deadlineLabel: "Тест срока",
  } });
  const active = exports.getAdLanding("dated-promotion-test", new Date("2026-10-09T13:59:59Z"));
  assert.equal(active.price, "499 ₽ за посещение в абонементе");
  const ended = exports.getAdLanding("dated-promotion-test", new Date("2026-10-09T14:00:00Z"));
  assert.match(ended.title, /Акция завершилась/);
  assert.equal(ended.promotion, undefined);
  assert.equal(ended.bundle, undefined);
  assert.doesNotMatch(ended.price, /499/);
  assert.equal(ended.cta, "Узнать актуальные предложения");
  assert.match(ended.goal, /после акции/);
  assert.equal(exports.getAdLanding("abonementy", new Date("2026-10-10"))?.cta, "Хочу 20 посещений");
});
