"use client";

import { YANDEX_METRIKA_ID } from "./tracking";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, goal: string, params?: Record<string, unknown>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackSiteEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  try {
    window.ym?.(YANDEX_METRIKA_ID, "reachGoal", event, params);
  } catch {
    // Analytics blockers must never interrupt the visitor's action.
  }
}
