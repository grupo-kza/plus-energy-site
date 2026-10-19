"use client";

import { Send, ArrowLeftRight, PiggyBank } from "lucide-react";
import { QualifyLanding } from "@/components/qualify/QualifyLanding";

const steps = [
  { icon: Send, title: "Você manda a conta", desc: "Analisamos e mostramos o desconto exato." },
  { icon: ArrowLeftRight, title: "Assina digital", desc: "A titularidade passa para a Plus por contrato. A RGE segue entregando a energia." },
  { icon: PiggyBank, title: "Paga menos todo mês", desc: "Boleto da Plus com 25% de desconto sobre o consumo." },
];

export function CasaClient() {
  return (
    <QualifyLanding
      flow="casa"
      bg="/hero-bg.jpg"
      title={
        <>
          Tua conta de luz passa de R$ 400?{" "}
          <span className="text-pe-solar-400">Dá para pagar menos sem instalar nada.</span>
        </>
      }
      subtitle="Energia solar por assinatura, para contas da RGE no RS."
      cta="Ver se minha conta é elegível"
      points={[
        { icon: "wrench", text: "Sem obra" },
        { icon: "ban", text: "Sem taxa de adesão" },
        { icon: "unlock", text: "Sem multa após 90 dias" },
      ]}
      closing="Leva menos de um minuto"
    >
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black text-center mb-10">
            Como funciona
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-pe-slate-100 bg-pe-slate-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-pe-green-100 bg-pe-green-50">
                  <Icon className="h-6 w-6 text-pe-green-600" />
                </div>
                <h3 className="font-heading font-bold text-black mb-1">{title}</h3>
                <p className="text-sm leading-relaxed text-pe-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </QualifyLanding>
  );
}
