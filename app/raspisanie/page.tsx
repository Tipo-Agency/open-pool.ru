import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, PageCta } from "../components";
import { site } from "../data";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Расписание открытого бассейна в Хабаровске",
  description: "Часы работы открытого бассейна «Наутилус» на Советской, 1 к4. Актуальное время занятий и свободные места смотрите в приложении или уточняйте у администратора.",
  path: "/raspisanie",
});

export default function SchedulePage() {
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Расписание" }]} />
    <section className="inner-hero"><span className="section-kicker">Наутилус, Советская, 1 к4</span><h1>Расписание открытого бассейна в Хабаровске</h1><p>Здесь указаны часы работы бассейна. Время групп, свободные места и запись проверяйте в приложении клуба или у администратора.</p></section>
    <nav className="schedule-types" aria-label="Разделы расписания"><a href="#pool-hours"><span>01</span><strong>Часы работы</strong><small>Когда открыт бассейн</small></a><a href="#current-schedule"><span>02</span><strong>Занятия и запись</strong><small>Актуальные места в приложении</small></a><a href="#ask-admin"><span>03</span><strong>Уточнить время</strong><small>Поможем выбрать группу</small></a></nav>
    <section className="schedule-card" id="pool-hours"><div className="schedule-head"><div><h2>Часы работы бассейна</h2></div><p><strong>Будни:</strong> 06:00-22:00<br /><strong>Выходные:</strong> 07:00-22:00</p></div><p>Свободное плавание, аквааэробика и занятия для детей и взрослых проходят с учётом загрузки дорожек и набора групп. Часы работы не означают, что в любое время есть свободная дорожка или место в группе.</p></section>
    <section className="schedule-card schedule-current" id="current-schedule"><div><span className="section-kicker">Актуальное расписание</span><h2>Проверьте занятия в приложении</h2><p>В приложении «ФК Наутилус» можно посмотреть доступное время и записаться на занятие. Для первого визита и уточнения условий посещения свяжитесь с администратором.</p><div className="app-buttons"><a href={site.appStore} target="_blank" rel="noreferrer">Открыть в App Store</a><a href={site.googlePlay} target="_blank" rel="noreferrer">Открыть в Google Play</a></div></div></section>
    <div id="ask-admin"><PageCta title="Найдём свободную группу" text="Напишите возраст, уровень и удобные дни. Администратор предложит актуальные варианты." /></div>
  </main><Footer /></>;
}
