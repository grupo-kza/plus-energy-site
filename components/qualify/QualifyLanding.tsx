"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wrench, Ban, Unlock, ArrowRight } from "lucide-react";
import { QualifyModal } from "./QualifyModal";
import { trackCtaClick } from "@/lib/gtm";
import { OPEN_QUALIFY_EVENT, useRegisterQualifyFlow } from "@/lib/qualifyGate";

type Flow = "casa" | "empresa";

export interface QualifyLandingProps {
  flow: Flow;
  title: React.ReactNode;
  subtitle: string;
  cta: string;
  /** Imagem de fundo em /public. */
  bg: string;
  /** Pontos curtos abaixo do botão. */
  points: { icon?: "wrench" | "ban" | "unlock" | "shield"; text: string }[];
  /** Conteúdo da página abaixo do hero. */
  children?: React.ReactNode;
  /** Texto da chamada final (repete o botão). */
  closing: string;
}

const ICONS = { wrench: Wrench, ban: Ban, unlock: Unlock, shield: ShieldCheck };

export function QualifyButton({
  flow,
  label,
  location,
  onOpen,
}: {
  flow: Flow;
  label: string;
  location: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCtaClick(label, `${flow}_${location}`);
        onOpen();
      }}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#15803D] hover:bg-[#166534] px-8 py-4 font-heading text-lg font-bold text-white shadow-[0_8px_28px_rgb(21_128_61/0.35)] transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803D] focus-visible:ring-offset-2"
    >
      {label}
      <ArrowRight className="h-5 w-5 shrink-0" />
    </button>
  );
}

export function QualifyLanding({
  flow,
  title,
  subtitle,
  cta,
  bg,
  points,
  children,
  closing,
}: QualifyLandingProps) {
  const [open, setOpen] = useState(false);

  // Avisa cabeçalho, rodapé e botão flutuante que esta página tem filtro,
  // e deixa eles abrirem o filtro daqui.
  useRegisterQualifyFlow(flow);
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_QUALIFY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_QUALIFY_EVENT, onOpen);
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-pe-green-950 px-4 pt-28 pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/80" />

        <div className="relative mx-auto w-full max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <QualifyButton flow={flow} label={cta} location="hero" onOpen={() => setOpen(true)} />
          </motion.div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
            {points.map(({ icon = "shield", text }) => {
              const Icon = ICONS[icon];
              return (
                <li key={text} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 text-pe-solar-400 shrink-0" />
                  {text}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {children}

      <section className="bg-pe-slate-50 px-4 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-black mb-6">{closing}</h2>
          <div className="flex justify-center">
            <QualifyButton flow={flow} label={cta} location="final" onOpen={() => setOpen(true)} />
          </div>
        </div>
      </section>

      <QualifyModal flow={flow} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
