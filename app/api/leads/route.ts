import { classifyAttribution } from "../../attribution";

const CALLTOUCH_SITE_ID = "52900";
const CALLTOUCH_ENDPOINT = "https://api.calltouch.ru/calls-service/RestAPI/requests";

type LeadRequest = {
  name?: unknown;
  phone?: unknown;
  formName?: unknown;
  goal?: unknown;
  details?: unknown;
  startedAt?: unknown;
  company?: unknown;
  attribution?: unknown;
  calltouch?: unknown;
  submissionId?: unknown;
};

type DedupeEntry = { leadId: string; createdAt: number };
const DEDUPE_TTL_MS = 24 * 60 * 60 * 1000;
const recentSubmissions = new Map<string, DedupeEntry>();

const text = (value: unknown, max = 500) => {
  if (typeof value === "string") return value.trim().slice(0, max);
  if (typeof value === "number" && Number.isFinite(value)) return String(value).slice(0, max);
  return "";
};

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function normalizePhone(value: unknown) {
  const digits = text(value, 40).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
  return digits;
}

function requestId() {
  return `pool-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}

function cleanSubmissionId(value: unknown) {
  const candidate = text(value, 100);
  return /^[a-zA-Z0-9._:-]{8,100}$/.test(candidate) ? candidate : "";
}

function lines(record: Record<string, unknown>, labels: Record<string, string>) {
  return Object.entries(labels)
    .map(([key, label]) => {
      const value = text(record[key], 1000);
      return value ? `${label}: ${value}` : "";
    })
    .filter(Boolean);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    const requestOrigin = new URL(request.url).origin;
    const configuredOrigin = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const allowedOrigins = new Set([requestOrigin, configuredOrigin].filter(Boolean).map((value) => value.replace(/\/$/, "")));
    if (!allowedOrigins.has(origin.replace(/\/$/, ""))) {
      return Response.json({ ok: false, message: "Запрос отклонён" }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 25_000) {
    return Response.json({ ok: false, message: "Слишком большой запрос" }, { status: 413 });
  }

  let input: LeadRequest;
  try {
    input = await request.json() as LeadRequest;
  } catch {
    return Response.json({ ok: false, message: "Некорректные данные формы" }, { status: 400 });
  }

  if (text(input.company)) {
    return Response.json({ ok: true, leadId: requestId() }, { headers: { "Cache-Control": "no-store" } });
  }

  const name = text(input.name, 100);
  const phone = normalizePhone(input.phone);
  const formName = text(input.formName, 120) || "Форма на сайте";
  const goal = text(input.goal, 300);
  const startedAt = Number(input.startedAt);
  if (name.length < 2 || phone.length < 10 || phone.length > 15) {
    return Response.json({ ok: false, message: "Проверьте имя и телефон" }, { status: 400 });
  }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 600) {
    return Response.json({ ok: false, message: "Отправьте форму ещё раз" }, { status: 400 });
  }

  const attribution = object(input.attribution);
  const calltouch = object(input.calltouch);
  const details = object(input.details);
  const submissionId = cleanSubmissionId(input.submissionId) || cleanSubmissionId(request.headers.get("x-idempotency-key"));
  const now = Date.now();
  for (const [key, entry] of recentSubmissions) {
    if (now - entry.createdAt > DEDUPE_TTL_MS) recentSubmissions.delete(key);
  }
  if (submissionId) {
    const previous = recentSubmissions.get(submissionId);
    if (previous && now - previous.createdAt <= DEDUPE_TTL_MS) {
      return Response.json({ ok: true, leadId: previous.leadId, duplicate: true }, { headers: { "Cache-Control": "no-store" } });
    }
  }
  const leadId = submissionId ? `pool-${submissionId}` : requestId();
  const sourceClass = classifyAttribution(attribution);
  const comment = [
    goal ? `Интерес: ${goal}` : "",
    `Канал: ${sourceClass.channel}`,
    `Источник: ${sourceClass.source}`,
    ...lines(details, {
      audience: "Для кого",
      quizGoal: "Цель",
      frequency: "Частота",
      time: "Удобное время",
      recommendation: "Рекомендация",
    }),
    ...lines(attribution, {
      landingPage: "Страница входа",
      pageUrl: "Страница заявки",
      referrer: "Реферер",
      utmSource: "utm_source",
      utmMedium: "utm_medium",
      utmCampaign: "utm_campaign",
      utmContent: "utm_content",
      utmTerm: "utm_term",
      yclid: "yclid",
      gclid: "gclid",
      fbclid: "fbclid",
      calltouchTm: "Calltouch TM",
      ymClientId: "Yandex Client ID",
      gaClientId: "GA Client ID",
    }),
  ].filter(Boolean).join("\n").slice(0, 8000);

  const body = new URLSearchParams({
    subject: formName,
    requestNumber: leadId,
    requestUrl: text(attribution.pageUrl, 2000) || new URL(request.url).origin,
    fio: name,
    phoneNumber: phone,
    comment,
    tags: ["Новый сайт", "Проект: Open Pool", formName, `Канал: ${sourceClass.channel}`, `Источник: ${sourceClass.source}`, text(attribution.utmSource, 80)].filter(Boolean).join(","),
  });
  const sessionId = text(calltouch.sessionId, 100);
  if (sessionId) body.set("sessionId", sessionId);

  try {
    const siteId = process.env.CALLTOUCH_SITE_ID || CALLTOUCH_SITE_ID;
    const endpoint = process.env.CALLTOUCH_API_BASE_URL || CALLTOUCH_ENDPOINT;
    const calltouchResponse = await fetch(`${endpoint}/${encodeURIComponent(siteId)}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const raw = await calltouchResponse.text();
    let calltouchResult: Record<string, unknown> = {};
    try { calltouchResult = JSON.parse(raw); } catch { calltouchResult = {}; }
    if (!calltouchResponse.ok || !calltouchResult.requestId) {
      console.error("Calltouch lead delivery failed", { leadId, status: calltouchResponse.status });
      return Response.json({ ok: false, message: "Сервис заявок временно недоступен. Позвоните нам по номеру +7 4212 46-49-16" }, { status: 502 });
    }
    if (submissionId) recentSubmissions.set(submissionId, { leadId, createdAt: Date.now() });

    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.LEADS_WEBHOOK_TOKEN) webhookHeaders.Authorization = `Bearer ${process.env.LEADS_WEBHOOK_TOKEN}`;
      const webhookPayload = { leadId, name, phone, formName, goal, details, attribution, calltouchRequestId: calltouchResult.requestId };
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: webhookHeaders,
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(8_000),
        });
        if (!webhookResponse.ok) console.error("Secondary lead webhook failed", { leadId, status: webhookResponse.status });
      } catch {
        console.error("Secondary lead webhook failed", { leadId });
      }
    }

    return Response.json({ ok: true, leadId }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Lead delivery failed", { leadId });
    return Response.json({ ok: false, message: "Сервис заявок временно недоступен. Позвоните нам по номеру +7 4212 46-49-16" }, { status: 502 });
  }
}
