import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../../components";
import { getService, services, site } from "../../data";
import { createPageMetadata, SITE_URL } from "../../seo";

export function generateStaticParams() { return services.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = getService(slug); if (!service) return {};
  return createPageMetadata({ title: service.title, description: service.description, path: `/uslugi/${service.slug}`, image: service.image });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const service = getService(slug); if (!service) notFound();
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", "@id": `${SITE_URL}/uslugi/${service.slug}#service`, url: `${SITE_URL}/uslugi/${service.slug}`, name: service.title, description: service.description, image: service.image, areaServed: { "@type": "City", name: site.city }, serviceType: service.shortTitle, provider: { "@type": "SportsActivityLocation", "@id": `${SITE_URL}/#pool`, name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressRegion: "Хабаровский край", addressCountry: "RU" } }, offers: { "@type": "Offer", url: `${SITE_URL}/uslugi/${service.slug}`, priceCurrency: "RUB", description: service.price, availability: "https://schema.org/InStock" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
  ];
  return <><Header /><main className="inner-page"><JsonLd data={schema} /><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги", href: "/uslugi" }, { label: service.shortTitle }]} />
    <section className="service-detail-hero"><div><span className="section-kicker">{service.eyebrow}</span><h1>{service.title}</h1><p>{service.description}</p><div className="hero-actions"><a className="button" href="#booking" data-booking>Узнать условия</a><strong>{service.price}</strong></div></div><div><img src={service.image} alt={service.title} /><span>{service.price}</span></div></section>
    <section className="benefit-row">{service.benefits.map((item, index) => <div key={item}><b>0{index + 1}</b><span>{item}</span></div>)}</section>
    <section className="content-sections">{service.sections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></article>)}</section>
    <section className="faq-section"><div><span className="section-kicker">Короткие ответы</span><h2>Частые вопросы</h2></div><div>{service.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
    <PageCta title={`Записаться: ${service.shortTitle.toLowerCase()}`} text="Оставьте удобный контакт. Администратор уточнит время, стоимость и ответит на вопросы." />
  </main><Footer /></>;
}
