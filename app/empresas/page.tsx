import type { Metadata } from "next";
import { EmpresasClient } from "./EmpresasClient";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Energia para empresas: corte o custo sem obra",
  description:
    "Energia solar por assinatura para comércios, indústrias e empresas com conta RGE no RS. Reduza o custo de energia sem obra e sem parar a operação.",
  alternates: { canonical: "/empresas" },
  openGraph: {
    title: "Energia solar para empresas | Plus Energy",
    description: "Corte o custo de energia sem obra e sem parar a loja. Veja se a conta da sua empresa é elegível.",
  },
};

export default function EmpresasPage() {
  return (
    <>
      <JsonLd type="service" />
      <EmpresasClient />
    </>
  );
}
