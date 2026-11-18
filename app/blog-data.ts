import { articles, type Article } from "./data";

// Рубрики и страницы журнала. Адреса рубрик: /blog/tema/<slug>, страницы ленты: /blog/stranica/<n>.
export const BLOG_PAGE_SIZE = 12;

export const blogCategories: { name: Article["category"]; slug: string; description: string }[] = [
  { name: "Гид по бассейну", slug: "gid-po-basseynu", description: "Абонементы, цены, правила, сезоны и первый визит в открытый бассейн «Наутилус» на Советской, 1 к4." },
  { name: "Начинающим", slug: "nachinayushchim", description: "Как научиться плавать взрослому, справиться со страхом воды, собрать сумку и спокойно пройти первые тренировки." },
  { name: "Техника", slug: "tehnika", description: "Кроль, брасс, баттерфляй и тренировки на 50-метровой дорожке: упражнения, планы и разбор ошибок." },
  { name: "Здоровье", slug: "zdorove", description: "Плавание при болях в спине, давлении, лишнем весе и других состояниях: польза, ограничения и вопросы врачу." },
  { name: "Детям", slug: "detyam", description: "Плавание для детей и подростков 9–16 лет: группы, правила посещения, питание, соревнования и поддержка родителей." },
  { name: "Реабилитация", slug: "reabilitaciya", description: "Как возвращаться в воду после травм и операций: этапы, ограничения и что согласовать с врачом." },
  { name: "60+", slug: "60-plus", description: "Плавание и аквааэробика после 60 лет: безопасный старт, равновесие, суставы и льготы на абонемент." },
];

export const categoryBySlug = (slug: string) => blogCategories.find((item) => item.slug === slug);
export const categorySlug = (name: string) => blogCategories.find((item) => item.name === name)?.slug;
export const articlesInCategory = (name: string) => articles.filter((item) => item.category === name);

export const blogPageCount = Math.max(1, Math.ceil(articles.length / BLOG_PAGE_SIZE));
export const blogPage = (page: number) => articles.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
export const blogPagePath = (page: number) => page <= 1 ? "/blog" : `/blog/stranica/${page}`;
