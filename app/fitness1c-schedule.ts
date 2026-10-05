type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: string;
  room: string;
};

export type PublicSchedule =
  | { status: "ready"; items: ScheduleItem[]; updatedAt: string }
  | { status: "unavailable" | "not_configured"; items: [] };

const TIME_ZONE = "Asia/Vladivostok";
const CACHE_MS = 5 * 60 * 1000;
let cached: { value: PublicSchedule; expiresAt: number } | undefined;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function value(source: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
}

function label(value: unknown): string {
  if (typeof value === "string") return value.trim().slice(0, 120);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value && typeof value === "object") {
    return label(valueFromObject(record(value)));
  }
  return "";
}

function valueFromObject(source: Record<string, unknown>): unknown {
  return value(source, ["name", "title", "Name", "Title", "full_name", "FullName"]);
}

function localDateTime(input: unknown): { date: string; time: string } | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  const local = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(raw);
  if (local && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) return { date: local[1], time: local[2] };
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return { date: raw, time: "" };
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(parsed);
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

function entries(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  const root = record(payload);
  if (root.result === false || root.success === false) return null;
  const data = value(root, ["data", "items", "schedule", "appointments", "Data", "Items"]);
  if (Array.isArray(data)) return data;
  const nested = record(data);
  const list = value(nested, ["items", "schedule", "appointments", "data", "Items", "Schedule"]);
  return Array.isArray(list) ? list : null;
}

export function normalizePublicSchedule(payload: unknown): ScheduleItem[] | null {
  const rows = entries(payload);
  if (!rows) return null;
  const items: ScheduleItem[] = [];
  for (const row of rows) {
    const item = record(row);
    const title = label(value(item, ["service_name", "appointment_name", "title", "name", "service", "ServiceName", "AppointmentName", "Title", "Name"]));
    const start = localDateTime(value(item, ["start_date", "start_at", "date_start", "start", "StartDate", "StartAt", "Start"]));
    const separateDate = localDateTime(value(item, ["date", "Date"]));
    const date = start?.date || separateDate?.date || "";
    const startTime = start?.time || label(value(item, ["start_time", "time_start", "time", "StartTime", "Time"])).slice(0, 5);
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) continue;
    const end = localDateTime(value(item, ["end_date", "end_at", "date_end", "end", "EndDate", "EndAt", "End"]));
    const endTime = end?.time || label(value(item, ["end_time", "time_end", "EndTime"])).slice(0, 5);
    items.push({
      id: label(value(item, ["appointment_id", "id", "AppointmentId", "ID"])) || `${date}-${startTime}-${title}`,
      title, date, startTime,
      endTime: /^\d{2}:\d{2}$/.test(endTime) ? endTime : "",
      trainer: label(value(item, ["trainer_name", "trainer", "employee", "instructor", "TrainerName", "Trainer"])),
      room: label(value(item, ["room_name", "room", "hall", "place", "RoomName", "Room"])),
    });
  }
  // Incomplete mapping must not silently hide some real sessions.
  if (items.length !== rows.length) return null;
  return items.sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
}

function dateInClub(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function timeInClub(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date);
}

export async function getPublicSchedule(): Promise<PublicSchedule> {
  const endpoint = process.env.FITNESS1C_SCHEDULE_URL;
  const terminalId = process.env.FITNESS1C_TERMINAL_ID;
  if (!endpoint || !terminalId) return { status: "not_configured", items: [] };
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let url: URL;
  try {
    url = new URL(endpoint);
    if (url.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return { status: "unavailable", items: [] };
  }
  const now = new Date();
  const until = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  url.searchParams.set("start_date", `${dateInClub(now)} 00:00`);
  url.searchParams.set("end_date", `${dateInClub(until)} 23:59`);

  try {
    const headers: Record<string, string> = { Accept: "application/json", terminalid: terminalId };
    const username = process.env.FITNESS1C_API_USERNAME;
    const password = process.env.FITNESS1C_API_PASSWORD;
    if (username && password) headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(5_000), cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (Number(response.headers.get("content-length") || 0) > 1_000_000) throw new Error("Response too large");
    const raw = await response.text();
    if (raw.length > 1_000_000) throw new Error("Response too large");
    const items = normalizePublicSchedule(JSON.parse(raw));
    if (!items) throw new Error("Unknown schedule format");
    const currentSlot = `${dateInClub(now)} ${timeInClub(now)}`;
    const futureItems = items.filter((item) => `${item.date} ${item.startTime}` >= currentSlot);
    const result: PublicSchedule = { status: "ready", items: futureItems, updatedAt: new Date().toISOString() };
    cached = { value: result, expiresAt: Date.now() + CACHE_MS };
    return result;
  } catch (error) {
    console.error("Fitness1C public schedule unavailable", { reason: error instanceof Error ? error.message : "Unknown error" });
    const result: PublicSchedule = { status: "unavailable", items: [] };
    cached = { value: result, expiresAt: Date.now() + 30_000 };
    return result;
  }
}
