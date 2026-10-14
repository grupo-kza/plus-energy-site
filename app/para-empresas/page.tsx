import type { Metadata } from "next";
import { ParaEmpresasClient } from "@/app/para-empresas/ParaEmpresasClient";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Para empresas: desconto na energia da conta CNPJ",
  description:
    "Energia solar por assinatura para comércios e empresas no RS. Até 25% de desconto sobre a energia compensada, sem instalação, sem obra e sem multa para sair.",
  openGraph: {
    title: "Energia solar para empresas | Plus Energy",
    description:
      "Até 25% de desconto sobre a energia compensada da conta CNPJ. Sem instalar nada, sem obra e sem multa para sair.",
  },
};

export default function ParaEmpresasPage() {
  return (
    <main className="bg-white">
      <JsonLd type="service" />
      <ParaEmpresasClient />
    </main>
  );
}
