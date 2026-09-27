import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../components";
import { featuredTariff, freezeTerms, parkingTerms, tariffDate, unlimitedTariffs, visitPackageTerms, visitTariffs } from "../pricing-data";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Цены на бассейн и абонементы в Хабаровске", description: "Разовое посещение открытого бассейна от 500 ₽ и клубные карты для регулярного плавания. Сравните форматы и получите точный расчёт.", path: "/ceny" });

export default function PricesPage() {
  const schemaOffers = [...unlimitedTariffs, ...visitTariffs].map((tariff) => ({
    "@type": "Offer",
    name: `Абонемент ${tariff.name}`,
    price: tariff.price.replace(/\s/g, ""),
    priceCurrency: "RUB",
    description: `${tariff.summary}. ${tariff.details.join(". ")}`,
    availability: "https://schema.org/InStock",
  }));
  return <><Header /><main className="inner-page"><JsonLd data={{ "@context": "https://schema.org", "@type": "OfferCatalog", name: "Тарифы открытого бассейна Наутилус", itemListElement: schemaOffers }} /><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Цены" }]} />
    <section className="inner-hero"><span className="section-kicker">Тарифы от {tariffDate}</span><h1>Плавайте чаще, платите меньше за месяц</h1><p>Выбирайте карту по частоте визитов и нужным услугам. Сауна, пляж и парковка включены в разные тарифы на разных условиях.</p></section>
    <section className="membership-offer">
      <div><span>Наш выбор для старта</span><h2>3 месяца безлимитного плавания</h2><p>50-метровый бассейн под открытым небом, баня после заплыва, пляж и парковка.</p></div>
      <div className="membership-offer-price"><strong>{featuredTariff.price} ₽</strong><span>за 90 дней</span><small>{featuredTariff.summary} при оплате всего абонемента</small></div>
      <ul><li>20 дней заморозки</li><li>Плавайте круглый год</li><li>Без подсчёта посещений</li></ul>
      <a className="button button-lime" href="#booking" data-booking data-goal="безлимит на 90 дней" data-form-name="Цены: безлимит на 90 дней" data-submit-label="Зафиксировать тариф">Зафиксировать тариф</a>
    </section>
    <section className="tariff-section"><div className="section-heading"><span className="section-kicker">Безлимитные карты</span><h2>Выберите срок</h2></div><div className="tariff-grid">
      {unlimitedTariffs.map((tariff) => <article className={`price-card${tariff.featured ? " featured-price" : ""}`} key={tariff.name}><span>{tariff.featured ? "Оптимальный старт" : "Безлимит"}</span><h3>{tariff.name}</h3><div className="price"><strong>{tariff.price}</strong><i>{tariff.unit}</i></div>{tariff.regularPrice && <p><s>{tariff.regularPrice} ₽</s> · цена до скидки</p>}<p>{tariff.summary}</p><ul>{tariff.details.map((detail) => <li className={detail.includes("не включен") ? "tariff-excluded" : undefined} key={detail}>{detail}</li>)}</ul><a className={tariff.featured ? "button button-lime" : "outline-button"} href="#booking" data-booking data-goal={`безлимит на ${tariff.name}`} data-form-name={`Цены: безлимит ${tariff.name}`}>Выбрать карту</a></article>)}
    </div></section>
    <section className="tariff-section"><div className="section-heading"><span className="section-kicker">Карты по посещениям</span><h2>Когда нужен фиксированный объём</h2></div><div className="price-grid">
      {visitTariffs.map((tariff) => <article className="price-card" key={tariff.name}><span>По посещениям</span><h3>{tariff.name}</h3><div className="price"><strong>{tariff.price}</strong><i>{tariff.unit}</i></div><p>{tariff.summary}</p><ul>{tariff.details.map((detail) => <li className={detail.includes("не включен") ? "tariff-excluded" : undefined} key={detail}>{detail}</li>)}</ul><a className="outline-button" href="#booking" data-booking data-goal={tariff.name.toLowerCase()} data-form-name={`Цены: ${tariff.name}`}>Уточнить условия</a></article>)}
    </div></section>
    <section className="comparison-note"><h2>Что входит в выбранную карту</h2><div><p><strong>20 посещений.</strong> {visitPackageTerms}</p><p><strong>30 дней безлимита.</strong> Сауна и пляж в подарок. Парковка не включена.</p><p><strong>Парковка.</strong> {parkingTerms}</p></div></section>
    <section className="comparison-note"><h2>Заморозка и скидки</h2><div><p><strong>Заморозка.</strong> {freezeTerms}</p><p><strong>Продление.</strong> При непрерывном продлении абонемента от 180 дней действует скидка 15% от стоимости на момент покупки.</p><p><strong>Скидки 10%.</strong> В день рождения, за 3 дня до и 3 дня после; на абонементы для льготных категорий при предъявлении подтверждающего документа.</p></div></section>
    <p className="tariff-disclaimer">Льготные категории: дети до 14 лет, пенсионеры по возрасту (женщины 60+, мужчины 65+), ветераны боевых действий, многодетные семьи и люди с инвалидностью. Скидки не суммируются и не распространяются на акции, разовые посещения, услуги тренера и дополнительные услуги.</p>
    <p className="tariff-disclaimer">Цены указаны по прайсу от {tariffDate}. Стоимость месяца приведена для сравнения при оплате всего абонемента. Срок действия акционных предложений и длительность сеанса уточните до покупки. При превышении оплаченного времени более чем на одну минуту по условиям прайса списывается следующее посещение. Информация на странице не является публичной офертой.</p>
    <PageCta title="Подберём карту под ваш график" text="Напишите, сколько раз в неделю хотите плавать. Сравним срок, заморозку и стоимость месяца." />
  </main><Footer /></>;
}
