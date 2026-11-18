import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articlesInCategory, blogCategories, categoryBySlug } from "../../../blog-data";
import { createPageMetadata } from "../../../seo";
import { BlogListing } from "../../blog-listing";

export function generateStaticParams() {
  return blogCategories.filter((item) => articlesInCategory(item.name).length).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = categoryBySlug((await params).slug);
  if (!category || !articlesInCategory(category.name).length) return {};
  return createPageMetadata({ title: `${category.name}: статьи о плавании`, description: category.description, path: `/blog/tema/${category.slug}` });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = categoryBySlug((await params).slug);
  if (!category) notFound();
  const items = articlesInCategory(category.name);
  if (!items.length) notFound();
  return <BlogListing kicker={`Рубрика · ${items.length} статей`} title={category.name} text={category.description} crumbs={[{ label: "Главная", href: "/" }, { label: "Журнал", href: "/blog" }, { label: category.name }]} items={items} path={`/blog/tema/${category.slug}`} activeCategory={category.slug} />;
}
