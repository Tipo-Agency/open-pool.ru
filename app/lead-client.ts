"use client";

import { CALLTOUCH_MOD_ID, YANDEX_METRIKA_IDS } from "./tracking";
import { trackSiteEvent } from "./analytics-client";

type CalltouchParams = {
  siteId?: number;
  sessionId?: number;
  ctClientId?: string;
  ctGlobalId?: string;
};

type LeadPayload = {
  name: string;
  phone: string;
  formName: string;
  goal?: string;
  details?: Record<string, string | undefined>;
  startedAt: number;
  company?: string;
  submissionId?: string;
};

declare global {
  interface Window {
    ct?: (method: string, modId: string) => CalltouchParams | undefined;
    ym?: (counterId: number, method: string, goal: string, params?: Record<string, unknown>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function readCookie(name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))?.[1] || "";
}

const UTM_COOKIE = "op_utm";

function readUtmCookie(): Record<string, string> {
  try {
    return JSON.parse(decodeURIComponent(readCookie(UTM_COOKIE)) || "{}");
  } catch {
    return {};
  }
}

/** UTM текущего URL, сессии или cookie на 30 дней (последний заход с метками). */
export function readStoredUtm() {
  const attribution = readAttribution();
  return {
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    utm_content: attribution.utmContent,
    utm_term: attribution.utmTerm,
  };
}

function readAttribution() {
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem("openpool_attribution") || "{}");
  } catch {
    stored = {};
  }

  const current = new URLSearchParams(window.location.search);
  const cookie = readUtmCookie();
  const value = (key: string) => current.get(key) || stored[key] || cookie[key] || "";
  return {
    landingPage: stored.landingPage || window.location.href,
    pageUrl: window.location.href,
    referrer: stored.referrer || document.referrer || "",
    utmSource: value("utm_source"),
    utmMedium: value("utm_medium"),
    utmCampaign: value("utm_campaign"),
    utmContent: value("utm_content"),
    utmTerm: value("utm_term"),
    yclid: value("yclid"),
    gclid: value("gclid"),
    fbclid: value("fbclid"),
    openstat: value("openstat"),
    calltouchTm: value("calltouch_tm"),
    ymClientId: decodeURIComponent(readCookie("_ym_uid")),
    gaClientId: decodeURIComponent(readCookie("_ga")),
  };
}

async function getCalltouchParams() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const params = window.ct?.("calltracking_params", CALLTOUCH_MOD_ID);
      if (params?.sessionId) return params;
    } catch {
      // The tracker may still be loading. Attribution data is also sent separately.
    }
    await new Promise((resolve) => window.setTimeout(resolve, 125));
  }
  return {};
}

function trackResult(event: "lead_submit_success" | "lead_submit_error", formName: string, leadId?: string) {
  trackSiteEvent(event, { form_name: formName, lead_id: leadId });
  if (event === "lead_submit_success") {
    for (const counterId of YANDEX_METRIKA_IDS) {
      try {
        window.ym?.(counterId, "reachGoal", "lead_submit", { form_name: formName, lead_id: leadId });
      } catch {
        // A blocked analytics script must not affect the form result.
      }
    }
  }
}

export async function sendLead(payload: LeadPayload) {
  trackSiteEvent("lead_submit_attempt", { form_name: payload.formName });
  const calltouch = await getCalltouchParams();
  const submissionId = payload.submissionId || (typeof crypto !== "undefined" ? crypto.randomUUID() : `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Idempotency-Key": submissionId },
    body: JSON.stringify({
      ...payload,
      submissionId,
      attribution: readAttribution(),
      calltouch: {
        siteId: calltouch.siteId,
        sessionId: calltouch.sessionId,
        clientId: calltouch.ctClientId,
        globalId: calltouch.ctGlobalId,
      },
    }),
  }).catch(() => {
    trackResult("lead_submit_error", payload.formName);
    throw new Error("Связь прервалась. Попробуйте отправить ещё раз или позвоните: +7 4212 46-49-16");
  });

  const result = await response.json().catch(() => ({})) as { ok?: boolean; leadId?: string; message?: string; duplicate?: boolean };
  if (!response.ok || !result.ok) {
    trackResult("lead_submit_error", payload.formName);
    throw new Error(result.message || "Не удалось отправить заявку");
  }

  if (!result.duplicate) trackResult("lead_submit_success", payload.formName, result.leadId);
  return result;
}
