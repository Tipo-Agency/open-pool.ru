/* eslint-disable @next/next/no-html-link-for-pages */
import { articles, getArticleImage, services, site } from "./data";
import { BrandLogo } from "./brand-logo";
import { SITE_URL } from "./seo";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Наутилус, главная">
        <BrandLogo />
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        <a href="/uslugi">Услуги</a>
        <a href="/raspisanie">Расписание</a>
        <a href="/ceny">Цены</a>
        <a href="/blog">Журнал</a>
        <a href="/kontakty">Контакты</a>
      </nav>
      <div className="header-actions">
        <a className="phone" href={`tel:${site.phoneHref}`}>{site.phone}</a>
        <a className="button button-small desktop-cta" href="#booking" data-booking>Подобрать абонемент</a>
        <details className="mobile-menu">
          <summary aria-label="Открыть меню"><span /><span /></summary>
          <nav aria-label="Мобильная навигация">
            <a href="/uslugi">Услуги</a>
            <a href="/raspisanie">Расписание</a>
            <a href="/ceny">Цены</a>
            <a href="/blog">Журнал</a>
            <a href="/kontakty">Контакты</a>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <a className="brand footer-brand" href="/" aria-label="Наутилус, главная">
            <BrandLogo className="brand-logo-light" />
          </a>
          <p>50 метров тёплой воды под открытым небом в центре Хабаровска.</p>
        </div>
        <div>
          <strong>Плавание</strong>
          {services.slice(0, 4).map((item) => <a key={item.slug} href={`/uslugi/${item.slug}`}>{item.shortTitle}</a>)}
        </div>
        <div>
          <strong>Информация</strong>
          <a href="/raspisanie">Расписание</a>
          <a href="/ceny">Цены</a>
          <a href="/blog">Полезные статьи</a>
          <a href="/kontakty">Контакты</a>
        </div>
        <div>
          <strong>Связаться</strong>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <a href={site.vkMessages} target="_blank" rel="noreferrer">Написать во ВКонтакте</a>
          <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={site.vk} target="_blank" rel="noreferrer">VK</a>
          <span>{site.address}</span>
          <span>{site.hours}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Открытый бассейн «Наутилус»</span>
        <a className="tipa-credit" href="https://tipa.uz/ru" target="_blank" rel="nofollow noopener noreferrer" aria-label="Сайт разработан агентством TIPA"><span>Сделано</span><img src="/media/tipa-agency-animated.svg" alt="TIPA" width={64} height={42} /></a>
        <div className="footer-legal-links">
          <a href="/politika-konfidencialnosti">Политика конфиденциальности</a>
          <a href="/publichnaya-oferta">Публичная оферта</a>
          <a href="/pravila-poseshcheniya">Правила посещения</a>
        </div>
      </div>
    </footer>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }} />;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, SITE_URL).toString() } : {}),
    })),
  };
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <JsonLd data={schema} />
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          {index < items.length - 1 && <i>/</i>}
        </span>
      ))}
    </nav>
  );
}

export function PageCta({ title = "Подберём удобный формат плавания", text = "Расскажите, как часто хотите приходить. Администратор сравнит варианты и ответит на вопросы." }: { title?: string; text?: string }) {
  return (
    <section className="page-cta">
      <div>
        <span className="section-kicker">Поможем выбрать</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="cta-actions">
        <a className="button button-lime" href="#booking" data-booking>Открыть форму</a>
        <a className="cta-phone" href={`tel:${site.phoneHref}`}>{site.phone}</a>
      </div>
    </section>
  );
}

export function ArticleCards({ limit, exclude }: { limit?: number; exclude?: string }) {
  const current = exclude ? articles.find((item) => item.slug === exclude) : undefined;
  const list = articles
    .filter((item) => item.slug !== exclude)
    .sort((a, b) => current ? Number(b.category === current.category) - Number(a.category === current.category) : 0)
    .slice(0, limit ?? articles.length);
  return (
    <div className="article-grid">
      {list.map((item) => (
        <article className="article-card" key={item.slug}>
          <div className="article-visual">
            <img src={getArticleImage(item)} alt={`Иллюстрация к статье «${item.title}»`} loading="lazy" />
            <span>{item.category}</span>
          </div>
          <div className="article-card-body">
            <div className="article-meta"><span>{item.category}</span><span>{item.readTime}</span></div>
            <h3><a href={`/blog/${item.slug}`}>{item.title}</a></h3>
            <p>{item.description}</p>
            <a className="text-link" href={`/blog/${item.slug}`}>Читать статью <span>→</span></a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function YandexMap({ large = false }: { large?: boolean }) {
  return (
    <div className={`yandex-map${large ? " contact-map" : ""}`}>
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=135.044464%2C48.480725&z=16&pt=135.044464%2C48.480725%2Cpm2rdm"
        title="Открытый бассейн Наутилус на Яндекс Картах"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
