import type { Metadata } from "next";
import { CasaClient } from "./CasaClient";

export const metadata: Metadata = {
  title: "Desconto na conta de luz de casa",
  description:
    "Conta de luz acima de R$ 400? Veja se dá para pagar menos com energia solar por assinatura, sem instalar nada. Atendemos contas da RGE no RS.",
  alternates: { canonical: "/casa" },
  openGraph: {
    title: "Pague menos na conta de luz de casa | Plus Energy",
    description: "Energia solar por assinatura, sem instalar nada. Veja se a sua conta é elegível.",
  },
};

export default function CasaPage() {
  return <CasaClient />;
}
