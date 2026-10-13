import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, PageCta } from "../components";
import { site } from "../data";
import { getPublicSchedule } from "../fitness1c-schedule";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Расписание открытого бассейна в Хабаровске",
  description: "Часы работы открытого бассейна «Наутилус» на Советской, 1 к4. Актуальное время занятий и свободные места смотрите в приложении или уточняйте у администратора.",
  path: "/raspisanie",
});

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export default async function SchedulePage() {
  const schedule = await getPublicSchedule();
  const dates = schedule.status === "ready" ? [...new Set(schedule.items.map((item) => item.date))] : [];
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Расписание" }]} />
    <section className="inner-hero"><span className="section-kicker">Наутилус, Советская, 1 к4</span><h1>Расписание открытого бассейна в Хабаровске</h1><p>Часы работы бассейна и ближайшие занятия. {schedule.status === "ready" ? "Время групп обновляется из системы клуба." : "Данные о занятиях появятся после подключения системы клуба."} Наличие мест и запись уточняйте у администратора.</p></section>
    <nav className="schedule-types" aria-label="Разделы расписания"><a href="#pool-hours"><span>01</span><strong>Часы работы</strong><small>Когда открыт бассейн</small></a><a href="#current-schedule"><span>02</span><strong>Ближайшие занятия</strong><small>Расписание из системы клуба</small></a><a href="#ask-admin"><span>03</span><strong>Уточнить время</strong><small>Поможем выбрать группу</small></a></nav>
    <section className="schedule-card" id="pool-hours"><div className="schedule-head"><div><h2>Часы работы бассейна</h2></div><p><strong>Будни:</strong> 06:00-22:00<br /><strong>Выходные:</strong> 07:00-22:00</p></div><p>Свободное плавание, аквааэробика и занятия для детей и взрослых проходят с учётом загрузки дорожек и набора групп. Часы работы не означают, что в любое время есть свободная дорожка или место в группе.</p></section>
    <section className="schedule-card schedule-current" id="current-schedule"><div><span className="section-kicker">Ближайшие 7 дней</span><h2>Занятия в бассейне</h2>
      {schedule.status === "ready" && dates.length > 0 ? <div className="schedule-days">{dates.map((date) => <section className="schedule-day" key={date}><h3>{dateLabel(date)}</h3><ul>{schedule.items.filter((item) => item.date === date).map((item) => <li key={item.id}><time dateTime={`${item.date}T${item.startTime}`}>{item.startTime}{item.endTime ? `- ${item.endTime}` : ""}</time><div><strong>{item.title}</strong>{item.trainer || item.room ? <small>{[item.trainer, item.room].filter(Boolean).join(" · ")}</small> : null}</div></li>)}</ul></section>)}</div> : <p className="schedule-message">{schedule.status === "ready" ? "На ближайшую неделю занятия пока не опубликованы. Время свободного плавания уточните у администратора." : "Расписание занятий сейчас не загружается. Уточните время у администратора или в приложении клуба."}</p>}
      <p className="schedule-note">{schedule.status === "ready" ? "Показаны опубликованные занятия. " : ""}Свободные дорожки и наличие мест могут меняться. Перед визитом подтвердите время у администратора.</p>
      <div className="app-buttons"><a href={site.appStore} target="_blank" rel="noreferrer">Открыть в App Store</a><a href={site.googlePlay} target="_blank" rel="noreferrer">Открыть в Google Play</a></div>
    </div></section>
    <div id="ask-admin"><PageCta title="Найдём свободную группу" text="Напишите возраст, уровень и удобные дни. Администратор предложит актуальные варианты." /></div>
  </main><Footer /></>;
}
