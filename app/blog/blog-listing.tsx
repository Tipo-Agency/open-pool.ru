/* eslint-disable @next/next/no-html-link-for-pages */
import { ArticleCards, Breadcrumbs, Footer, Header, JsonLd } from "../components";
import type { Article } from "../data";
import { articles } from "../data";
import { blogCategories, blogPageCount, blogPagePath, articlesInCategory } from "../blog-data";
import { SITE_URL } from "../seo";

export function CategoryPills({ active }: { active?: string }) {
  return <nav className="category-pills" aria-label="Темы журнала">
    <a href="/blog" aria-current={active ? undefined : "page"}>Все статьи</a>
    {blogCategories.filter((item) => articlesInCategory(item.name).length).map((item) => <a key={item.slug} href={`/blog/tema/${item.slug}`} aria-current={active === item.slug ? "page" : undefined}>{item.name} <small>{articlesInCategory(item.name).length}</small></a>)}
  </nav>;
}

export function BlogPagination({ page }: { page: number }) {
  if (blogPageCount < 2) return null;
  const pages = Array.from({ length: blogPageCount }, (_, index) => index + 1);
  return <nav className="blog-pagination" aria-label="Страницы журнала">
    {page > 1 && <a href={blogPagePath(page - 1)} rel="prev">← Назад</a>}
    {pages.map((item) => item === page ? <span key={item} aria-current="page">{item}</span> : <a key={item} href={blogPagePath(item)}>{item}</a>)}
    {page < blogPageCount && <a href={blogPagePath(page + 1)} rel="next">Дальше →</a>}
  </nav>;
}

export function BlogListing({ kicker, title, text, crumbs, items, path, page, activeCategory }: { kicker: string; title: string; text: string; crumbs: { label: string; href?: string }[]; items: Article[]; path: string; page?: number; activeCategory?: string }) {
  return <><Header /><main className="inner-page"><Breadcrumbs items={crumbs} />
    <section className="inner-hero blog-hero"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{text}</p><CategoryPills active={activeCategory} /></section>
    <section className="blog-topic"><ArticleCards items={items} /></section>
    {page && <BlogPagination page={page} />}
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${SITE_URL}${path}#collection`, url: `${SITE_URL}${path}`, name: title, description: text, inLanguage: "ru-RU", isPartOf: { "@id": `${SITE_URL}/blog#collection` }, hasPart: items.map((item) => ({ "@type": "Article", headline: item.title, url: `${SITE_URL}/blog/${item.slug}`, datePublished: item.date })) }} />
  </main><Footer /></>;
}

export const totalArticles = articles.length;
