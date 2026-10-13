import type { Metadata } from "next";
import { ArticleCards, Breadcrumbs, Footer, Header, JsonLd } from "../components";
import { articles } from "../data";
import { createPageMetadata, SITE_URL } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Журнал о плавании", description: "Практические статьи о плавании: выбор абонемента, обучение взрослых, детские группы и подготовка к бассейну в Хабаровске.", path: "/blog" });

export default function BlogPage() {
  const categories = Array.from(new Set(articles.map((item) => item.category))).sort((a, b) => Number(b === "Гид по бассейну") - Number(a === "Гид по бассейну"));
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Журнал" }]} />
    <section className="inner-hero blog-hero"><span className="section-kicker">Журнал Наутилуса</span><h1>Плавание понятно и по делу</h1><p>{articles.length} материалов: как выбрать абонемент, подготовиться к визиту в Хабаровске и разобраться в плавании.</p><nav className="category-pills" aria-label="Темы журнала">{categories.map((category, index) => <a href={`#topic-${index}`} key={category}>{category}</a>)}</nav></section>
    {categories.map((category, index) => <section className="blog-topic" id={`topic-${index}`} key={category}><h2>{category}</h2><ArticleCards category={category} /></section>)}
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${SITE_URL}/blog#collection`, url: `${SITE_URL}/blog`, name: "Журнал о плавании", description: "Практические материалы о плавании для взрослых, детей, начинающих и людей старшего возраста.", inLanguage: "ru-RU", hasPart: articles.map((item) => ({ "@type": "Article", headline: item.title, url: `${SITE_URL}/blog/${item.slug}`, datePublished: item.date })) }} />
  </main><Footer /></>;
}
