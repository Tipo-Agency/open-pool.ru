import { ServiceVisitDetails } from "../../service-visit-details";
import { poolImageProps } from "../../pool-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCards, Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../../components";
import { getService, services, site, type Service } from "../../data";
import { createPageMetadata, SITE_URL } from "../../seo";
import { PoolOfferCard } from "../../pool-offer-card";
import { formatPoolPrice, poolOffer, poolOfferName, poolOfferVisitPrice } from "../../pool-offer";
import { membershipGuides } from "../../article-navigation";
import { SingleVsMembership } from "../../conversion";

export function generateStaticParams() { return services.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = getService(slug); if (!service) return {};
  return createPageMetadata({ title: slug === "abonementy" ? `Абонементы в бассейн Хабаровска: ${poolOfferVisitPrice} ₽ за визит` : service.title, description: service.description, path: `/uslugi/${service.slug}`, image: service.image });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const service = getService(slug); if (!service) notFound();
  return <ServiceView service={service} path={`/uslugi/${service.slug}`} crumbs={[{ label: "Главная", href: "/" }, { label: "Услуги", href: "/uslugi" }, { label: service.shortTitle }]} />;
}

export function ServiceView({ service, path, crumbs, extra }: { service: Service; path: string; crumbs: { label: string; href?: string }[]; extra?: { title: string; html: string }[] }) {
  const slug = service.slug;
  const membership = slug === "abonementy";
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", "@id": `${SITE_URL}${path}#service`, url: `${SITE_URL}${path}`, name: service.title, description: service.description, image: service.image, areaServed: { "@type": "City", name: site.city }, serviceType: service.shortTitle, provider: { "@type": "SportsActivityLocation", "@id": `${SITE_URL}/#pool`, name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressRegion: "Хабаровский край", addressCountry: "RU" } }, offers: { "@type": "Offer", url: `${SITE_URL}${path}`, priceCurrency: "RUB", description: service.price, availability: "https://schema.org/InStock" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
  ];
  return <><Header /><main className="inner-page"><JsonLd data={schema} /><Breadcrumbs items={crumbs} />
    <section className="service-detail-hero"><div><span className="section-kicker">{service.eyebrow}</span><h1>{service.title}</h1><p>{service.description}</p><div className="hero-actions"><a className="button" href="#booking" data-booking data-goal={membership ? `${poolOfferName}, ${formatPoolPrice(poolOffer.totalPrice)} ₽` : service.shortTitle} data-form-name={`Услуга: ${service.slug}`} data-submit-label={membership ? "Узнать условия абонемента" : "Уточнить запись"}>{membership ? "Хочу бассейн и баню" : "Узнать условия"}</a><strong className={membership ? "membership-hero-price" : undefined}>{membership ? <><span>{poolOfferVisitPrice} ₽ за визит</span><span>Абонемент {formatPoolPrice(poolOffer.totalPrice)} ₽</span></> : service.price}</strong></div></div><div><img {...poolImageProps(service.image, true)} alt={service.title} /><span>{membership ? `${poolOfferVisitPrice} ₽/визит при покупке ${poolOffer.visits} посещений` : service.price}</span></div></section>
    {membership && <PoolOfferCard formName="Абонементы: 30 посещений с баней" />}
    {slug === "razovoe-poseshchenie" && <SingleVsMembership source="razovoe" />}
    <section className="benefit-row">{service.benefits.map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</section>
    <section className="content-sections">{service.sections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></article>)}</section>
    {extra && <section className="content-sections landing-extra">{extra.map((section, index) => <article key={section.title}><span>0{service.sections.length + index + 1}</span><div><h2>{section.title}</h2><div dangerouslySetInnerHTML={{ __html: section.html }} /></div></article>)}</section>}
    <ServiceVisitDetails slug={service.slug} />
    {membership && <section className="related-articles"><div className="section-heading"><span className="section-kicker">Выберите под свой график</span><h2>Разбираем условия на примерах</h2></div><ArticleCards slugs={membershipGuides} limit={3} /></section>}
    <section className="faq-section"><div><span className="section-kicker">Короткие ответы</span><h2>Частые вопросы</h2></div><div>{service.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
    <PageCta title={`Записаться: ${service.shortTitle.toLowerCase()}`} text="Оставьте удобный контакт. Администратор уточнит время, стоимость и ответит на вопросы." />
  </main><Footer /></>;
}
