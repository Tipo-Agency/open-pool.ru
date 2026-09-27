"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { sendLead } from "./lead-client";

type QuizAnswers = {
  audience?: string;
  goal?: string;
  frequency?: string;
  time?: string;
};

const questions = [
  {
    key: "audience" as const,
    eyebrow: "Шаг 1",
    title: "Для кого выбираем плавание?",
    hint: "Это сразу отсечёт неподходящие форматы",
    options: [
      { value: "Для себя", label: "Для себя", note: "Свободное плавание, обучение или тренировки" },
      { value: "Для ребёнка", label: "Для ребёнка", note: "Группа по возрасту и уровню подготовки" },
    ],
  },
  {
    key: "goal" as const,
    eyebrow: "Шаг 2",
    title: "Какой результат сейчас важнее?",
    hint: "Выберите одну главную задачу",
    options: [
      { value: "Попробовать бассейн", label: "Попробовать бассейн", note: "Первый визит без долгих обязательств" },
      { value: "Плавать регулярно", label: "Плавать регулярно", note: "Свой темп, дистанция и удобный график" },
      { value: "Научиться или улучшить технику", label: "Поставить технику", note: "Тренер и группа по уровню" },
      { value: "Тренироваться в воде", label: "Аквааэробика", note: "Мягкая групповая нагрузка" },
      { value: "Вернуться к активности", label: "Вернуться к активности", note: "Постепенная нагрузка после согласования с врачом" },
    ],
  },
  {
    key: "frequency" as const,
    eyebrow: "Шаг 3",
    title: "Как часто реально будете приходить?",
    hint: "Так мы поймём, когда абонемент выгоднее разовых визитов",
    options: [
      { value: "Один раз для знакомства", label: "Один раз", note: "Сначала посмотреть и почувствовать воду" },
      { value: "Один-два раза в неделю", label: "1-2 раза в неделю", note: "Комфортный регулярный ритм" },
      { value: "Три раза в неделю или чаще", label: "3 раза и чаще", note: "Нужен самый выгодный формат" },
    ],
  },
  {
    key: "time" as const,
    eyebrow: "Шаг 4",
    title: "Когда удобнее плавать?",
    hint: "Администратор учтёт загрузку дорожек и расписание групп",
    options: [
      { value: "Утром", label: "Утром", note: "Начать день с бассейна" },
      { value: "Днём", label: "Днём", note: "Более спокойное время" },
      { value: "Вечером", label: "Вечером", note: "После работы или учёбы" },
      { value: "График гибкий", label: "График гибкий", note: "Подойдёт любое удобное окно" },
    ],
  },
];

const recommendations = {
  child: {
    eyebrow: "Рекомендуем детскую группу",
    title: "Плавание для детей",
    text: "Подберём группу по возрасту и уровню, уточним расписание и познакомим с тренером.",
    href: "/uslugi/plavanie-dlya-detey",
  },
  first: {
    eyebrow: "Лучший первый шаг",
    title: "Разовое посещение",
    text: "Один заплыв поможет оценить воду, дорожки и атмосферу бассейна. Условия посещения сауны и пляжа уточните отдельно. Парковка не включена.",
    href: "/uslugi/razovoe-poseshchenie",
  },
  aqua: {
    eyebrow: "Подходит под вашу цель",
    title: "Аквааэробика",
    text: "Групповая тренировка в воде с мягкой нагрузкой и понятным темпом.",
    href: "/uslugi/akvaaerobika",
  },
  learn: {
    eyebrow: "Подходит под вашу цель",
    title: "Плавание с тренером",
    text: "Группа по уровню поможет поставить дыхание, технику и стабильный тренировочный ритм.",
    href: "/uslugi/obuchenie-plavaniyu-vzroslyh",
  },
  pass: {
    eyebrow: "Выгодный регулярный формат",
    title: "Абонемент на плавание",
    text: "Администратор сравнит карты по частоте визитов и составу услуг. В 20 посещений входят только посещения бассейна. Сауна и пляж включены в безлимит на 30 дней, парковка добавляется в безлимитах на 90, 180 и 365 дней.",
    href: "/uslugi/abonementy",
  },
};

