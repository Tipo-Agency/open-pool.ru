/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { ArticleCards, Footer, Header, JsonLd, YandexMap } from "./components";
import { images, services, site } from "./data";
import { PoolQuiz } from "./pool-quiz";
import { featuredTariff, parkingTerms } from "./pricing-data";
import { createPageMetadata, SITE_URL } from "./seo";

export const metadata: Metadata = createPageMetadata({
  title: "Открытый бассейн в Хабаровске",
  description: "Плавание под открытым небом круглый год. 8 дорожек по 50 метров, вода +28 °C, баня, пляж и парковка. Разовое посещение от 500 ₽.",
  path: "/",
});

const localBusiness = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: site.name,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-nautilus.svg` },
      sameAs: [site.vk, site.instagram, site.telegram],
    },
    {
      "@type": ["SportsActivityLocation", "LocalBusiness"],
      "@id": `${SITE_URL}/#pool`,
      name: site.name,
      image: `${SITE_URL}/og.png`,
      logo: `${SITE_URL}/logo-nautilus.svg`,
      url: SITE_URL,
      telephone: site.phone,
      priceRange: "₽₽",
      address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressRegion: "Хабаровский край", postalCode: "680028", addressCountry: "RU" },
      geo: { "@type": "GeoCoordinates", latitude: 48.480725, longitude: 135.044464 },
      hasMap: "https://yandex.ru/maps/?text=Хабаровск%2C%20Советская%201%20к4",
      sameAs: [site.vk, site.instagram, site.telegram],
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "06:00", closes: "22:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "07:00", closes: "22:00" },
      ],
      amenityFeature: ["50-метровый бассейн", "8 дорожек", "Баня", "Пляж", "Парковка"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Услуги открытого бассейна",
        itemListElement: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.title, url: `${SITE_URL}/uslugi/${service.slug}` } })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: site.name,
      inLanguage: "ru-RU",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Открытый бассейн в Хабаровске",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#pool` },
      inLanguage: "ru-RU",
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={localBusiness} />
      <div className="home-page">
        <Header />
        <main>
          <section className="hero hero-v2">
            <img className="hero-backdrop" src={images.pool} alt="Открытый 50-метровый бассейн Наутилус в Хабаровске" />
            <div className="hero-shade" />
            <div className="hero-orbit" aria-label="Температура воды около плюс двадцати восьми градусов">
              <span>вода</span><strong>+28°</strong><i>круглый год</i>
            </div>
            <div className="hero-stage">
              <div className="hero-index"><span>27°28′ с. ш.</span><span>Хабаровск</span><span>06:00-22:00</span></div>
              <h1>
                <span className="hero-line hero-line-top">50 метров</span>
                <span className="hero-line hero-line-accent">свободы</span>
                <span className="hero-line hero-line-bottom">под открытым небом</span>
              </h1>
              <div className="hero-v2-bottom">
                <p>Открытый бассейн в центре Хабаровска. Восемь дорожек, тёплая вода, баня и пляж. Плывём каждый день.</p>
                <div className="hero-actions">
                  <a className="button button-lime hero-primary" href="#booking" data-booking>Выбрать свой заплыв <span>↗</span></a>
                  <a className="hero-price-link" href="#booking" data-booking><span>разово от</span><strong>500 ₽</strong></a>
                </div>
              </div>
              <div className="hero-rail" aria-label="Главные преимущества">
                <span><b>08</b> дорожек</span><span><b>50</b> метров</span><span><b>365</b> дней</span>
              </div>
            </div>
          </section>

          <section className="pulse-strip" aria-label="Преимущества бассейна">
            <div className="pulse-track">
              {[0, 1].map((group) => <div className="pulse-group" aria-hidden={group === 1} key={group}>
                <span>50 метров</span><i>✦</i><span>вода +28 °C</span><i>✦</i><span>8 дорожек</span><i>✦</i><span>баня после заплыва</span><i>✦</i><span>365 дней в году</span><i>✦</i>
              </div>)}
            </div>
          </section>

          <section className="manifesto">
            <div className="manifesto-heading">
              <span className="section-kicker">Плавание без потолка</span>
              <span>01 / опыт</span>
            </div>
            <p className="manifesto-statement">Пока город мёрзнет, <span>вы плывёте</span> свои 50 метров в тёплой воде</p>
            <div className="manifesto-grid">
              <div className="manifesto-image"><img src={images.swim} alt="Пловец на дорожке открытого бассейна" /><span>Свежий воздух<br />вместо потолка</span></div>
              <div className="manifesto-stat"><strong>365</strong><span>дней открыты<br />для плавания</span></div>
              <div className="manifesto-copy"><b>Зима здесь выглядит иначе</b><p>Пар над водой, снег на бортике и длинная дорожка впереди. После заплыва вас ждёт горячая баня. Летом к ней добавляется пляж с лежаками.</p><a className="text-link" href="/o-basseyne">Почувствовать атмосферу <span>→</span></a></div>
            </div>
          </section>

        <section className="section services-section" id="services">
          <div className="section-heading split-heading">
            <div><span className="section-kicker">Выберите свой формат</span><h2>Вода для каждой цели</h2></div>
            <p>Прийти на один заплыв, тренироваться регулярно, поставить технику или записать ребёнка. Собрали понятные варианты под разные задачи.</p>
          </div>
          <div className="service-grid">
            {services.map((item, index) => (
              <article className={`service-card service-card-${index + 1}`} key={item.slug}>
                <img src={item.image} alt={`${item.shortTitle} в открытом бассейне Наутилус`} />
                <div className="service-overlay" />
                <span className="service-number">0{index + 1}</span>
                <div className="service-card-body">
                  <span>{item.eyebrow}</span>
                  <h3>{item.shortTitle}</h3>
                  <p>{item.price}</p>
                  <a href={`/uslugi/${item.slug}`} aria-label={`Подробнее: ${item.shortTitle}`}>→</a>
                </div>
              </article>
            ))}
          </div>
          <a className="outline-button" href="/uslugi">Посмотреть все услуги</a>
        </section>

        <PoolQuiz />

        <section className="feature-band">
          <div className="feature-copy">
            <span className="section-kicker">Почему сюда возвращаются</span>
            <h2>Большая вода<br />Свежий воздух<br />Ваш ритм</h2>
            <p>Плывите длинные серии без частых разворотов. После дорожки прогрейтесь в бане, а летом отдохните на пляже.</p>
            <a className="button button-lime" href="/o-basseyne">Узнать о бассейне</a>
          </div>
          <div className="feature-image"><img src={images.evening} alt="Вечернее плавание в открытом бассейне" /><span>50 м</span></div>
          <div className="feature-list">
            <div><b>01</b><strong>Настоящая спортивная дистанция</strong><p>50 метров от бортика до бортика. Меньше разворотов, больше плавания.</p></div>
            <div><b>02</b><strong>Комфорт круглый год</strong><p>Поддерживаем температуру воды около +28 °C даже зимой.</p></div>
            <div><b>03</b><strong>Инфраструктура для отдыха</strong><p>На территории есть сауна, пляж и парковка. Включённые услуги зависят от выбранного тарифа.</p></div>
          </div>
        </section>

        <section className="section pricing-preview" id="passes">
          <div className="section-heading centered-heading"><span className="section-kicker">Цены без квеста</span><h2>Начните с удобного варианта</h2><p>Точная стоимость клубной карты зависит от срока и режима посещений. Ниже простые точки входа.</p></div>
          <div className="price-grid">
            <article className="price-card"><span>Один визит</span><h3>Разовое посещение</h3><div className="price"><strong>от 500</strong><i>₽</i></div><ul><li>Плавание</li><li>Раздевалки и душевые</li><li>Парковка не включена</li><li>Условия посещения сауны и пляжа уточните отдельно</li></ul><a className="outline-button" href="#booking" data-booking>Узнать условия</a></article>
            <article className="price-card featured-price"><span>Оптимальный старт</span><h3>Безлимит на 90 дней</h3><div className="price"><strong>{featuredTariff.price}</strong><i>₽</i></div><p>{featuredTariff.summary} при оплате за 90 дней</p><ul>{featuredTariff.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><a className="button button-lime" href="#booking" data-booking data-goal="безлимит на 90 дней" data-form-name="Главная: безлимит на 90 дней" data-submit-label="Зафиксировать тариф">Зафиксировать тариф</a></article>
            <article className="price-card"><span>С тренером</span><h3>Групповые занятия</h3><div className="price"><strong>по запросу</strong></div><ul><li>Группа по уровню</li><li>План тренировки</li><li>Обратная связь тренера</li></ul><a className="outline-button" href="/raspisanie">Смотреть расписание</a></article>
          </div>
          <p className="tariff-disclaimer">{parkingTerms} <a href="/ceny">Все тарифы и включённые услуги</a></p>
        </section>

        <section className="lead-section">
          <div className="lead-copy">
            <span className="section-kicker light-kicker">Подберём за несколько минут</span>
            <h2>Расскажите, как хотите плавать</h2>
            <p>Сравним варианты, посчитаем стоимость посещения и подскажем спокойное время для первого визита.</p>
            <div className="lead-contact"><span>Можно сразу позвонить</span><a href={`tel:${site.phoneHref}`}>{site.phone}</a></div>
          </div>
          <div className="lead-options">
            <span>Первый шаг</span>
            <strong>Выберите цель и оставьте контакт</strong>
            <p>Форма откроется поверх страницы. Администратор поможет с ценой, временем и подходящей группой.</p>
            <a className="button button-lime" href="#booking" data-booking>Открыть форму</a>
          </div>
        </section>

        <section className="app-section">
          <div className="app-phone" aria-hidden="true"><div className="app-phone-screen"><img className="app-phone-logo" src="/logo-nautilus.svg" alt="" /><b>Сегодня</b><div>Свободное плавание<small>06:00-22:00</small></div><div>Моя карта<small>Активна</small></div><i>Записаться</i></div></div>
          <div className="app-copy"><span className="section-kicker">Наутилус в телефоне</span><h2>Расписание и запись в приложении</h2><p>Проверяйте актуальные занятия, записывайтесь и отменяйте визит, получайте напоминания и следите за сроком клубной карты.</p><ul><li>Актуальное расписание</li><li>Быстрая запись и отмена</li><li>Напоминания о тренировках</li><li>Контроль карты и услуг</li></ul><div className="app-buttons"><a href={site.appStore} target="_blank" rel="noreferrer">Загрузить в App Store</a><a href={site.googlePlay} target="_blank" rel="noreferrer">Скачать в Google Play</a></div></div>
        </section>

        <section className="section journal-preview">
          <div className="section-heading split-heading">
            <div><span className="section-kicker">Журнал о плавании</span><h2>Разбираем по делу</h2></div>
            <p>Техника, здоровье, экипировка и первые тренировки. Материалы отвечают на вопросы, которые обычно задают тренеру и администратору.</p>
          </div>
          <ArticleCards limit={6} />
          <a className="outline-button" href="/blog">Все статьи</a>
        </section>

        <section className="contact-band">
          <div><span className="section-kicker">Мы в центре Хабаровска</span><h2>Советская, 1 к4</h2><p>{site.hours}</p><div className="hero-actions"><a className="button button-lime" href="https://yandex.ru/maps/?text=Хабаровск%2C%20Советская%201%20к4">Построить маршрут</a><a className="text-link light-link" href={`tel:${site.phoneHref}`}>{site.phone} <span>→</span></a></div></div>
          <YandexMap />
        </section>
          <aside className="mobile-sticky-cta" aria-label="Быстрая запись">
            <a href={`tel:${site.phoneHref}`}>Позвонить</a>
            <a href="#booking" data-booking>Выбрать заплыв</a>
          </aside>
        </main>
      </div>
      <Footer />
    </>
  );
}
