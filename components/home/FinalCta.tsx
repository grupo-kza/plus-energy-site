"use client";

import { MessageCircle, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useWhatsAppLink } from "@/lib/useWhatsAppLink";
import { trackWhatsAppClick } from "@/lib/gtm";


// Subtle sparkle positions inside card
const SPARKLES = [
  { top: "12%", left: "8%", size: 3, delay: 0 },
  { top: "20%", right: "10%", size: 2, delay: 0.8 },
  { top: "70%", left: "5%", size: 2, delay: 1.4 },
  { top: "80%", right: "7%", size: 3, delay: 0.4 },
  { top: "45%", left: "3%", size: 1.5, delay: 1.1 },
  { top: "55%", right: "4%", size: 1.5, delay: 0.6 },
];

export function FinalCta() {
  // Última seção do site: o destino padrão é o WhatsApp oficial.
  // O formulário continua disponível, mas como rota secundária.
  const whatsappUrl = useWhatsAppLink({ origin: "site_final_cta", segment: "pf" });

  const openForm = () => {
    window.dispatchEvent(new CustomEvent("open-lead-popup"));
  };

  return (
    <section className="bg-white py-24 sm:py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-2xl rounded-3xl overflow-hidden px-5 sm:px-10 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        style={{
          background: "linear-gradient(145deg, #0a1a0a 0%, #0f2a0f 60%, #102000 100%)",
        }}
      >
        {/* Gold glow top */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(230,169,0,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Gold glow bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 35% at 50% 100%, rgba(20,60,20,0.7) 0%, transparent 70%)",
          }}
        />

        {/* Sparkle dots */}
        {SPARKLES.map((s, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-pe-solar-300/30"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.6, 1] }}
            transition={{ duration: 2.5, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pe-solar-400/10 border border-pe-solar-400/30 text-xs font-semibold text-pe-solar-400 uppercase tracking-widest mb-6"
        >
          <Zap className="w-3 h-3" />
          Simulação 100% gratuita
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative font-heading text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
        >
          Comece a economizar{" "}
          <span className="gold-gradient-text">em 30-60 dias</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative text-white/50 text-base mb-8"
        >
          Sem instalação &bull; Sem burocracia &bull; 100% digital
        </motion.p>

        {/* Prova */}
        <p className="relative mb-8 text-white/60 text-xs">
          Regulamentado pela Lei 14.300/2022 (ANEEL) · CNPJ 51.181.561/0001-75
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="relative"
        >
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("final_cta")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group inline-flex items-center gap-3 sm:gap-4 rounded-full gold-gradient pl-6 sm:pl-10 pr-2.5 py-2.5 text-base sm:text-lg font-heading font-bold text-pe-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_36px_rgb(212_122_0/0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_48px_rgb(230_169_0/0.7)] hover:brightness-105 animate-pulse-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pe-solar-400 focus-visible:ring-offset-2"
          >
            FALAR NO WHATSAPP
            <span className="w-10 h-10 rounded-full bg-pe-slate-950/15 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <MessageCircle className="w-5 h-5" />
            </span>
          </motion.a>

          <p className="mt-4 text-white/40 text-sm">
            Resposta no mesmo dia &bull; sem compromisso &bull;{" "}
            <button
              type="button"
              onClick={openForm}
              className="text-white/70 underline underline-offset-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pe-solar-400 rounded"
            >
              prefiro simular pelo site
            </button>
          </p>
        </motion.div>

        {/* Guarantee badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="relative mt-5 inline-flex items-center gap-2 text-white/35 text-xs"
        >
          <Shield className="w-3.5 h-3.5 text-pe-green-500 shrink-0" />
          Sem taxa de adesão &nbsp;·&nbsp; Sem multa para sair &nbsp;·&nbsp; Aviso de 90 dias
        </motion.div>
      </motion.div>
    </section>
  );
}
