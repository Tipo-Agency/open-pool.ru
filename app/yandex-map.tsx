"use client";

import { useEffect, useRef, useState } from "react";
import { trackSiteEvent } from "./analytics-client";
import "./yandex-map.css";

const mapUrl = "https://yandex.ru/map-widget/v1/?ll=135.044464%2C48.480725&z=16&pt=135.044464%2C48.480725%2Cpm2rdm";
const routeUrl = "https://yandex.ru/maps/?rtext=~48.480725%2C135.044464&rtt=auto&z=16";

export function YandexMap({ large = false }: { large?: boolean }) {
  const [opened, setOpened] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (opened) frame.current?.focus();
  }, [opened]);

  function openMap() {
    setOpened(true);
    trackSiteEvent("map_open", { page_path: window.location.pathname });
  }

  return (
    <div className={`yandex-map map-on-demand${large ? " contact-map" : ""}`}>
      {opened ? (
        <iframe
          ref={frame}
          src={mapUrl}
          title="Открытый бассейн Наутилус на Яндекс Картах"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-preview">
          <svg aria-hidden="true" viewBox="0 0 32 40" width="40" height="50" fill="none">
            <path d="M16 38S2 23 2 16a14 14 0 1 1 28 0c0 7-14 22-14 22Z" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <strong>Открытый бассейн Наутилус</strong>
          <p>Хабаровск, Советская улица, 1 к4</p>
          <button type="button" className="button" onClick={openMap}>
            Показать карту
          </button>
        </div>
      )}
      <a
        className="map-route-link"
        href={routeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSiteEvent("map_route_click", { page_path: window.location.pathname })}
      >
        Построить маршрут в Яндекс Картах ↗
      </a>
    </div>
  );
}
