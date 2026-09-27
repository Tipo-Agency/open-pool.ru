import { Breadcrumbs, Footer, Header } from "./components";
import { legalDocuments, LegalDocumentKey } from "./legal-data";

const headingLines = new Set([
  "Предмет договора",
  "Права и обязанности",
  "Регистрация клиента и порядок расчетов",
  "Срок действия, изменение и расторжение (прекращение) договора",
  "Ответственность сторон",
  "Форс-мажор",
  "Прочие условия",
  "Сбор данных о Пользователе из социальных сетей",
]);

function isHeading(line: string) {
  return headingLines.has(line) || /^\d+\.\s+[А-ЯЁ]/.test(line) || (line.length < 150 && line === line.toUpperCase() && /[А-ЯЁ]/.test(line));
}

export function LegalDocument({ documentKey }: { documentKey: LegalDocumentKey }) {
  const document = legalDocuments[documentKey];
  const lines = document.content.split("\n").filter(Boolean);
  return (
    <>
      <Header />
      <main className="legal-page legal-document-page">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: document.title }]} />
        <header className="legal-document-header">
          <span className="section-kicker">Документы клуба</span>
          <h1>{document.title}</h1>
          <p>Полная редакция документа, опубликованная на официальном сайте открытого плавательного бассейна.</p>
          <a href="https://open-pool.ru/oferta" target="_blank" rel="noreferrer">Открыть исходную публикацию ↗</a>
        </header>
        <article className="legal-document-copy">
          {lines.map((line, index) => {
            if (isHeading(line)) return <h2 key={`${line}-${index}`}>{line}</h2>;
            if (line.startsWith("•")) return <p className="legal-bullet" key={`${line}-${index}`}>{line}</p>;
            return <p key={`${line}-${index}`}>{line}</p>;
          })}
        </article>
      </main>
      <Footer />
    </>
  );
}
