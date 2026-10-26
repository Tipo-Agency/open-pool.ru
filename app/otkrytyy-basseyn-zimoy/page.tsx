import type { Metadata } from "next";
import { ServiceView } from "../uslugi/[slug]/page";
import { getTopicLanding } from "../landing-data";
import { createPageMetadata } from "../seo";

const landing = getTopicLanding("/otkrytyy-basseyn-zimoy")!;

export const metadata: Metadata = createPageMetadata({ title: landing.metaTitle, description: landing.service.description, path: landing.path, image: landing.service.image });

export default function TopicLandingPage() {
  return <ServiceView service={landing.service} path={landing.path} crumbs={[{ label: "Главная", href: "/" }, { label: landing.service.shortTitle }]} extra={landing.extra} />;
}
