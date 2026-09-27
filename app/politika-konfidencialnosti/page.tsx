import type { Metadata } from "next";
import { LegalDocument } from "../legal-document";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Политика конфиденциальности", description: "Политика конфиденциальности и согласие на обработку персональных данных открытого бассейна «Наутилус».", path: "/politika-konfidencialnosti", index: false });

export default function PrivacyPage() { return <LegalDocument documentKey="privacy" />; }
