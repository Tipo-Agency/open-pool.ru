import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPage, blogPageCount, blogPagePath } from "../../../blog-data";
import { createPageMetadata } from "../../../seo";
import { BlogListing } from "../../blog-listing";

const parsePage = (value: string) => /^\d+$/.test(value) ? Number(value) : NaN;

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, blogPageCount - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (!(page >= 2 && page <= blogPageCount)) return {};
  return createPageMetadata({ title: `Журнал о плавании: страница ${page}`, description: `Статьи о плавании в открытом бассейне Хабаровска, страница ${page} из ${blogPageCount}: техника, здоровье, абонементы, занятия для детей и взрослых.`, path: blogPagePath(page) });
}

export default async function BlogPageN({ params }: { params: Promise<{ page: string }> }) {
  const page = parsePage((await params).page);
  if (!(page >= 2 && page <= blogPageCount)) notFound();
  return <BlogListing kicker={`Страница ${page} из ${blogPageCount}`} title="Журнал о плавании" text="Свежие материалы идут первыми. Выберите тему выше, чтобы увидеть все статьи рубрики." crumbs={[{ label: "Главная", href: "/" }, { label: "Журнал", href: "/blog" }, { label: `Страница ${page}` }]} items={blogPage(page)} path={blogPagePath(page)} page={page} />;
}
