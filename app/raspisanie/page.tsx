import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, PageCta } from "../components";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Расписание открытого бассейна в Хабаровске", description: "Часы работы открытого бассейна «Наутилус» на Советской, 1 к4: свободное плавание и запись в детские и взрослые группы, аквааэробика.", path: "/raspisanie" });

const rows = [
  ["Свободное плавание", "06:00-22:00", "06:00-22:00", "06:00-22:00", "06:00-22:00", "06:00-22:00", "07:00-22:00", "07:00-22:00"],
  ["Аквааэробика", "Уточнить", "Уточнить", "Уточнить", "Уточнить", "Уточнить", "По записи", "По записи"],
  ["Взрослые группы", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи"],
  ["Дети 9-13 лет", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи"],
  ["Подростки 14-16 лет", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи", "По записи"],
];

export default function SchedulePage() {
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Расписание" }]} />
    <section className="inner-hero"><span className="section-kicker">Наутилус, Советская, 1 к4</span><h1>Расписание открытого бассейна в Хабаровске</h1><p>Свободное плавание доступно каждый день. Время групп меняется при наборе, поэтому актуальный слот подтверждает администратор.</p></section>
    <nav className="schedule-types" aria-label="Разделы расписания"><a href="#pool-hours"><span>01</span><strong>Работа бассейна</strong><small>Часы открытия и закрытия</small></a><a href="#single-swims"><span>02</span><strong>Разовые заплывы</strong><small>Свободное плавание</small></a><a href="#groups"><span>03</span><strong>Групповые занятия</strong><small>Дети, взрослые, аквааэробика</small></a></nav>
    <section className="schedule-card" id="pool-hours"><div className="schedule-head"><div><span className="schedule-live">Работает сегодня</span><h2>Часы работы</h2></div><p><strong>Будни:</strong> 06:00-22:00<br /><strong>Выходные:</strong> 07:00-22:00</p></div><div className="table-wrap" id="groups"><table><thead><tr><th>Занятие</th>{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day) => <th key={day}>{day}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]} id={row[0] === "Свободное плавание" ? "single-swims" : undefined}>{row.map((cell, index) => index === 0 ? <th key={cell}>{cell}</th> : <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div><p className="schedule-note">Структура готова к синхронизации с 1С: часы работы, доступные разовые заплывы и группы будут обновляться из единого источника. До подключения администратор подтверждает актуальный слот.</p></section>
    <PageCta title="Найдём свободную группу" text="Напишите возраст, уровень и удобные дни. Администратор предложит актуальные варианты." />
  </main><Footer /></>;
}
