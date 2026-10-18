"use client";

import { YANDEX_METRIKA_IDS } from "./tracking";

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
  for (const counterId of YANDEX_METRIKA_IDS) {
    try {
      window.ym?.(counterId, "reachGoal", event, params);
    } catch {
      // A blocked counter must not interrupt the visitor or another counter.
    }
  }
}
