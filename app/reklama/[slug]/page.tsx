import { poolImageProps } from "../../pool-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandLogo } from "../../brand-logo";
import { Footer, JsonLd, YandexMap } from "../../components";
import { site } from "../../data";
import { LeadForm } from "../../lead-form";
import { createPageMetadata, SITE_URL } from "../../seo";
import { adLandings, getAdLanding } from "../data";
import { parkingTerms } from "../../pricing-data";

export function generateStaticParams() {
  return adLandings.map((landing) => ({ slug: landing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const landing = getAdLanding(slug);
  if (!landing) return {};
  return createPageMetadata({
    title: landing.title,
    description: landing.description,
    path: `/reklama/${landing.slug}`,
    image: landing.image,
    index: false,
  });
}

export default async function AdLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landing = getAdLanding(slug);
  if (!landing) notFound();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/reklama/${landing.slug}#service`,
      url: `${SITE_URL}/reklama/${landing.slug}`,
      name: landing.title,
      description: landing.description,
      provider: { "@type": "SportsActivityLocation", "@id": `${SITE_URL}/#pool`, name: site.name },
      areaServed: { "@type": "City", name: site.city },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: landing.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <div className="pool-landing">
      <JsonLd data={schema} />
      <header className="pool-header">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" aria-label="Наутилус, главная"><BrandLogo /></a>
        <div><span>Хабаровск, Советская, 1 к4</span><a href={`tel:${site.phoneHref}`}>{site.phone}</a></div>
      </header>
      <main>
        <section className="pool-hero">
          <img {...poolImageProps(landing.image, true, "100vw")} alt={landing.title} />
          <div className="pool-hero-shade" />
          <div className="pool-hero-copy">
            <span>{landing.eyebrow}</span>
            {landing.promotion && <p className="pool-promotion-deadline">{landing.promotion.deadlineLabel}</p>}
            <h1>{landing.title}</h1>
            <p>{landing.description}</p>
            <strong>{landing.price}</strong>
            <a className="button button-lime pool-mobile-cta" href="#pool-lead-form">{landing.cta}</a>
            {landing.offerTerms && <p className="pool-offer-terms">{landing.offerTerms}</p>}
            <div className="pool-hero-facts">{landing.proof.map((item) => <b key={item}>{item}</b>)}</div>
          </div>
          <div className="pool-hero-form" id="pool-lead-form">
            <div><span>Ответим в рабочее время</span><h2>{landing.cta}</h2><p>{landing.formDescription ?? "Оставьте имя и телефон. Администратор уточнит цену, время и условия первого визита."}</p></div>
            <LeadForm
              formName={landing.formName}
              defaultGoal={landing.goal}
              hideGoal
              compact
              submitLabel={landing.cta}
              note="Нажимая кнопку, вы отправляете контакт администратору бассейна."
            />
          </div>
        </section>

        <section className="pool-benefits">
          {landing.benefits.map((benefit, index) => <article key={benefit.title}><span>0{index + 1}</span><h2>{benefit.title}</h2><p>{benefit.text}</p></article>)}
        </section>
        <p className="tariff-disclaimer">{landing.amenityNote ?? `Состав услуг зависит от выбранного тарифа. ${parkingTerms}`} <a href="/ceny">Сравнить тарифы</a></p>

        <section className="pool-proof-section">
          <div><span className="section-kicker">Наутилус в Хабаровске</span><h2>Большая вода, свежий воздух и понятный первый шаг</h2><p>Бассейн работает круглый год. Перед визитом администратор подтвердит актуальный слот и ответит на вопросы по подготовке.</p><ul><li>Будни 06:00-22:00</li><li>Выходные 07:00-22:00</li><li>Восемь дорожек по 50 метров</li><li>Сауна и парковка: условия зависят от тарифа</li></ul><a className="text-link" href={landing.serviceHref}>Подробнее об услуге <span>→</span></a></div>
          <div className="pool-map-card"><YandexMap large /><strong>Советская улица, 1 к4</strong></div>
        </section>

        <section className="pool-faq">
          <div><span className="section-kicker">Перед первым визитом</span><h2>Ответы на частые вопросы</h2></div>
          <div>{landing.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div>
        </section>

        <section className="pool-final-cta">
          <div><span>Первый шаг займёт меньше минуты</span><h2>{landing.cta}</h2><p>Администратор свяжется с вами, уточнит задачу и предложит подходящий вариант.</p></div>
          <a className="button button-lime" href="#booking" data-booking data-goal={landing.goal} data-form-name={landing.formName} data-submit-label={landing.cta}>{landing.cta}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
