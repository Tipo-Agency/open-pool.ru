"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { sendLead } from "./lead-client";
import { trackSiteEvent } from "./analytics-client";
import "./lead-form.css";

type FormField = "name" | "phone" | "consent";
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

  useEffect(() => {
    startedAt.current = Date.now();
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
    if (phone.replace(/\D/g, "").length < 10) errors.phone = "Укажите телефон: минимум 10 цифр.";
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
    const goal = String(form.get("goal") || defaultGoal);
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
      });
      setCompleted(true);
      setStatus(`Готово. Администратор получил заявку${result.leadId ? ` № ${result.leadId}` : ""}. Он свяжется с вами по указанному телефону и уточнит условия посещения.`);
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
      <h3>Заявка принята</h3>
      <p className="form-status" ref={statusRef} tabIndex={-1} role="status" data-state="success">{status}</p>
      <p>Если хотите уточнить детали сейчас, позвоните: <a href="tel:+74212464916">+7 4212 46-49-16</a>.</p>
    </div>;
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
        <input name="name" autoComplete="name" placeholder="Александр" required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined} />
      </label>
      {fieldErrors.name && <p className="field-error" id={`${formId}-name-error`}>{fieldErrors.name}</p>}
      <label>
        <span>Телефон</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 999 000-00-00" required aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? `${formId}-phone-error` : undefined} />
      </label>
      {fieldErrors.phone && <p className="field-error" id={`${formId}-phone-error`}>{fieldErrors.phone}</p>}
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
