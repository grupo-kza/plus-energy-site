// ========================================
// Plus Energy — Constants & Data
// ========================================

export const COMPANY = {
  name: "Plus Energy",
  tagline: "Energia solar por assinatura",
  cnpj: "51.181.561/0001-75",
  responsible: "Daiana Costenaro Stolarski da Rosa",
  legalForum: "Marcelino Ramos, RS",
  coverage: "Rio Grande do Sul, rede distribuidora RGE (CPFL)",
  regulation: "Lei 14.300 de 2022 (ANEEL)",
  whatsapp: "5554997150494",
  whatsappMessage: "Olá! Vi o site da Plus Energy e quero saber mais sobre o desconto na conta de luz.",
  email: "financeiro@plusenergy.net.br",
  webhookUrl: "https://hook.siteup.com.br/webhook/1b025975-7069-402a-adb9-341e9de3e7d5",
} as const;

// Régua da Plus (voz travada com o Lucas em 19/08/2026, skill plus-energy-voz):
// o desconto vale só sobre a energia compensada, nunca sobre a fatura inteira.
// Conta de R$ 300 a R$ 400 = 20%. Acima de R$ 400 = 25%. Abaixo de R$ 300 a Plus não atende.
export const MIN_BILL = 300;
export const MAX_BILL = 5000;
export const DEFAULT_BILL = 500;
export const TIER_LIMIT = 400;
// Mesmo corte do formulário nativo do Meta ("Até R$400" é a faixa que não segue).
// Abaixo disso o funil do site não chega ao WhatsApp — decisão de 2026-08-08.
export const MIN_QUALIFIED_BILL = 400;

export function discountRateFor(billValue: number) {
  return billValue > TIER_LIMIT ? 0.25 : 0.2;
}

// Quanto da conta vira energia compensada. O resto segue com a RGE: mínimo da ligação,
// iluminação pública e encargos. Estimativa feita com a memória de cálculo do gerador de
// proposta (tarifas RGE, Resolução ANEEL 3.473/2025): cerca de 54% em contas até R$ 800,
// subindo até 68% em R$ 5.000. A simulação exata sai da conta real do cliente.
const COMPENSATED_SHARE: ReadonlyArray<readonly [number, number]> = [
  [300, 0.54],
  [800, 0.55],
  [1500, 0.6],
  [2600, 0.65],
  [5000, 0.68],
];

export function compensatedShare(billValue: number) {
  const pts = COMPENSATED_SHARE;
  if (billValue <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x0, y0] = pts[i - 1];
    if (billValue <= x1) return y0 + ((billValue - x0) / (x1 - x0)) * (y1 - y0);
  }
  return pts[pts.length - 1][1];
}

export function calculateSavings(billValue: number) {
  const rate = discountRateFor(billValue);
  const compensated = billValue * compensatedShare(billValue);
  // Valor redondo: é estimativa, a conta real decide.
  const monthly = Math.round(compensated * rate);

  return {
    rate,
    ratePercent: Math.round(rate * 100),
    compensated: Math.round(compensated),
    stayWithRge: Math.round(billValue - compensated),
    monthly,
    yearly: monthly * 12,
    twoYears: monthly * 24,
  };
}

export const NAV_LINKS = [
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Sobre", href: "/sobre" },
  { label: "Para Empresas", href: "/para-empresas" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Simulação gratuita",
    description: "Envie sua conta de luz e receba uma simulação mostrando o valor exato da sua economia.",
    icon: "Calculator",
  },
  {
    step: 2,
    title: "Assinatura digital",
    description: "Assine o contrato digital sem sair de casa, sem burocracia.",
    icon: "FileSignature",
  },
  {
    step: 3,
    title: "Troca de titularidade",
    description: "A conta passa para o nome da Plus Energy para que os créditos de energia solar sejam direcionados.",
    icon: "ArrowLeftRight",
  },
  {
    step: 4,
    title: "Desconto na conta",
    description: "Em 30 a 60 dias os créditos aparecem e o desconto chega todo mês automaticamente.",
    icon: "BadgePercent",
  },
  {
    step: 5,
    title: "Pagamento simplificado",
    description: "Você paga um único boleto da Plus Energy. Quando o desconto começa, ele já vem aplicado nesse boleto.",
    icon: "Receipt",
  },
] as const;

