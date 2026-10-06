import { site } from "./data";
import { tariffDate, unlimitedTariffs, visitTariffs } from "./pricing-data";

export function ServiceVisitDetails({ slug }: { slug: string }) {
  const membership = slug === "abonementy";
  const children = slug === "plavanie-dlya-detey";
  const lessons = children || slug === "obuchenie-plavaniyu-vzroslyh" || slug === "akvaaerobika";
  return <section className="tariff-section" aria-labelledby="visit-details-title">
    <div className="section-heading"><span className="section-kicker">Перед посещением</span><h2 id="visit-details-title">{membership ? "Сравните карты по вашему графику" : lessons ? "Как выбрать занятие" : "Спланируйте первый визит"}</h2></div>
    {membership && <><p>Тарифы по прайсу от {tariffDate}. Полная стоимость оплачивается за выбранную карту.</p><div className="price-grid">{[visitTariffs[0], unlimitedTariffs[1], unlimitedTariffs[3]].map(tariff => <article className="price-card" key={tariff.name}><span>{tariff.name === "20 посещений" ? "По посещениям" : "Безлимит"}</span><h3>{tariff.name}</h3><div className="price"><strong>{tariff.price}</strong><i>₽</i></div><p>{tariff.summary}</p><ul>{tariff.details.map(detail => <li key={detail}>{detail}</li>)}</ul><a className="outline-button" href="#booking" data-booking data-goal={tariff.name} data-form-name={`Абонементы: ${tariff.name}`}>Уточнить условия карты</a></article>)}</div></>}
    <div className="comparison-note"><h3>{lessons ? "Подходящая группа и время" : "Адрес и часы работы"}</h3><div>
      {children && <p>Группы для детей 9-13 и 14-16 лет. При обращении укажите возраст ребёнка и его опыт в воде: администратор поможет выбрать подходящий уровень.</p>}
      {lessons && <p>До записи уточните стоимость занятий, тренера, свободные места и требования к допуску. Время групповых занятий отличается от общих часов работы бассейна.</p>}
      <p><strong>{site.city}, {site.address}.</strong> {site.hours}.</p>
      {!lessons && <p>Возьмите купальный костюм, шапочку, сланцы и полотенце. До оплаты уточните длительность сеанса и состав услуг выбранного тарифа.</p>}
      <p><a className="text-link" href="/raspisanie">Расписание и способы записи →</a></p>
      <p><a className="text-link" href="/ceny">Все тарифы, заморозка и включённые услуги →</a></p>
      <p><a className="text-link" href="/kontakty">Как добраться и связаться с бассейном →</a></p>
    </div></div>
  </section>;
}
