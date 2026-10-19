// ========================================
// Plus Energy: regras do filtro por público (/casa e /empresas)
// ========================================

import { MIN_QUALIFIED_BILL } from "./constants";

/** Corte de conta para empresa. Abaixo disso, só pelo fluxo de casa. */
export const MIN_QUALIFIED_BILL_EMPRESA = 1000;

/** Faixa da conta de casa a partir do valor do slider. */
export function casaFaixa(value: number): string {
  if (value < 600) return "R$ 400 a R$ 599";
  if (value < 1000) return "R$ 600 a R$ 999";
  if (value < 2000) return "R$ 1.000 a R$ 1.999";
  return "R$ 2.000 ou mais";
}

export interface EmpresaBand {
  id: "ate399" | "400a999" | "1000a2999" | "3000a9999" | "10000mais";
  label: string;
  /** Valor representativo, só para o bucket do ref do WhatsApp. */
  sample: number;
}

export const EMPRESA_BANDS: EmpresaBand[] = [
  { id: "ate399", label: `Menos de R$ ${MIN_QUALIFIED_BILL}`, sample: 300 },
  { id: "400a999", label: "R$ 400 a R$ 999", sample: 700 },
  { id: "1000a2999", label: "R$ 1.000 a R$ 2.999", sample: 1500 },
  { id: "3000a9999", label: "R$ 3.000 a R$ 9.999", sample: 5000 },
  { id: "10000mais", label: "R$ 10.000 ou mais", sample: 10000 },
];

export interface EmpresaSegment {
  id: string;
  label: string;
  /** Segmento do WhatsApp builder (condomínio tem abertura própria). */
  wa: "pj" | "condominio";
}

export const EMPRESA_SEGMENTS: EmpresaSegment[] = [
  { id: "comercio", label: "Comércio", wa: "pj" },
  { id: "restaurante_padaria", label: "Restaurante ou padaria", wa: "pj" },
  { id: "mercado", label: "Mercado", wa: "pj" },
  { id: "industria", label: "Indústria", wa: "pj" },
  { id: "clinica_escritorio", label: "Clínica ou escritório", wa: "pj" },
  { id: "condominio", label: "Condomínio", wa: "condominio" },
  { id: "outro", label: "Outro", wa: "pj" },
];

/** Limpa o texto livre da cidade antes de ir para a mensagem. */
export function cleanCity(raw: string): string {
  return raw.replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}
