"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { BillSlider } from "@/components/lead/BillSlider";
import { NotEligibleScreen } from "@/components/lead/NotEligibleScreen";
import { DEFAULT_BILL, MIN_QUALIFIED_BILL } from "@/lib/constants";
import { useWhatsAppLink } from "@/lib/useWhatsAppLink";
import { trackLeadQualificado, trackWhatsAppClick } from "@/lib/gtm";
import {
  EMPRESA_BANDS,
  EMPRESA_SEGMENTS,
  casaFaixa,
  cleanCity,
  type EmpresaBand,
  type EmpresaSegment,
} from "@/lib/qualify";
import type { WaQualified } from "@/lib/whatsapp";

type Flow = "casa" | "empresa";

type CasaStep = "conta" | "local" | "titular" | "ciencia";
type EmpresaStep = "negocio" | "conta" | "cnpj" | "cabine" | "local";
type Step = CasaStep | EmpresaStep;

type Outcome =
  | { kind: "blocked"; reason: BlockReason }
  | { kind: "done"; qualified: WaQualified; billSample: number; waSegment: "pj" | "condominio" | "pf" };

type BlockReason =
  | "conta_baixa"
  | "fora_rge"
  | "nao_titular"
  | "sem_cnpj";

/** Espaço não separável entre "R$" e o valor, só para exibição. */
const nb = (t: string) => t.replace(/R\$ /g, "R$\u00a0");

const CASA_STEPS: CasaStep[] = ["conta", "local", "titular", "ciencia"];
const EMPRESA_STEPS: EmpresaStep[] = ["negocio", "conta", "cnpj", "cabine", "local"];

const TITLES: Record<Step, string> = {
  // casa
  conta: "Quanto tu pagas de luz?",
  local: "Onde fica a conta?",
  titular: "A conta está no teu nome?",
  ciencia: "Sobre a titularidade",
  // empresa
  negocio: "Qual o tipo de negócio?",
  cnpj: "A conta está no CNPJ?",
  cabine: "Tem cabine ou transformador próprio?",
};

const optionBase =
  "w-full p-4 rounded-xl border-2 text-left transition-all font-medium min-h-[56px]";
const optionIdle =
  "border-pe-slate-200 hover:border-pe-slate-300 bg-white text-pe-slate-700";

const primaryBtn =
  "w-full mt-6 py-3.5 px-6 bg-[#15803D] hover:bg-[#166534] text-white font-heading font-bold rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";

interface QualifyModalProps {
  flow: Flow;
  open: boolean;
  onClose: () => void;
}

