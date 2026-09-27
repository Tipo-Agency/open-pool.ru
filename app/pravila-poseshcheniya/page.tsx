import type { Metadata } from "next";
import { LegalDocument } from "../legal-document";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Правила посещения клуба", description: "Правила посещения и инструкция по безопасности открытого бассейна «Наутилус».", path: "/pravila-poseshcheniya", index: false });

export default function RulesPage() { return <LegalDocument documentKey="rules" />; }
