import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../components";
import { services, site } from "../data";
import { createPageMetadata, SITE_URL } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Услуги открытого бассейна в Хабаровске", description: "Свободное плавание, разовые посещения, абонементы, аквааэробика, обучение взрослых и детские группы в открытом бассейне Хабаровска.", path: "/uslugi" });

export default function ServicesPage() {
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги" }]} />
    <section className="inner-hero"><span className="section-kicker">Плавание для каждого</span><h1>Услуги открытого бассейна</h1><p>Большая вода для самостоятельных заплывов, системных тренировок и обучения с тренером.</p></section>
    <section className="service-listing">{services.map((item, index) => <article className="service-list-card" key={item.slug}><div className="service-list-image"><img src={item.image} alt={item.shortTitle} /><span>0{index + 1}</span></div><div><span className="section-kicker">{item.eyebrow}</span><h2>{item.shortTitle}</h2><p>{item.description}</p><ul>{item.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><div className="service-list-actions"><a className="button" href={`/uslugi/${item.slug}`}>Узнать подробнее</a><strong>{item.price}</strong></div></div></article>)}</section>
    <PageCta />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: services.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/uslugi/${item.slug}`, name: item.title })), name: `Услуги ${site.name}` }} />
  </main><Footer /></>;
}
