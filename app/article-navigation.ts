// Подборки связывают следующий вопрос посетителя с существующим материалом.
export const visitGuides = [
  "kak-vybrat-abonement-v-basseyn", "chto-vzyat-v-basseyn",
  "plavanie-v-otkrytom-basseyne-zimoy", "plavanie-i-banya",
  "pervyy-vizit-v-nautilus", "kak-vybrat-basseyn-v-habarovske",
];
const clusters = [
  ["kak-vybrat-abonement-v-basseyn", "razovoe-ili-abonement", "byudzhet-na-basseyn", "abonement-zamorozka-propuski"],
  ["chto-vzyat-v-basseyn", "pervyy-vizit-v-nautilus", "dokumenty-dlya-basseyna-nautilus", "voprosy-administratoru-basseyna"],
  ["skolko-kaloriy-szhigaet-plavanie", "stili-plavaniya", "pitaniya-do-i-posle-basseyna"],
  ["kak-nauchit-rebenka-plavat", "rebenok-ne-hochet-v-basseyn", "kak-vybrat-gruppu-plavaniya-rebenku"],
  ["basseyn-do-raboty", "basseyn-posle-raboty", "basseyn-pri-smennom-grafike", "utrennee-ili-vechernee-plavanie"],
  ["plavanie-v-otkrytom-basseyne-zimoy", "plavanie-i-banya", "otkrytyy-ili-krytyy-basseyn"],
];
export function relatedArticleSlugs(slug: string) {
  return clusters.find(group => group.includes(slug))?.filter(item => item !== slug) ?? [];
}
