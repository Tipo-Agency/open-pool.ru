/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { Footer, Header } from "./components";
import { site } from "./data";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false, follow: true } };

export default function NotFound() {
  return <><Header /><main className="inner-page"><section className="inner-hero"><span className="section-kicker">Ошибка 404</span><h1>Такой страницы нет</h1><p>Возможно, ссылка устарела или в адресе опечатка. Начните с главной, посмотрите цены или журнал о плавании. Если искали что-то конкретное, позвоните администратору: <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.</p>
    <nav className="category-pills" aria-label="Полезные разделы"><a href="/">Главная</a><a href="/ceny">Цены</a><a href="/uslugi">Услуги</a><a href="/raspisanie">Расписание</a><a href="/blog">Журнал</a><a href="/kontakty">Контакты</a></nav></section></main><Footer /></>;
}
