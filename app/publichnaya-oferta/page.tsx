import type { Metadata } from "next";
import { LegalDocument } from "../legal-document";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({ title: "Публичная оферта", description: "Публичная оферта на оказание физкультурно-оздоровительных услуг открытого бассейна «Наутилус».", path: "/publichnaya-oferta", index: false });

export default function OfferPage() { return <LegalDocument documentKey="offer" />; }
