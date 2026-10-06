import { poolImageProps } from "../../pool-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCards, Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../../components";
import { articles, getArticle, getArticleImage, getService, services, site } from "../../data";
import { createPageMetadata, SITE_URL } from "../../seo";

export function generateStaticParams() { return articles.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const article = getArticle(slug); if (!article) return {};
  const image = getArticleImage(article);
  return createPageMetadata({ title: article.title, description: article.description, path: `/blog/${article.slug}`, image, type: "article", publishedTime: article.date });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = getArticle(slug); if (!article) notFound();
  const published = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.date));
  const articleImage = getArticleImage(article);
  const articleImageUrl = articleImage.startsWith("/") ? `${SITE_URL}${articleImage}` : articleImage;
  const serviceSlugsByCategory: Record<string, string[]> = {
    "Детям": ["plavanie-dlya-detey", "abonementy", "razovoe-poseshchenie"],
    "Реабилитация": ["svobodnoe-plavanie", "obuchenie-plavaniyu-vzroslyh", "razovoe-poseshchenie"],
    "60+": ["akvaaerobika", "svobodnoe-plavanie", "abonementy"],
    "Техника": ["obuchenie-plavaniyu-vzroslyh", "svobodnoe-plavanie", "abonementy"],
    "Начинающим": ["obuchenie-plavaniyu-vzroslyh", "razovoe-poseshchenie", "abonementy"],
    "Здоровье": ["svobodnoe-plavanie", "akvaaerobika", "abonementy"],
    "Гид по бассейну": ["razovoe-poseshchenie", "svobodnoe-plavanie", "abonementy"],
  };
  const relatedServices = (serviceSlugsByCategory[article.category] ?? [])
    .map((serviceSlug) => services.find((service) => service.slug === serviceSlug))
    .filter((service) => service !== undefined);
  const contextualService = article.cta?.startsWith("/uslugi/") ? getService(article.cta.slice("/uslugi/".length)) : undefined;
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", "@id": `${SITE_URL}/blog/${article.slug}#article`, headline: article.title, description: article.description, image: articleImageUrl, datePublished: article.date, dateModified: article.modified ?? article.date, inLanguage: "ru-RU", mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`, articleSection: article.category, keywords: [article.category, "плавание", "бассейн Хабаровск"], isPartOf: { "@id": `${SITE_URL}/blog#collection` }, about: { "@id": `${SITE_URL}/#pool` }, author: { "@type": "Organization", name: article.editorial ? "Редакция сайта «Наутилус»" : "Тренерская команда бассейна «Наутилус»", url: `${SITE_URL}/o-basseyne` }, publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: "Открытый бассейн «Наутилус»", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-nautilus.svg` } } },
    ...(article.faq.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }] : []),
  ];
  return <><Header /><main className="article-page"><JsonLd data={schemas} /><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Журнал", href: "/blog" }, { label: article.title }]} />
    <article><header className="article-header"><div className="article-meta"><span>{article.category}</span><span>{article.readTime}</span><span>{published}</span>{article.modified && <span>Обновлено: {new Intl.DateTimeFormat("ru-RU").format(new Date(article.modified))}</span>}</div><h1>{article.title}</h1><p>{article.description}</p></header><figure className="article-hero-image"><img {...poolImageProps(articleImage, true, "(max-width: 900px) 100vw, 900px")} alt={article.title} /></figure>
      <div className="article-answer"><span>Короткий ответ</span><p>{article.answer}</p></div>
      {contextualService && <aside className="article-local-cta" aria-label="Занятия в Хабаровске">
        <div><span>Наутилус, Хабаровск</span><strong>{contextualService.shortTitle}</strong><p>Открытый бассейн на Советской, 1 к4. {contextualService.price === "по расписанию" ? "Время и стоимость занятия уточнит администратор." : `Стоимость ${contextualService.price}. Условия посещения уточнит администратор.`}</p></div>
        <div className="article-local-cta-actions"><a className="button button-lime" href={article.cta}>Посмотреть условия</a><a href="#booking" data-booking data-goal={contextualService.shortTitle} data-form-name={`Статья: ${article.slug}`} data-submit-label="Уточнить запись">Уточнить запись</a></div>
      </aside>}
      {article.diagram && <figure className="article-guide-image"><img src={article.diagram} alt="Памятка по теме статьи" width="1200" height="630" loading="lazy" /></figure>}
      <div className="article-body"><aside><strong>В этой статье</strong>{article.sections.map((section) => <a key={section.title} href={`#${section.title.toLowerCase().replaceAll(" ", "-")}`}>{section.title}</a>)}</aside><div className="article-content">
        {article.sections.map((section) => <section key={section.title} id={section.title.toLowerCase().replaceAll(" ", "-")}><h2>{section.title}</h2>{section.html ? <div dangerouslySetInnerHTML={{ __html: section.html }} /> : section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        {article.checklist.length > 0 && <section className="checklist"><h2>Проверьте перед тренировкой</h2><ul>{article.checklist.map((item) => <li key={item}>{item}</li>)}</ul></section>}
        {article.faq.length > 0 && <section className="article-faq"><h2>Частые вопросы</h2>{article.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</section>}
        <div className="expert-note"><strong>{article.editorial ? "Материал редакции сайта «Наутилус»" : "Материал подготовлен командой «Наутилуса»"}</strong><p>Статья носит информационный характер. При заболеваниях, боли или длительном перерыве обсудите нагрузку с врачом и тренером.</p></div>
      </div></div>
    </article>
    <section className="article-service-section"><div className="section-heading"><span className="section-kicker">Перейти к практике</span><h2>Подходящие форматы плавания</h2></div><div className="article-service-links">{relatedServices.map((service) => <a key={service.slug} href={`/uslugi/${service.slug}`}><span>{service.eyebrow}</span><strong>{service.shortTitle}</strong><small>{service.price}</small></a>)}</div></section>
    <section className="related-articles"><div className="section-heading"><span className="section-kicker">Читайте дальше</span><h2>Ещё о плавании</h2></div><ArticleCards limit={3} exclude={article.slug} /></section>
    <PageCta title="Перейдите от чтения к воде" text="Подберём первое посещение, группу или абонемент под ваш уровень и график." />
    {contextualService && <nav className="article-mobile-cta" aria-label="Быстрый переход к занятиям"><a href={article.cta}>Занятия в Хабаровске</a><a href={`tel:${site.phoneHref}`}>Позвонить</a></nav>}
  </main><Footer /></>;
}
