import type { Metadata } from "next";
import { blogPage } from "../blog-data";
import { createPageMetadata } from "../seo";
import { BlogListing, totalArticles } from "./blog-listing";

export const metadata: Metadata = createPageMetadata({ title: "Журнал о плавании", description: "Практические статьи о плавании: выбор абонемента, обучение взрослых, детские группы, здоровье и подготовка к открытому бассейну в Хабаровске.", path: "/blog" });

export default function BlogPage() {
  return <BlogListing kicker="Журнал Наутилуса" title="Плавание понятно и по делу" text={`${totalArticles} материалов: как выбрать абонемент, подготовиться к визиту в открытый бассейн в Хабаровске и разобраться в плавании.`} crumbs={[{ label: "Главная", href: "/" }, { label: "Журнал" }]} items={blogPage(1)} path="/blog" page={1} />;
}
