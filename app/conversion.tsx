import { messageHref, site } from "./data";
import "./conversion.css";
import { formatPoolPrice, poolOffer, poolOfferVisitPrice } from "./pool-offer";

// Зачёт стоимости разового посещения в абонемент ещё не подтверждён клубом.
// Включать только после подтверждения условий и срока зачёта.
export const SINGLE_VISIT_CREDIT_ENABLED = false;
export const SINGLE_VISIT_CREDIT_TEXT = "";

const singleTotal = poolOffer.singleVisitPrice * poolOffer.visits;
const membershipSaving = singleTotal - poolOffer.totalPrice;

export function SingleVsMembership({ source }: { source: string }) {
  return (
    <section className="compare-bridge" aria-labelledby={`compare-${source}`}>
      <div className="compare-bridge-copy">
        <span className="section-kicker">Разовое или абонемент</span>
        <h2 id={`compare-${source}`}>Понравилось? Следующие визиты в 3 раза дешевле</h2>
        <p>Разовое посещение с баней стоит {formatPoolPrice(poolOffer.singleVisitPrice)} ₽. В карте на {poolOffer.visits} посещений с баней один визит обходится в {poolOfferVisitPrice} ₽.</p>
        {SINGLE_VISIT_CREDIT_ENABLED && SINGLE_VISIT_CREDIT_TEXT && <p className="compare-bridge-credit">{SINGLE_VISIT_CREDIT_TEXT}</p>}
      </div>
      <div className="compare-bridge-cards">
        <article>
          <span>Разовое с баней</span>
          <strong>{formatPoolPrice(poolOffer.singleVisitPrice)} ₽</strong>
          <small>за один визит</small>
        </article>
        <article className="compare-bridge-best">
          <span>Карта на {poolOffer.visits} посещений</span>
          <strong>{poolOfferVisitPrice} ₽</strong>
          <small>за визит, {formatPoolPrice(poolOffer.totalPrice)} ₽ за карту</small>
        </article>
      </div>
      <div className="compare-bridge-saving">
        <p><strong>Экономия {formatPoolPrice(membershipSaving)} ₽</strong> на {poolOffer.visits} визитах: {poolOffer.visits} × {formatPoolPrice(poolOffer.singleVisitPrice)} ₽ = {formatPoolPrice(singleTotal)} ₽ против {formatPoolPrice(poolOffer.totalPrice)} ₽ за карту.</p>
        <p className="compare-bridge-terms">При использовании всех {poolOffer.visits} посещений за {poolOffer.days} дней, сеанс {poolOffer.minutes} минут, баня в подарок, парковка не входит.</p>
        <a className="button button-lime" href="#booking" data-booking data-compare data-goal="подбор абонемента" data-form-name={`Сравнение разовое/абонемент: ${source}`} data-submit-label="Подобрать абонемент">Подобрать абонемент</a>
      </div>
    </section>
  );
}

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Быстрая связь">
      <a href={`tel:${site.phoneHref}`}>Позвонить</a>
      <a href="#booking" data-booking data-form-name="Мобильная панель">Записаться</a>
      <a href={messageHref} target="_blank" rel="noreferrer">Написать</a>
    </nav>
  );
}
