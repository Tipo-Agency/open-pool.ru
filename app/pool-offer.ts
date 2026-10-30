// Условия подтверждены пользователем 11.10.2026.
// Источник: docs/campaigns/2026-10-11-offer-499-draft.md.
// Новый срок продажи не задан; не добавляем дату окончания автоматически.
export const poolOffer = {
  totalPrice: 14970,
  visits: 30,
  days: 90,
  minutes: 70,
  singleVisitPrice: 1500,
} as const;

export const poolOfferVisitPrice = poolOffer.totalPrice / poolOffer.visits;
export const poolOfferBundle = { ...poolOffer, visitPrice: poolOfferVisitPrice };
export const formatPoolPrice = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export const poolOfferName = `${poolOffer.visits} посещений бассейна с баней`;
export const poolOfferTerms = `Полная оплата абонемента: ${formatPoolPrice(poolOffer.totalPrice)} ₽. ${poolOfferVisitPrice} ₽ рассчитаны при использовании всех ${poolOffer.visits} посещений. Срок действия ${poolOffer.days} дней, сеанс ${poolOffer.minutes} минут.`;
// Видимая сноска карточки: баня и парковка уже названы в чипах над ней.
export const poolOfferAdminNote = "Дату начала действия, правила прохода и условия бани уточнит администратор перед оплатой.";
export const poolOfferAmenityNote = "Баня в подарок к этому абонементу. Парковка не включена. Дату начала действия, правила прохода и условия бани уточнит администратор перед оплатой.";
