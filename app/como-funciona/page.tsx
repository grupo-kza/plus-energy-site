import type { Metadata } from "next";
import { ComoFuncionaClient } from "./ComoFuncionaClient";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Entenda como funciona a energia solar por assinatura da Plus Energy. Em 5 passos você passa a ter 25% de desconto sobre a energia compensada, sem instalar nada.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <JsonLd type="howTo" />
      <ComoFuncionaClient />
    </>
  );
}
