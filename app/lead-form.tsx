"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { trackSiteEvent } from "./analytics-client";
import { readStoredUtm, sendLead } from "./lead-client";
import { site } from "./data";
import "./lead-form.css";

type FormField = "name" | "phone" | "consent";

const goalOptions = ["подбор абонемента", "разовое посещение", "свободное плавание", "аквааэробика", "занятия для взрослого", "занятия для ребёнка", "баня и сауна"];
const goalAliases: Record<string, string> = {
  "абонементы": "подбор абонемента",
  "плавание для взрослых": "занятия для взрослого",
  "плавание для детей": "занятия для ребёнка",
};
const utmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function normalizeGoal(goal: string) {
  const value = goal.trim().toLowerCase();
  return goalAliases[value] || goal;
}

// Приводит ввод к виду +7 (999) 000-00-00; 8 в начале заменяется на 7.
export function formatPhoneInput(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);
  const rest = digits.slice(1);
  let result = "+7";
  if (rest.length) result += ` (${rest.slice(0, 3)}`;
  if (rest.length > 3) result += ")";
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;
  return result;
}
type FieldErrors = Partial<Record<FormField, string>>;

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sendingRef = useRef(false);
  const submission = useRef({ fingerprint: "", id: "" });
  const formId = useId();
  const statusRef = useRef<HTMLParagraphElement>(null);
  const startedAt = useRef(0);
  const startedTracking = useRef(false);
  const initialGoal = normalizeGoal(defaultGoal);
  const options = goalOptions.includes(initialGoal) ? goalOptions : [initialGoal, ...goalOptions];
  const [phoneValue, setPhoneValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const values: Record<string, string> = { ...readStoredUtm(), page_url: window.location.href };
    for (const [field, value] of Object.entries(values)) {
      const input = formRef.current?.elements.namedItem(field);
      if (input instanceof HTMLInputElement) input.value = value;
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current || completed) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const consent = form.get("consent") === "on";
    const errors: FieldErrors = {};
    if (name.length < 2) errors.name = "Укажите имя: минимум 2 символа.";
    if (phone.replace(/\D/g, "").length !== 11) errors.phone = "Проверьте номер: нужно 10 цифр после +7.";
    if (!consent) errors.consent = "Подтвердите согласие на обработку данных.";
    setFieldErrors(errors);
    const firstInvalid = (["name", "phone", "consent"] as const).find((field) => errors[field]);
    if (firstInvalid) {
      setStatus("Проверьте отмеченные поля.");
      requestAnimationFrame(() => {
        const input = formElement.elements.namedItem(firstInvalid);
        if (input instanceof HTMLInputElement) input.focus();
      });
      return;
    }
    const goal = String(form.get("goal") || initialGoal);
    const fingerprint = JSON.stringify([name, phone.replace(/\D/g, ""), goal, formName]);
    if (submission.current.fingerprint !== fingerprint) {
      submission.current = { fingerprint, id: crypto.randomUUID() };
    }
    sendingRef.current = true;
    setSending(true);
    setStatus("Отправляем заявку...");
    try {
      const result = await sendLead({
        submissionId: submission.current.id,
        name,
        phone,
        goal,
        formName,
        company: String(form.get("company") || ""),
        startedAt: startedAt.current,
        details: Object.fromEntries([...utmFields, "page_url"].map((field) => [field, String(form.get(field) || "")]).filter(([, value]) => value)),
      });
      trackSiteEvent("form_submit", { interest: goal, form_name: formName, page_path: window.location.pathname });
      setCompleted(true);
      setStatus(`Спасибо! Заявка${result.leadId ? ` № ${result.leadId}` : ""} у администратора, скоро перезвоним в часы работы. Он свяжется с вами по указанному телефону и уточнит условия посещения.`);
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось отправить заявку. Позвоните нам: +7 4212 46-49-16");
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  if (completed) {
    return <div className="lead-form lead-receipt">
      <h3>Спасибо, заявка принята</h3>
      <p className="form-status" ref={statusRef} tabIndex={-1} role="status" data-state="success">{status}</p>
      <div className="lead-receipt-bring">
        <strong>Что взять с собой</strong>
        <ul><li>Купальник или плавки</li><li>Шапочку для плавания</li><li>Сланцы</li><li>Полотенце</li><li>Зимой: тёплую шапку и одежду на выход</li></ul>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="text-link" href="/blog/chto-vzyat-v-basseyn">Полный список вещей <span>→</span></a>
      </div>
      <div className="lead-receipt-app">
        <span>Расписание и запись в приложении «ФК Наутилус»</span>
        <div><a href={site.appStore} target="_blank" rel="noreferrer">App Store</a><a href={site.googlePlay} target="_blank" rel="noreferrer">Google Play</a></div>
      </div>
      <p>Если хотите уточнить детали сейчас, позвоните: <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.</p>
    </div>;
  }

  return (
    <form
      ref={formRef}
      className={`lead-form${compact ? " lead-form-compact" : ""}`}
      onSubmit={submit}
      onInputCapture={() => {
        if (startedTracking.current) return;
        startedTracking.current = true;
        trackSiteEvent("lead_form_start", { form_name: formName });
      }}
      noValidate
    >
      <label>
        <span>Ваше имя</span>
        <input name="name" autoComplete="name" placeholder="Александр" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined} />
      </label>
      {fieldErrors.name && <p className="field-error" id={`${formId}-name-error`}>{fieldErrors.name}</p>}
      <label>
        <span>Телефон</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 (999) 000-00-00" required value={phoneValue} onChange={(event) => setPhoneValue(formatPhoneInput(event.target.value))} onFocus={() => { if (!phoneValue) setPhoneValue("+7"); }} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? `${formId}-phone-error` : undefined} />
      </label>
      {fieldErrors.phone && <p className="field-error" id={`${formId}-phone-error`}>{fieldErrors.phone}</p>}
      {hideGoal ? <input type="hidden" name="goal" value={initialGoal} /> : (
        <label>
          <span>Что вас интересует</span>
          <select name="goal" defaultValue={initialGoal}>
            {options.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      )}
      {utmFields.map((field) => <input key={field} type="hidden" name={field} defaultValue="" />)}
      <input type="hidden" name="page_url" defaultValue="" />
      <label className="form-consent">
        <input name="consent" type="checkbox" required aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? `${formId}-consent-error` : undefined} />
        <span>Согласен на обработку данных по <a href="/politika-konfidencialnosti">политике конфиденциальности</a></span>
      </label>
      {fieldErrors.consent && <p className="field-error" id={`${formId}-consent-error`}>{fieldErrors.consent}</p>}
      <label className="form-honeypot" aria-hidden="true">
        <span>Компания</span>
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button-lime" type="submit" disabled={sending}>{sending ? "Отправляем..." : submitLabel}</button>
      <p className="form-note">{note}</p>
      <p className="form-status" ref={statusRef} tabIndex={-1} aria-live="polite" data-state={status.startsWith("Готово") ? "success" : "message"}>{status}</p>
    </form>
  );
}
