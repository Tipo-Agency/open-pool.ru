import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// Resolve the extensionless application import for Node's built-in TS loader.
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "../../attribution" && context.parentURL?.endsWith("/api/leads/route.ts")) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { POST } = await import("../app/api/leads/route.ts");
hooks.deregister();

function setup(t, fetch) {
  t.mock.method(globalThis, "fetch", fetch);
  t.mock.method(console, "error", () => {});
  const oldWebhook = process.env.LEADS_WEBHOOK_URL;
  delete process.env.LEADS_WEBHOOK_URL;
  t.after(() => {
    if (oldWebhook === undefined) delete process.env.LEADS_WEBHOOK_URL;
    else process.env.LEADS_WEBHOOK_URL = oldWebhook;
  });
}

function payload(key, overrides = {}) {
  return {
    submissionId: key,
    name: "Тест клиента",
    phone: "+7 (999) 000-00-01",
    formName: "Тестовая форма",
    goal: "30 посещений с баней",
    details: { audience: "Для себя", time: "Вечером" },
    startedAt: Date.now() - 5_000,
    ...overrides,
  };
}

function send(data) {
  return POST(new Request("https://open-pool.ru/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }));
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

test("concurrent identical submissions and later retries create one Calltouch request", async (t) => {
  const gate = deferred();
  const started = deferred();
  let calls = 0;
  setup(t, async () => {
    calls++;
    started.resolve();
    await gate.promise;
    return Response.json({ requestId: "mock-1" });
  });
  const key = "dedupe-concurrent";
  const first = send(payload(key));
  await started.promise;
  const others = Array.from({ length: 7 }, () => send(payload(key, {
    phone: "8 999 000 00 01",
    details: { time: "Вечером", audience: "Для себя" },
  })));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 1);
  gate.resolve();
  const responses = await Promise.all([first, ...others]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.equal((await response.json()).leadId, `pool-${key}`);
  }
  const retry = await send(payload(key));
  assert.equal((await retry.json()).duplicate, true);
  assert.equal(calls, 1);
});

test("the same key rejects changed business fields while pending and after delivery", async (t) => {
  const gate = deferred();
  const started = deferred();
  let calls = 0;
  setup(t, async () => {
    calls++;
    started.resolve();
    await gate.promise;
    return Response.json({ requestId: "mock-2" });
  });
  const key = "dedupe-conflict";
  const first = send(payload(key));
  await started.promise;
  const changes = [
    { name: "Другой клиент" },
    { phone: "+7 (999) 000-00-02" },
    { goal: "90 дней" },
    { formName: "Другая форма" },
    { details: { audience: "Для ребёнка", time: "Вечером" } },
  ];
  for (const change of changes) {
    assert.equal((await send(payload(key, change))).status, 409);
  }
  gate.resolve();
  assert.equal((await first).status, 200);
  for (const change of changes) {
    assert.equal((await send(payload(key, change))).status, 409);
  }
  assert.equal(calls, 1);
});

test("explicit Calltouch failure allows an identical retry but keeps the key bound to its payload", async (t) => {
  let calls = 0;
  setup(t, async () => {
    calls++;
    return calls === 1
      ? Response.json({ error: "unavailable" }, { status: 503 })
      : Response.json({ requestId: "mock-retry" });
  });
  const key = "dedupe-retry";
  assert.equal((await send(payload(key))).status, 502);
  assert.equal((await send(payload(key, { name: "Другой клиент" }))).status, 409);
  assert.equal((await send(payload(key))).status, 200);
  assert.equal((await send(payload(key))).status, 200);
  assert.equal(calls, 2);
});

test("a rejected fetch releases the in-flight slot for retry", async (t) => {
  let calls = 0;
  setup(t, async () => {
    calls++;
    if (calls === 1) throw new Error("mock network failure");
    return Response.json({ requestId: "mock-network-retry" });
  });
  const key = "dedupe-network-retry";
  assert.equal((await send(payload(key))).status, 502);
  assert.equal((await send(payload(key))).status, 200);
  assert.equal(calls, 2);
});

test("secondary webhook failure does not repeat a confirmed Calltouch delivery", async (t) => {
  let calltouchCalls = 0;
  let webhookCalls = 0;
  setup(t, async (url) => {
    if (url === "https://mock.invalid/webhook") {
      webhookCalls++;
      return new Response("failed", { status: 500 });
    }
    calltouchCalls++;
    return Response.json({ requestId: "mock-with-webhook" });
  });
  process.env.LEADS_WEBHOOK_URL = "https://mock.invalid/webhook";
  const key = "dedupe-webhook";
  assert.equal((await send(payload(key))).status, 200);
  assert.equal((await send(payload(key))).status, 200);
  assert.equal(calltouchCalls, 1);
  assert.equal(webhookCalls, 1);
});

test("different submission keys remain separate deliveries", async (t) => {
  let calls = 0;
  setup(t, async () => {
    calls++;
    return Response.json({ requestId: `mock-independent-${calls}` });
  });
  const responses = await Promise.all([
    send(payload("dedupe-independent-1")),
    send(payload("dedupe-independent-2")),
  ]);
  assert.ok(responses.every((response) => response.status === 200));
  assert.equal(calls, 2);
});