export function QualifyModal({ flow, open, onClose }: QualifyModalProps) {
  const steps: Step[] = flow === "casa" ? CASA_STEPS : EMPRESA_STEPS;

  const [stepIndex, setStepIndex] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // respostas
  const [bill, setBill] = useState(DEFAULT_BILL);
  const [band, setBand] = useState<EmpresaBand | null>(null);
  const [segment, setSegment] = useState<EmpresaSegment | null>(null);
  const [city, setCity] = useState("");
  const [hasCabine, setHasCabine] = useState<boolean | null>(null);

  const step = steps[stepIndex];

  const reset = useCallback(() => {
    setStepIndex(0);
    setOutcome(null);
    setBill(DEFAULT_BILL);
    setBand(null);
    setSegment(null);
    setCity("");
    setHasCabine(null);
  }, []);

  // trava o scroll e fecha com Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => {
    if (outcome) {
      setOutcome(null);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const block = (reason: BlockReason) => setOutcome({ kind: "blocked", reason });

  /** Fecha o filtro: monta a mensagem e libera a tela do WhatsApp. */
  function finish(opts: {
    titularidadeEntender?: boolean;
    mediaTensao?: boolean;
  }) {
    const cidade = cleanCity(city);
    if (flow === "casa") {
      const faixa = casaFaixa(bill);
      trackLeadQualificado({ publico: "casa", faixaConta: faixa, segmento: "residencial" });
      setOutcome({
        kind: "done",
        billSample: bill,
        waSegment: "pf",
        qualified: {
          tipo: "casa",
          faixa,
          cidade,
          querEntenderTitularidade: opts.titularidadeEntender,
        },
      });
    } else {
      const faixa = band!.label;
      // Faixa de R$ 400 a R$ 999 segue para o WhatsApp, mas abaixo do corte
      // de empresa não é lead qualificado: não dispara evento de mídia.
      if (band!.id !== "400a999") {
        trackLeadQualificado({
          publico: "empresa",
          faixaConta: faixa,
          segmento: segment!.label,
          mediaTensao: opts.mediaTensao,
        });
      }
      setOutcome({
        kind: "done",
        billSample: band!.sample,
        waSegment: segment!.wa,
        qualified: {
          tipo: "empresa",
          faixa,
          cidade,
          segmento: segment!.label,
          mediaTensao: opts.mediaTensao,
        },
      });
    }
  }

  const showHeader = !outcome;
  const cityOk = cleanCity(city).length >= 2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="absolute inset-0 bg-pe-slate-950/60 backdrop-blur-sm pointer-events-none" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Verificar elegibilidade"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {showHeader ? (
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-pe-slate-100 px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {stepIndex > 0 && (
                      <button
                        onClick={back}
                        className="p-1 rounded-lg hover:bg-pe-slate-100 transition text-pe-slate-400"
                        aria-label="Voltar"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    <h2 className="font-heading font-bold text-lg text-pe-slate-900 leading-tight">
                      {TITLES[step]}
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg hover:bg-pe-slate-100 transition text-pe-slate-400 shrink-0"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {steps.map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= stepIndex ? "bg-pe-green-500" : "bg-pe-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 p-1.5 rounded-lg hover:bg-pe-slate-100 transition text-pe-slate-400"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {outcome?.kind === "blocked" && (
                  <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <BlockedView reason={outcome.reason} onClose={handleClose} />
                  </motion.div>
                )}

                {outcome?.kind === "done" && (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DoneView flow={flow} outcome={outcome} onClose={handleClose} />
                  </motion.div>
                )}

                {!outcome && (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ───── CASA ───── */}
                    {flow === "casa" && step === "conta" && (
                      <>
                        <BillSlider value={bill} onChange={setBill} showDetails={false} label="Valor da tua conta de luz" />
                        <button
                          className={primaryBtn}
                          onClick={() => (bill < MIN_QUALIFIED_BILL ? block("conta_baixa") : next())}
                        >
                          Continuar
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {step === "local" && (
                      <LocalStep
                        city={city}
                        setCity={setCity}
                        cityOk={cityOk}
                        onRge={() => {
                          if (flow === "casa") next();
                          else finish({ mediaTensao: hasCabine === true });
                        }}
                        onOther={() => block("fora_rge")}
                        note={
                          flow === "empresa"
                            ? "A titularidade da conta passa para a Plus Energy por contrato. A RGE segue no fornecimento e nada muda na operação."
                            : undefined
                        }
                      />
                    )}

                    {flow === "casa" && step === "titular" && (
                      <div className="space-y-3">
                        <button
                          className={`${optionBase} ${optionIdle}`}
                          onClick={() => next()}
                        >
                          Sim, está no meu nome
                        </button>
                        <button
                          className={`${optionBase} ${optionIdle}`}
                          onClick={() => block("nao_titular")}
                        >
                          Não, está no nome de outra pessoa
                        </button>
                      </div>
                    )}

                    {flow === "casa" && step === "ciencia" && (
                      <>
                        <p className="text-sm text-pe-slate-600 mb-4 leading-relaxed">
                          Para o desconto valer, a titularidade da conta passa para a Plus Energy
                          por contrato. A RGE continua entregando a energia, e nada muda no dia a dia.
                        </p>
                        <div className="space-y-3">
                          <button
                            className={`${optionBase} ${optionIdle}`}
                            onClick={() => finish({})}
                          >
                            Sim, entendo
                          </button>
                          <button
                            className={`${optionBase} ${optionIdle}`}
                            onClick={() => finish({ titularidadeEntender: true })}
                          >
                            Quero entender melhor
                          </button>
                        </div>
                      </>
                    )}

                    {/* ───── EMPRESA ───── */}
                    {flow === "empresa" && step === "negocio" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {EMPRESA_SEGMENTS.map((s) => (
                          <button
                            key={s.id}
                            className={`${optionBase} ${optionIdle} ${s.id === "outro" ? "sm:col-span-2" : ""}`}
                            onClick={() => {
                              setSegment(s);
                              next();
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {flow === "empresa" && step === "conta" && (
                      <>
                        <p className="text-sm text-pe-slate-600 mb-4">Valor médio da conta de luz por mês:</p>
                        <div className="space-y-3">
                          {EMPRESA_BANDS.map((b) => (
                            <button
                              key={b.id}
                              className={`${optionBase} ${optionIdle}`}
                              onClick={() => {
                                setBand(b);
                                if (b.id === "ate399") block("conta_baixa");
                                else next();
                              }}
                            >
                              {nb(b.label)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {flow === "empresa" && step === "cnpj" && (
                      <div className="space-y-3">
                        <button
                          className={`${optionBase} ${optionIdle}`}
                          onClick={() => next()}
                        >
                          Sim, está no CNPJ da empresa
                        </button>
                        <button
                          className={`${optionBase} ${optionIdle}`}
                          onClick={() => block("sem_cnpj")}
                        >
                          Não, está em outro nome
                        </button>
                      </div>
                    )}

                    {flow === "empresa" && step === "cabine" && (
                      <>
                        <p className="text-sm text-pe-slate-600 mb-4">
                          Se o terreno tem cabine ou transformador teu, a conta costuma ser de média tensão.
                          Sem problema, só muda quem conversa contigo.
                        </p>
                        <div className="space-y-3">
                          <button
                            className={`${optionBase} ${optionIdle}`}
                            onClick={() => {
                              setHasCabine(false);
                              next();
                            }}
                          >
                            Não tenho
                          </button>
                          <button
                            className={`${optionBase} ${optionIdle}`}
                            onClick={() => {
                              setHasCabine(true);
                              next();
                            }}
                          >
                            Sim, tenho
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── etapa de cidade + distribuidora ── */

function LocalStep({
  city,
  setCity,
  cityOk,
  onRge,
  onOther,
  note,
}: {
  city: string;
  setCity: (v: string) => void;
  cityOk: boolean;
  onRge: () => void;
  onOther: () => void;
  note?: string;
}) {
  return (
    <div>
      <label htmlFor="qualify-city" className="block text-sm font-medium text-pe-slate-700 mb-1">
        Cidade
      </label>
      <input
        id="qualify-city"
        type="text"
        autoComplete="address-level2"
        placeholder="Ex.: Erechim"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        maxLength={60}
        className="w-full px-4 py-3 rounded-xl border border-pe-slate-200 bg-white text-pe-slate-900 placeholder:text-pe-slate-400 focus:outline-none focus:ring-2 focus:ring-pe-green-500/30 focus:border-pe-green-500 transition"
      />
      <p className="text-sm font-medium text-pe-slate-700 mt-5 mb-2">A distribuidora da conta é a RGE?</p>
      <div className="space-y-3">
        <button
          disabled={!cityOk}
          onClick={onRge}
          className={`${optionBase} ${optionIdle} disabled:opacity-50 disabled:pointer-events-none`}
        >
          Sim, é a RGE
        </button>
        <button
          disabled={!cityOk}
          onClick={onOther}
          className={`${optionBase} ${optionIdle} disabled:opacity-50 disabled:pointer-events-none`}
        >
          Não é, ou não sei
        </button>
      </div>
      {note && <p className="mt-4 text-xs text-pe-slate-500 leading-relaxed">{note}</p>}
    </div>
  );
}

/* ── telas de saída ── */

function BlockedView({ reason, onClose }: { reason: BlockReason; onClose: () => void }) {
  if (reason === "conta_baixa") {
    return <NotEligibleScreen onClose={onClose} />;
  }

  if (reason === "fora_rge") {
    return (
      <NotEligibleScreen
        onClose={onClose}
        title="Ainda não chegamos aí"
        message="Hoje atendemos só contas da RGE no Rio Grande do Sul. Se a tua distribuidora for outra, ainda não conseguimos gerar o desconto."
        action={<div className="mb-6" />}
      />
    );
  }

  if (reason === "nao_titular") {
    return (
      <NotEligibleScreen
        onClose={onClose}
        title="Quem assina precisa ser o titular"
        message="Como a titularidade da conta passa para a Plus Energy por contrato, quem assina precisa ser o titular. Peça para a pessoa que tem a conta no nome fazer essa verificação."
        action={<div className="mb-6" />}
      />
    );
  }

  if (reason === "sem_cnpj") {
    return (
      <NotEligibleScreen
        onClose={onClose}
        title="Aqui é para conta no CNPJ"
        message="Esta verificação vale para contas em nome da empresa. Se a conta está no CPF de uma pessoa, o caminho é o de casa."
        action={
          <Link
            href="/casa"
            onClick={onClose}
            className="mb-4 flex w-full items-center justify-center rounded-xl bg-[#15803D] hover:bg-[#166534] py-3.5 px-6 font-heading font-bold text-white transition"
          >
            Verificar como pessoa física
          </Link>
        }
      />
    );
  }
}

function DoneView({
  flow,
  outcome,
  onClose,
}: {
  flow: Flow;
  outcome: Extract<Outcome, { kind: "done" }>;
  onClose: () => void;
}) {
  const params = useMemo(
    () => ({
      origin: flow === "casa" ? ("casa_filtro" as const) : ("empresa_filtro" as const),
      segment: outcome.waSegment,
      billValue: outcome.billSample,
      qualified: outcome.qualified,
    }),
    [flow, outcome],
  );
  const url = useWhatsAppLink(params);
  const q = outcome.qualified;

  return (
    <div className="text-center pt-4">
      <h3 className="text-2xl font-heading font-bold text-pe-slate-900 mb-2">
        Dá para atender o teu caso
      </h3>
      <p className="text-pe-slate-600 mb-5 max-w-sm mx-auto">
        {q.mediaTensao
          ? "Como tem cabine ou transformador próprio, um consultor vai falar contigo. A mensagem já vai escrita."
          : "Toque no botão e envie a mensagem no WhatsApp. Ela já vai escrita com os teus dados."}
      </p>

      <ul className="text-left text-sm text-pe-slate-600 bg-pe-slate-50 border border-pe-slate-200 rounded-xl p-4 mb-5 space-y-1">
        {q.segmento && <li>Segmento: <strong className="text-pe-slate-800">{q.segmento}</strong></li>}
        <li>Conta: <strong className="text-pe-slate-800">{nb(q.faixa)}</strong></li>
        <li>Cidade: <strong className="text-pe-slate-800">{q.cidade}</strong></li>
      </ul>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick(`qualify_${flow}`)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803D] hover:bg-[#166534] py-4 px-6 font-heading text-base font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        Abrir o WhatsApp
      </a>

      <button
        onClick={onClose}
        className="mt-4 text-sm text-pe-slate-400 hover:text-pe-slate-600 transition underline underline-offset-2"
      >
        Fechar
      </button>
    </div>
  );
}
