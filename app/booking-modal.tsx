"use client";

import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { LeadForm } from "./lead-form";
import { BrandLogo } from "./brand-logo";

export function BookingModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const [goal, setGoal] = useState("подбор абонемента");
  const [formName, setFormName] = useState("Подбор абонемента");
  const [submitLabel, setSubmitLabel] = useState("Отправить заявку");
  const [hideGoal, setHideGoal] = useState(false);

  useEffect(() => {
    const openDialog = (event: globalThis.MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-booking]");
      if (!target) return;
      event.preventDefault();
      lastTrigger.current = target;
      setGoal(target.dataset.goal || "подбор абонемента");
      setFormName(target.dataset.formName || target.dataset.goal || "Подбор абонемента");
      setSubmitLabel(target.dataset.submitLabel || "Отправить заявку");
      setHideGoal(Boolean(target.dataset.goal));
      dialogRef.current?.showModal();
      requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus());
    };
    document.addEventListener("click", openDialog);
    return () => document.removeEventListener("click", openDialog);
  }, []);

  function close(event?: MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    dialogRef.current?.close();
    lastTrigger.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      dialogRef.current?.close();
    }
  }

  return (
    <dialog className="booking-dialog" id="booking" ref={dialogRef} aria-labelledby="booking-title" onKeyDown={handleKeyDown} onClose={() => lastTrigger.current?.focus()}>
      <div className="booking-dialog-layout">
        <div className="booking-dialog-copy">
          <BrandLogo className="brand-logo-light booking-brand-logo" />
          <span className="section-kicker">Запись и подбор</span>
          <h2 id="booking-title">Найдём ваш формат плавания</h2>
          <p>Оставьте имя, телефон и цель. Администратор получит заявку, уточнит время и стоимость и свяжется с вами.</p>
          <ul><li>Разовый заплыв от 500 ₽</li><li>Абонементы для регулярных визитов</li><li>Детские и взрослые группы</li></ul>
          <a href="tel:+74212464916">Или позвоните: +7 4212 46-49-16</a>
        </div>
        <LeadForm key={`${formName}-${goal}`} formName={formName} defaultGoal={goal} hideGoal={hideGoal} submitLabel={submitLabel} />
      </div>
      <button className="dialog-close" type="button" aria-label="Закрыть форму" onClick={close}>×</button>
    </dialog>
  );
}