export function PoolQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const startedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const isResult = step === questions.length;
  const question = questions[Math.min(step, questions.length - 1)];

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const recommendation = useMemo(() => {
    if (answers.audience === "Для ребёнка") return recommendations.child;
    if (answers.goal === "Попробовать бассейн" || answers.frequency === "Один раз для знакомства") return recommendations.first;
    if (answers.goal === "Тренироваться в воде") return recommendations.aqua;
    if (answers.goal === "Научиться или улучшить технику") return recommendations.learn;
    return recommendations.pass;
  }, [answers]);

  function choose(key: keyof QuizAnswers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setStatus(`Ответ выбран. Шаг ${Math.min(step + 2, questions.length)} из ${questions.length}.`);
    setStep((current) => Math.min(current + 1, questions.length));
  }

  function goBack() {
    setStatus("");
    setStep((current) => Math.max(current - 1, 0));
  }

  function restart() {
    setAnswers({});
    setErrors({});
    setStatus("Квиз начат заново.");
    setStep(0);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("quiz-name") || "").trim();
    const phone = String(form.get("quiz-phone") || "").trim();
    const consent = form.get("quiz-consent") === "on";
    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = "Укажите имя минимум из двух букв.";
    if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Укажите телефон минимум из 10 цифр.";
    if (!consent) nextErrors.consent = "Подтвердите согласие на обработку данных.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("Проверьте выделенные поля.");
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else consentRef.current?.focus();
      return;
    }

    setSending(true);
    setStatus("Отправляем подбор администратору...");
    try {
      await sendLead({
        name,
        phone,
        goal: recommendation.title,
        formName: "Квиз: подбор формата плавания",
        startedAt: startedAt.current,
        company: String(form.get("company") || ""),
        details: {
          audience: answers.audience,
          quizGoal: answers.goal,
          frequency: answers.frequency,
          time: answers.time,
          recommendation: recommendation.title,
        },
      });
      formElement.reset();
      startedAt.current = Date.now();
      setStatus("Готово. Ответы и телефон уже у администратора, скоро вам позвоним.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось отправить заявку. Позвоните нам: +7 4212 46-49-16");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="quiz-section" id="quiz" aria-labelledby="quiz-title">
      <div className="quiz-intro">
        <span className="section-kicker light-kicker">Подбор за 60 секунд</span>
        <h2 id="quiz-title">Найдём ваш формат плавания</h2>
        <p>Четыре коротких вопроса. В конце получите конкретную рекомендацию и сможете сразу узнать цену и свободное время.</p>
        <div className="quiz-proof"><strong>4</strong><span>вопроса<br />до результата</span></div>
      </div>

      <div className="quiz-card" aria-live="off">
        <div className="quiz-progress" aria-label={`Пройдено ${Math.min(step, questions.length)} из ${questions.length} шагов`}>
          <span>{isResult ? "Готово" : `${step + 1} / ${questions.length}`}</span>
          <div><i style={{ width: `${isResult ? 100 : ((step + 1) / questions.length) * 100}%` }} /></div>
        </div>

        {!isResult ? (
          <div className="quiz-question" key={question.key}>
            <span>{question.eyebrow}</span>
            <h3>{question.title}</h3>
            <p>{question.hint}</p>
            <div className="quiz-options">
              {question.options.map((option, index) => (
                <button type="button" key={option.value} onClick={() => choose(question.key, option.value)}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <b>{option.label}</b>
                  <small>{option.note}</small>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
            {step > 0 && <button className="quiz-back" type="button" onClick={goBack}>← Вернуться к предыдущему вопросу</button>}
          </div>
        ) : (
          <div className="quiz-result">
            <div className="quiz-result-head">
              <span>{recommendation.eyebrow}</span>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.text}</p>
              <a href={recommendation.href}>Посмотреть подробности →</a>
            </div>
            <form className="quiz-form" onSubmit={submit} noValidate>
              <strong>Получить точную цену и время</strong>
              <p>Администратор увидит ответы и предложит подходящий вариант.</p>
              <label htmlFor="quiz-name">Ваше имя</label>
              <input ref={nameRef} id="quiz-name" name="quiz-name" autoComplete="name" placeholder="Александр" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "quiz-name-error" : undefined} />
              {errors.name && <span className="quiz-error" id="quiz-name-error">{errors.name}</span>}
              <label htmlFor="quiz-phone">Телефон</label>
              <input ref={phoneRef} id="quiz-phone" name="quiz-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "quiz-phone-error" : undefined} />
              {errors.phone && <span className="quiz-error" id="quiz-phone-error">{errors.phone}</span>}
              <label className="quiz-consent">
                <input ref={consentRef} name="quiz-consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "quiz-consent-error" : undefined} />
                <span>Согласен на обработку данных по <a href="/politika-konfidencialnosti">политике конфиденциальности</a></span>
              </label>
              {errors.consent && <span className="quiz-error" id="quiz-consent-error">{errors.consent}</span>}
              <label className="form-honeypot" aria-hidden="true"><span>Компания</span><input name="company" tabIndex={-1} autoComplete="off" /></label>
              <button className="button" type="submit" disabled={sending}>{sending ? "Отправляем..." : "Получить цену и время"}</button>
              <button className="quiz-restart" type="button" onClick={restart}>Пройти квиз заново</button>
            </form>
          </div>
        )}
        <p className={isResult ? "quiz-submit-status" : "sr-only"} role="status">{status}</p>
      </div>
    </section>
  );
}
