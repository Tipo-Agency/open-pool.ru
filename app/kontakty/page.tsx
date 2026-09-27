import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, JsonLd, YandexMap } from "../components";
import { site } from "../data";
import { createPageMetadata, SITE_URL } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Контакты бассейна Наутилус в Хабаровске", description: "Адрес, телефон, часы работы и маршрут до открытого бассейна «Наутилус»: Хабаровск, Советская улица, 1 к4.", path: "/kontakty" });

export default function ContactsPage() {
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
    <section className="inner-hero"><span className="section-kicker">Приезжайте плавать</span><h1>Бассейн в центре Хабаровска</h1><p>Советская улица, 1 к4. На территории есть большая парковка со шлагбаумом.</p></section>
    <section className="contact-layout"><div className="contact-details"><div><span>Адрес</span><h2>{site.address}</h2><a className="text-link" href="https://yandex.ru/maps/?text=Хабаровск%2C%20Советская%201%20к4">Открыть в Яндекс Картах <span>→</span></a></div><div><span>Телефон и сообщения</span><h2><a href={`tel:${site.phoneHref}`}>{site.phone}</a></h2><div className="social-links"><a href={site.vkMessages}>VK сообщения</a><a href={site.max}>MAX</a><a href={site.instagram}>Instagram</a><a href={site.vk}>VK</a></div></div><div><span>Часы работы</span><h2>Будни 06:00-22:00<br />Выходные 07:00-22:00</h2></div></div><YandexMap large /></section>
    <section className="arrival-grid"><article><b>На машине</b><p>Заезжайте к комплексу со стороны Советской улицы. Для посетителей работает парковка со шлагбаумом.</p></article><article><b>Перед первым визитом</b><p>Позвоните администратору. Вам подскажут загрузку дорожек, документы и правила прохода.</p></article><article><b>Что взять</b><p>Купальный костюм, шапочку, сланцы, полотенце, очки и средства для душа.</p></article></section>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", "@id": `${SITE_URL}/kontakty#webpage`, url: `${SITE_URL}/kontakty`, mainEntity: { "@type": "SportsActivityLocation", "@id": `${SITE_URL}/#pool`, name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressRegion: "Хабаровский край", postalCode: "680028", addressCountry: "RU" }, geo: { "@type": "GeoCoordinates", latitude: 48.480725, longitude: 135.044464 } } }} />
  </main><Footer /></>;
}
