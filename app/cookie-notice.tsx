"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "openpool_cookie_notice";

// Уведомление об использовании cookie и Метрики. Скрывается навсегда после «Понятно».
export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try { setVisible(localStorage.getItem(STORAGE_KEY) !== "1"); } catch { setVisible(true); }
  }, []);
  if (!visible) return null;
  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* приватный режим: просто скрываем */ }
    setVisible(false);
  };
  return (
    <div className="cookie-notice" role="region" aria-label="Уведомление о cookie">
      <p>Сайт использует cookie и Яндекс Метрику, чтобы считать посещения и улучшать сервис. Подробнее в <a href="/politika-konfidencialnosti">политике конфиденциальности</a>.</p>
      <button type="button" onClick={accept}>Понятно</button>
    </div>
  );
}
