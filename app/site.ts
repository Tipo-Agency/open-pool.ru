// Контакты клуба отдельно от data.ts, чтобы клиентские компоненты не тянули статьи в бандл.
export const site = {
  name: "Открытый бассейн «Наутилус»",
  shortName: "Наутилус",
  city: "Хабаровск",
  address: "Советская улица, 1 к4",
  phone: "+7 4212 46-49-16",
  phoneHref: "+74212464916",
  vk: "https://vk.com/openpool_khv",
  vkMessages: "https://vk.me/openpool_khv",
  instagram: "https://instagram.com/openpool_khv",
  telegram: "https://t.me/openpool27",
  // Ссылку на канал в MAX клуб пришлёт отдельно; пока пусто, кнопки ведут во ВКонтакте.
  max: "",
  appStore: "https://apps.apple.com/ru/app/%D1%84%D0%BA-%D0%BD%D0%B0%D1%83%D1%82%D0%B8%D0%BB%D1%83%D1%81/id1057973232",
  googlePlay: "https://play.google.com/store/apps/details?id=com.itrack.nautilus&hl=ru",
  hours: "Будни 06:00-22:00, выходные 07:00-22:00",
};

export const messageHref = site.max || site.vkMessages;
