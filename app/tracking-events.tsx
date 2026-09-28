"use client";

import { useEffect } from "react";
import { trackSiteEvent } from "./analytics-client";

function linkKind(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") || "";
  if (href.startsWith("tel:")) return "phone_click";
  if (/vk\.me|t\.me|wa\.me|max\.ru/i.test(href)) return "messenger_click";
  if (/apps\.apple\.com|play\.google\.com/i.test(href)) return "app_download_click";
  if (href === "/ceny" || href.includes("/uslugi/abonementy")) return "price_view_click";
  if (href === "/raspisanie" || href.includes("#groups")) return "schedule_view_click";
  return "";
}

export function TrackingEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>("a,button");
      if (!element) return;

      if (element.matches("[data-booking]")) {
        trackSiteEvent("booking_open", {
          cta_text: element.textContent?.trim().slice(0, 120) || "",
          page_path: window.location.pathname,
        });
        return;
      }

      if (element instanceof HTMLAnchorElement) {
        const kind = linkKind(element);
        if (kind) {
          trackSiteEvent(kind, {
            link_url: element.href,
            link_text: element.textContent?.trim().slice(0, 120) || "",
            page_path: window.location.pathname,
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
