/* Document navigation is intentional: vinext client Link broke on production routes. */
/* eslint-disable @next/next/no-html-link-for-pages */
import { poolImageProps } from "../pool-image";
import type { Metadata } from "next";
import { Breadcrumbs, Footer, Header, JsonLd, PageCta } from "../components";
import { galleryPhotos } from "../gallery-data";
import { createPageMetadata, SITE_URL } from "../seo";
import "../conversion.css";

export const metadata: Metadata = createPageMetadata({ title: "Фото открытого бассейна «Наутилус» в Хабаровске", description: "Фотографии открытого 50-метрового бассейна «Наутилус» на Советской, 1 к4: дорожки, вода +28 °C, бассейн летом и зимой.", path: "/galereya", image: galleryPhotos[0].src });

const absolute = (src: string) => {
  const props = poolImageProps(src);
  return props.src.startsWith("/") ? `${SITE_URL}${props.src}` : props.src;
};

export default function GalleryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${SITE_URL}/galereya#gallery`,
    name: "Фото открытого бассейна «Наутилус»",
    url: `${SITE_URL}/galereya`,
    about: { "@id": `${SITE_URL}/#pool` },
    image: galleryPhotos.map((photo) => ({ "@type": "ImageObject", contentUrl: absolute(photo.src), caption: photo.caption, description: photo.alt })),
  };
  return <><Header /><main className="inner-page"><JsonLd data={schema} /><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Фотогалерея" }]} />
    <section className="inner-hero"><span className="section-kicker">Фотогалерея</span><h1>Открытый бассейн «Наутилус» на фото</h1><p>Как выглядит 50-метровый бассейн на Советской, 1 к4: дорожки, вода и территория. Галерея пополняется.</p></section>
    <section className="photo-gallery" aria-label="Фотографии бассейна">
      {galleryPhotos.map((photo, index) => <figure key={photo.src} className={index === 0 ? "photo-gallery-wide" : undefined}>
        <a href={poolImageProps(photo.src).src} target="_blank" rel="noreferrer"><img {...poolImageProps(photo.src, index === 0, index === 0 ? "(max-width: 760px) 100vw, 1180px" : "(max-width: 760px) 100vw, 50vw")} alt={photo.alt} /></a>
        <figcaption>{photo.caption}</figcaption>
      </figure>)}
    </section>
    <section className="comparison-note"><h2>Приходите посмотреть сами</h2><div><p>Разовое посещение с баней стоит 1 500 ₽. Для регулярного плавания есть <a href="/ceny#pool-sauna-offer">карта на 30 посещений с баней</a>. Подробнее о бассейне: <a href="/basseyn-50-metrov-habarovsk">бассейн 50 метров</a>, <a href="/otkrytyy-basseyn-zimoy">открытый бассейн зимой</a>, <a href="/uslugi/banya-i-sauna">баня и сауна</a>.</p></div></section>
    <PageCta title="Попробуйте большую воду" text="Начните с разового посещения или сразу подберите карту для регулярных тренировок." />
  </main><Footer /></>;
}
