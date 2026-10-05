import assert from "node:assert/strict";
import test from "node:test";
import { getPublicSchedule, normalizePublicSchedule } from "../app/fitness1c-schedule.ts";

test("maps only public fields from the 1C schedule response", () => {
  const items = normalizePublicSchedule({ result: true, data: [
    { appointment_id: "a1", service_name: "Аквааэробика", start_date: "2026-10-06 09:00", end_date: "2026-10-06 09:45", trainer_name: "Анна", room_name: "Бассейн", client_phone: "PRIVATE" },
  ] });
  assert.deepEqual(items, [{
    id: "a1", title: "Аквааэробика", date: "2026-10-06", startTime: "09:00",
    endTime: "09:45", trainer: "Анна", room: "Бассейн",
  }]);
  assert.doesNotMatch(JSON.stringify(items), /PRIVATE/);
});

test("treats an unfamiliar nonempty response as unavailable", () => {
  assert.equal(normalizePublicSchedule({ result: true, data: [{ unknown: "value" }] }), null);
  assert.equal(normalizePublicSchedule({ result: true, data: [{ title: "Группа", start_date: "2026-10-06 09:00" }, { unknown: "value" }] }), null);
  assert.deepEqual(normalizePublicSchedule({ result: true, data: [] }), []);
});

test("does not send the terminal identifier to an unencrypted endpoint", async () => {
  const originalUrl = process.env.FITNESS1C_SCHEDULE_URL;
  const originalTerminal = process.env.FITNESS1C_TERMINAL_ID;
  process.env.FITNESS1C_SCHEDULE_URL = "http://fitness.example.test/FitnesOpb/hs/api/v2/schedule/";
  process.env.FITNESS1C_TERMINAL_ID = "terminal-test";
  try {
    assert.deepEqual(await getPublicSchedule(), { status: "unavailable", items: [] });
  } finally {
    if (originalUrl === undefined) delete process.env.FITNESS1C_SCHEDULE_URL;
    else process.env.FITNESS1C_SCHEDULE_URL = originalUrl;
    if (originalTerminal === undefined) delete process.env.FITNESS1C_TERMINAL_ID;
    else process.env.FITNESS1C_TERMINAL_ID = originalTerminal;
  }
});

test("requests one week of public sessions on the server with the terminal header", async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.FITNESS1C_SCHEDULE_URL;
  const originalTerminal = process.env.FITNESS1C_TERMINAL_ID;
  process.env.FITNESS1C_SCHEDULE_URL = "https://fitness.example.test/FitnesOpb/hs/api/v2/schedule/";
  process.env.FITNESS1C_TERMINAL_ID = "terminal-test";
  let called = false;
  globalThis.fetch = async (url, options) => {
    called = true;
    assert.equal(url.origin, "https://fitness.example.test");
    assert.match(url.searchParams.get("start_date") || "", /^\d{4}-\d{2}-\d{2} 00:00$/);
    assert.match(url.searchParams.get("end_date") || "", /^\d{4}-\d{2}-\d{2} 23:59$/);
    assert.equal(options.headers.terminalid, "terminal-test");
    return new Response(JSON.stringify({ result: true, data: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const result = await getPublicSchedule();
    assert.equal(result.status, "ready");
    assert.deepEqual(result.items, []);
    assert.match(result.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(called, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.FITNESS1C_SCHEDULE_URL;
    else process.env.FITNESS1C_SCHEDULE_URL = originalUrl;
    if (originalTerminal === undefined) delete process.env.FITNESS1C_TERMINAL_ID;
    else process.env.FITNESS1C_TERMINAL_ID = originalTerminal;
  }
});
