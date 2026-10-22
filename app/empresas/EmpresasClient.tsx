"use client";

import {
  Building2,
  ShoppingCart,
  UtensilsCrossed,
  Factory,
  Briefcase,
  Home,
  Store,
  CheckCircle2,
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { QualifyLanding } from "@/components/qualify/QualifyLanding";

/* ── data ── */

const segments = [
  { icon: Store, label: "Comércio" },
  { icon: UtensilsCrossed, label: "Restaurantes e padarias" },
  { icon: ShoppingCart, label: "Mercados" },
  { icon: Factory, label: "Indústrias" },
  { icon: Briefcase, label: "Clínicas e escritórios" },
  { icon: Home, label: "Condomínios" },
];

const cases = [
  {
    name: "Mercado RK",
    segment: "Supermercado",
    location: "Marcelino Ramos/RS",
    before: "R$ 3.785",
    after: "R$ 2.999",
    saving: "R$ 5.677",
    period: "8 meses",
    quote: "Economizamos mais de R$5.000 em 8 meses sem mudar nada na operação.",
  },
  {
    name: "Padaria Sabor & Cia",
    segment: "Alimentação",
    location: "Erechim/RS",
    before: "R$ 2.400",
    after: "R$ 1.800",
    saving: "R$ 4.200",
    period: "7 meses",
    quote: "Achei que ia ser complicado por ser CNPJ, mas foi tudo digital e rápido.",
  },
  {
    name: "Hotel Thermas",
    segment: "Hotelaria",
    location: "Marcelino Ramos/RS",
    before: "R$ 8.200",
    after: "R$ 6.150",
    saving: "R$ 12.300",
    period: "6 meses",
    quote: "Com o volume que consumimos, o desconto fez uma diferença enorme no caixa.",
  },
];

const faqItems = [
  {
    question: "Preciso instalar algo na minha empresa?",
    answer: "Não. A energia continua vindo da rede RGE normalmente. Não há instalação de placas, equipamentos ou qualquer mudança na estrutura do seu imóvel. Tudo funciona via créditos de energia gerados nas nossas usinas solares.",
  },
  {
    question: "A titularidade da conta muda?",
    answer: "Sim. Por contrato assinado, a titularidade da conta passa para a Plus Energy. O fornecimento segue pela RGE normalmente, sem corte e sem mudança na operação.",
  },
  {
    question: "E se eu mudar de endereço?",
    answer: "Sem problema. Basta nos informar o novo endereço e transferimos os créditos para a nova unidade consumidora, desde que continue na área de cobertura da RGE no RS.",
  },
  {
    question: "Tem multa de cancelamento?",
    answer: "Não há multa após 90 dias de contrato, e não há taxa de adesão.",
  },
  {
    question: "Como funciona a cobrança?",
    answer: "Você recebe uma Conta Única digital todo mês via WhatsApp e e-mail. Nela já está o valor com desconto. A conta da RGE é paga automaticamente pela Plus Energy.",
  },
];

/* ── component ── */

export function EmpresasClient() {
  return (
    <QualifyLanding
      flow="empresa"
      bg="/images/solar-farm-bg.jpg"
      title={
        <>
          Teu negócio não pode desligar a luz.{" "}
          <span className="text-pe-solar-400">Mas pode pagar até 25% menos pela energia que consome.</span>
        </>
      }
      subtitle="Freezer, forno e máquina não param, e a RGE reajustou a tarifa de novo em junho. Com energia solar por assinatura, regulada pela Lei 14.300, o desconto vem sem placa e sem obra."
      cta="Simular a economia da empresa"
      points={[
        { icon: "wrench", text: "Sem obra" },
        { icon: "ban", text: "Sem taxa de adesão" },
        { icon: "unlock", text: "Sem multa após 90 dias" },
      ]}
      closing="Veja se a conta da tua empresa entra"
    >
      <section className="bg-pe-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black text-center mb-8">
            Para quem é
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {segments.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-pe-slate-100 bg-white p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pe-green-100 bg-pe-green-50">
                  <Icon className="h-5 w-5 text-pe-green-600" />
                </div>
                <span className="font-heading text-sm font-semibold leading-tight text-black">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black text-center mb-8">
            Empresas que já <span className="gold-gradient-text">economizam</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {cases.map((c) => (
              <div
                key={c.name}
                className="flex flex-col gap-4 rounded-2xl border border-pe-slate-100 bg-pe-slate-50 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-pe-solar-300 bg-pe-solar-100">
                    <Building2 className="h-4 w-4 text-pe-solar-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{c.name}</p>
                    <p className="text-xs text-pe-slate-400">{c.segment} · {c.location}</p>
                  </div>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-3 rounded-xl border border-pe-slate-100 bg-white p-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-pe-slate-400">Antes</p>
                    <p className="font-heading font-bold text-pe-slate-600">{c.before}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-pe-slate-400">Depois</p>
                    <p className="font-heading font-bold text-pe-green-600">{c.after}</p>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 border-t border-pe-slate-100 pt-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-pe-green-600" />
                    <p className="text-xs text-pe-slate-600">
                      <strong className="text-pe-green-700">{c.saving}</strong> economizados em {c.period}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pe-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black text-center mb-8">
            Dúvidas de gestores
          </h2>
          <Accordion items={faqItems} />
        </div>
      </section>
    </QualifyLanding>
  );
}