export const CASE_MAICON = {
  name: "Maicon",
  company: "Mercado e Açougue RK LTDA",
  location: "Marcelino Ramos, RS",
  previousBill: 3785.54,
  currentBill: 2998.90,
  totalSavings: 5677.91,
  months: 8,
  testimonial:
    "Muito contente com nossa parceria que já conseguimos economizar R$5.677,91 em 8 meses!! Grato pela confiança",
  type: "CNPJ, trifásico",
} as const;

// Só caso com fonte. Os outros cinco depoimentos que estavam aqui não tinham cliente,
// conta nem autorização registrados: saíram em 14/10/2026 (sprint Plus, F4).
// Maicon: números da conta dele e frase dele; manter só com OK dele (pendente).
export const CASES = [
  {
    name: "Maicon R.",
    company: "Mercado e Açougue RK LTDA",
    location: "Marcelino Ramos, RS",
    previousBill: 3785.54,
    currentBill: 2998.90,
    totalSavings: 5677.91,
    months: 8,
    testimonial: "Muito contente com nossa parceria que já conseguimos economizar R$5.677,91 em 8 meses!! Grato pela confiança.",
    type: "Comércio, CNPJ",
    initials: "MR",
    image: "/images/cases/maicon.png",
    reviewDate: "2025-06-15",
  },
] as const;

export const FAQ_DATA = [
  {
    question: "Precisa instalar placa solar?",
    answer:
      "Não. Você não instala absolutamente nada. A energia vem das usinas da Plus Energy e chega pela rede da RGE, pelos mesmos fios que já chegam na sua casa.",
  },
  {
    question: "A conta de luz vai para o nome de vocês?",
    answer:
      "Sim. A titularidade da conta passa para a Plus Energy, e é isso que libera os créditos da usina na sua conta. A energia continua vindo pela rede da RGE e, se faltar luz, você segue ligando para a RGE.",
  },
  {
    question: "Tem multa para cancelar?",
    answer:
      "Não tem multa para sair. Para cancelar, é só avisar com 90 dias de antecedência.",
  },
  {
    question: "Em quanto tempo o desconto aparece?",
    answer:
      "Em torno de 30 a 60 dias depois que a Plus Energy assume a titularidade da conta. Os primeiros boletos podem vir cheios: o desconto não começa no dia da assinatura. Depois disso, vem todo mês.",
  },
  {
    question: "Posso fazer para mais de uma conta?",
    answer:
      "Sim! É feito um contrato para cada unidade consumidora.",
  },
  {
    question: "Funciona para empresa (CNPJ)?",
    answer:
      "Sim, atendemos pessoa jurídica com o mesmo desconto.",
  },
  {
    question: "O que é energia solar por assinatura?",
    answer:
      "É um modelo regulamentado pela Lei 14.300/2022 que permite usar a energia gerada por usinas remotas sem instalar nada. A energia da usina vira crédito na sua conta e você paga esse crédito com desconto.",
  },
  {
    question: "Como faço para assinar?",
    answer:
      "Manda a sua conta de luz pelo WhatsApp, recebe a simulação com o valor real e, se fizer sentido, assina o contrato digital.",
  },
  {
    question: "Qual o desconto exato?",
    answer:
      "É de 20% para contas de R$ 300 a R$ 400 e de 25% para contas acima de R$ 400, sempre sobre a energia compensada (a parte da conta que a usina da Plus Energy abate). O mínimo da ligação, a iluminação pública e os encargos seguem com a RGE, por isso a economia na fatura inteira fica menor que o percentual. O valor exato sai da simulação com a sua conta.",
  },
] as const;

export const ENVIRONMENTAL_STATS = {
  co2Avoided: 8.09, // tons (from Maicon case)
  treesPlanted: 50.98,
  cleanKwh: 3390,
} as const;

export const OBJECTIONS = [
  {
    objection: "Parece bom demais para ser verdade",
    answer: "Regulamentado pela ANEEL (Lei 14.300/2022). Empresa com CNPJ ativo e contrato digital que você lê antes de assinar.",
    icon: "ShieldCheck",
  },
  {
    objection: "E se eu quiser cancelar?",
    answer: "Pode cancelar, sem multa. É só avisar com 90 dias de antecedência.",
    icon: "DoorOpen",
  },
  {
    objection: "Vai mudar algo no meu dia a dia?",
    answer: "Mesma energia, mesmo fornecimento, mesmos fios. A diferença é a titularidade da conta, que passa para a Plus Energy, e o boleto único.",
    icon: "RefreshCw",
  },
  {
    objection: "É confiável?",
    answer: "Empresa registrada com CNPJ ativo, contrato digital assinado, regulamentado por lei federal.",
    icon: "BadgeCheck",
  },
] as const;
