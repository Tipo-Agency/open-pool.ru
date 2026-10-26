import { images } from "./data";

// Фото клуба для /galereya. Новые снимки: исходник в public/gallery, запись здесь,
// затем node scripts/optimize-gallery-photos.mjs (см. public/gallery/README.md).
export type GalleryPhoto = { src: string; alt: string; caption: string };

export const galleryPhotos: GalleryPhoto[] = [
  { src: images.pool, alt: "Открытый бассейн «Наутилус» в Хабаровске: дорожки 50 метров и бортик", caption: "50-метровая чаша, 8 дорожек" },
  { src: images.evening, alt: "Спуск в открытый бассейн «Наутилус» по лестнице, на дорожках плавают посетители", caption: "Спуск в воду и дорожки для свободного плавания" },
  { src: images.training, alt: "Девушка отдыхает на спине на воде в открытом бассейне «Наутилус»", caption: "Вода около +28 °C круглый год" },
  { src: images.swim, alt: "Подводная съёмка в бассейне «Наутилус»", caption: "Под водой" },
];
