/* Document navigation is intentional: vinext client Link broke on production routes. */
/* eslint-disable @next/next/no-html-link-for-pages */
import { poolImageProps } from "../pool-image";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, PageCta } from "../components";
import { images } from "../data";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "О бассейне Наутилус", description: "Открытый 50-метровый бассейн в Хабаровске: 8 дорожек, вода +28 °C круглый год, баня, летний пляж и парковка.", path: "/o-basseyne" });

export default function AboutPage() {
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "О бассейне" }]} />
    <section className="inner-hero"><span className="section-kicker">Открытая вода круглый год</span><h1>Место, где Хабаровск плавает</h1><p>Спортивная длина, свежий воздух и инфраструктура для полноценного отдыха после дорожки.</p></section>
    <section className="about-gallery"><div className="about-big"><img {...poolImageProps(images.pool, true)} alt="Общий вид открытого бассейна Наутилус" /></div><div><img {...poolImageProps(images.training)} alt="Тренировка в бассейне" /><img {...poolImageProps(images.family)} alt="Занятие плаванием для детей" /></div></section>
    <section className="story-grid"><div><span className="section-kicker">Главные цифры</span><h2>8 дорожек.<br />50 метров.<br />+28 °C.</h2></div><div><p>Длинная дорожка даёт спортивное ощущение и позволяет меньше отвлекаться на развороты. Здесь удобно тренироваться на дистанцию, осваивать технику или просто плыть в своём темпе.</p><p>Вода остаётся тёплой круглый год. Летом рядом работает пляж с лежаками, после заплыва можно зайти в баню. Просторные раздевалки и парковка делают регулярные визиты проще.</p></div></section>
    <section className="comparison-note"><h2>Первое посещение: что подготовить</h2><div><p><strong>Возьмите с собой.</strong> Купальный костюм, шапочку, сланцы и полотенце. Перед первым визитом посмотрите <a href="/pravila-poseshcheniya">правила бассейна</a>, а требования к документам уточните у администратора.</p><p><strong>Выберите формат.</strong> Для знакомства подойдёт <a href="/uslugi/razovoe-poseshchenie">разовое посещение</a>. Если планируете ходить регулярно, сравните <a href="/ceny#pool-sauna-offer">30 посещений с баней</a> и безлимитные карты. Полная стоимость карты и срок действия указаны рядом с ценой.</p><p><strong>Проверьте маршрут.</strong> Бассейн находится в Хабаровске на Советской улице, 1 к4. <a href="/kontakty">Адрес, часы работы и маршрут</a> помогут спланировать дорогу. Условия парковки зависят от выбранной карты.</p></div></section>
    <PageCta title="Попробуйте большую воду" text="Начните с разового посещения или сразу подберите карту для регулярных тренировок." />
  </main><Footer /></>;
}
