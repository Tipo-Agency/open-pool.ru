"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { sendLead } from "./lead-client";
import { trackSiteEvent } from "./analytics-client";

type LeadFormProps = {
  formName?: string;
  defaultGoal?: string;
  hideGoal?: boolean;
  submitLabel?: string;
  note?: string;
  compact?: boolean;
};

export function LeadForm({
  formName = "Подбор абонемента",
  defaultGoal = "подбор абонемента",
  hideGoal = false,
  submitLabel = "Отправить заявку",
  note = "Передадим заявку администратору. Он уточнит свободное время и стоимость.",
  compact = false,
}: LeadFormProps = {}) {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const startedAt = useRef(0);
  const startedTracking = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const consent = form.get("consent") === "on";
    if (name.length < 2 || phone.replace(/\D/g, "").length < 10) {
      setStatus("Укажите имя и телефон минимум из 10 цифр.");
      return;
    }
    if (!consent) {
      setStatus("Подтвердите согласие на обработку данных.");
      return;
    }
    const goal = String(form.get("goal") || defaultGoal);
    setSending(true);
    setStatus("Отправляем заявку...");
    try {
      await sendLead({
        name,
        phone,
        goal,
        formName,
        company: String(form.get("company") || ""),
        startedAt: startedAt.current,
      });
      formElement.reset();
      startedAt.current = Date.now();
      setStatus("Готово. Заявка отправлена администратору, скоро вам позвоним.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось отправить заявку. Позвоните нам: +7 4212 46-49-16");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      className={`lead-form${compact ? " lead-form-compact" : ""}`}
      onSubmit={submit}
      onFocusCapture={() => {
        if (startedTracking.current) return;
        startedTracking.current = true;
        trackSiteEvent("lead_form_start", { form_name: formName });
      }}
      noValidate
    >
      <label>
        <span>Ваше имя</span>
        <input name="name" autoComplete="name" placeholder="Александр" required />
      </label>
      <label>
        <span>Телефон</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 999 000-00-00" required />
      </label>
      {hideGoal ? <input type="hidden" name="goal" value={defaultGoal} /> : (
        <label>
          <span>Что вас интересует</span>
          <select name="goal" defaultValue={defaultGoal}>
            <option>подбор абонемента</option>
            <option>разовое посещение</option>
            <option>аквааэробика</option>
            <option>занятия для взрослого</option>
            <option>занятия для ребёнка</option>
          </select>
        </label>
      )}
      <label className="form-consent">
        <input name="consent" type="checkbox" required />
        <span>Согласен на обработку данных по <a href="/politika-konfidencialnosti">политике конфиденциальности</a></span>
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Компания</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button-lime" type="submit" disabled={sending}>{sending ? "Отправляем..." : submitLabel}</button>
      <p className="form-note">{note}</p>
      <p className="form-status" aria-live="polite" data-state={status.startsWith("Готово") ? "success" : "message"}>{status}</p>
    </form>
  );
}
