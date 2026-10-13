import { JsonLd } from "./components";
import { formatPoolPrice, poolOffer, poolOfferAmenityNote, poolOfferName, poolOfferTerms, poolOfferVisitPrice } from "./pool-offer";
import { SITE_URL } from "./seo";
import "./pool-offer-card.css";

export function PoolOfferCard({ formName }: { formName: string }) {
  return <section className="membership-offer pool-organic-offer" id="pool-sauna-offer" aria-labelledby="pool-sauna-offer-title">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "Offer",
      "@id": `${SITE_URL}/ceny#pool-sauna-offer`,
      name: poolOfferName,
      url: `${SITE_URL}/ceny#pool-sauna-offer`,
      price: String(poolOffer.totalPrice),
      priceCurrency: "RUB",
      description: `${poolOfferTerms} ${poolOfferAmenityNote}`,
      seller: { "@id": `${SITE_URL}/#organization` },
    }} />
    <div><span>Бассейн и баня по абонементу</span><h2 id="pool-sauna-offer-title">{poolOffer.visits} посещений с баней</h2><p>{poolOfferVisitPrice} ₽ за посещение при покупке и полном использовании абонемента. Открытый бассейн «Наутилус», Хабаровск, Советская, 1 к4.</p></div>
    <div className="membership-offer-price"><strong>{formatPoolPrice(poolOffer.totalPrice)} ₽</strong><span>полная стоимость абонемента</span><small>{poolOffer.visits} посещений за {poolOffer.days} дней</small></div>
    <ul><li>Сеанс {poolOffer.minutes} минут</li><li>Баня в подарок</li><li>Парковка не включена</li></ul>
    <a className="button button-lime" href="#booking" data-booking data-goal={`${poolOfferName}, ${formatPoolPrice(poolOffer.totalPrice)} ₽`} data-form-name={formName} data-submit-label="Узнать условия абонемента">Хочу бассейн и баню</a>
    <p className="pool-organic-offer-terms">{poolOfferAmenityNote} Разовый визит с баней стоит {formatPoolPrice(poolOffer.singleVisitPrice)} ₽. Цена {poolOfferVisitPrice} ₽ относится к посещению в абонементе.</p>
  </section>;
}
