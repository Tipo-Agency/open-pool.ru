import type { Metadata } from "next";
import { ArticleCards, Breadcrumbs, Footer, Header, JsonLd } from "../components";
import { articles } from "../data";
import { createPageMetadata, SITE_URL } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Журнал о плавании", description: "Практические статьи о плавании: выбор абонемента, обучение взрослых, детские группы и подготовка к бассейну в Хабаровске.", path: "/blog" });

export default function BlogPage() {
  const categories = Array.from(new Set(articles.map((item) => item.category)));
  return <><Header /><main className="inner-page"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Журнал" }]} />
    <section className="inner-hero blog-hero"><span className="section-kicker">База знаний</span><h1>Плавание понятно и по делу</h1><p>{articles.length} материалов о технике, восстановлении, детском развитии, здоровье и плавании после 60 лет.</p><div className="category-pills">{categories.map((category) => <span key={category}>#{category}</span>)}</div></section>
    <ArticleCards />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${SITE_URL}/blog#collection`, url: `${SITE_URL}/blog`, name: "Журнал о плавании", description: "Практические материалы о плавании для взрослых, детей, начинающих и людей старшего возраста.", inLanguage: "ru-RU", hasPart: articles.map((item) => ({ "@type": "Article", headline: item.title, url: `${SITE_URL}/blog/${item.slug}`, datePublished: item.date })) }} />
  </main><Footer /></>;
}
