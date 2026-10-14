"use client";

import Image from "next/image";
import { CASES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Quote, Star, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

type Case = (typeof CASES)[number];

/* ─── Featured card (Maicon) ─────────────────────────────────────── */
function FeaturedCard({ c }: { c: Case }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-pe-slate-100 shadow-[0_4px_24px_rgb(0_0_0/0.08)] h-full">
      <div className="grid sm:grid-cols-2 h-full">
        {/* Left */}
        <div className="p-5 sm:p-7 bg-white">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 mb-3">
            <Image src={c.image} alt={c.name} width={44} height={44} className="w-11 h-11 rounded-full border-2 border-pe-solar-300 shrink-0 object-cover" />
            <div className="min-w-0">
              <p className="font-heading font-bold text-black leading-tight">{c.name}</p>
              <p className="text-xs text-pe-slate-500 truncate">{c.company}</p>
            </div>
          </div>
          {/* Location */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pe-slate-50 border border-pe-slate-100 text-[11px] text-pe-slate-500 whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5" />{c.location}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3.5 rounded-xl bg-pe-slate-50 mb-3.5">
            <div className="text-center">
              <p className="text-[10px] text-pe-slate-400 uppercase tracking-wide mb-0.5">Antes</p>
              <p className="font-heading text-base sm:text-lg font-bold text-pe-slate-400 line-through">{formatCurrency(c.previousBill)}</p>
            </div>
            <TrendingDown className="w-5 h-5 text-pe-solar-500 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-pe-green-600 uppercase tracking-wide mb-0.5 font-semibold">Agora</p>
              <p className="font-heading text-base sm:text-lg font-bold text-pe-green-600">{formatCurrency(c.currentBill)}</p>
            </div>
          </div>

          <p className="text-[11px] text-pe-slate-500 mb-4">Conta de um mês, antes e depois da Plus Energy.</p>

          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pe-green-50 border border-pe-green-100 text-xs font-semibold text-pe-green-700">
              {c.type}
            </span>
          </div>
        </div>

        {/* Right — testimonial */}
        <div className="relative p-7 flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, #0a1a0a 0%, #0f2a0f 60%, #1a2a00 100%)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgb(230 169 0 / 0.12) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-pe-solar-400 text-pe-solar-400" />)}
            </div>
            <Quote className="w-7 h-7 text-pe-solar-400/30 mb-3" aria-hidden="true" />
            <blockquote className="text-base text-white/90 leading-relaxed font-light italic">
              &ldquo;{c.testimonial}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs text-pe-solar-400/70">&mdash; {c.name}, {c.company}</p>
          </div>
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Economizado em {c.months} meses</p>
            <p className="font-heading text-3xl font-extrabold text-pe-solar-400 drop-shadow-[0_0_20px_rgb(230_169_0/0.4)]">
              {formatCurrency(c.totalSavings)}
            </p>
            <p className="text-xs text-white/40 mt-0.5">em {c.months} meses</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */
export function CaseMaicon() {
  const [featured] = CASES;

  return (
    <section className="relative bg-white py-[var(--section-py-mobile)] lg:py-[var(--section-py)] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pe-solar-50 border border-pe-solar-200 text-xs font-semibold text-pe-solar-600 uppercase tracking-widest mb-6">
            <Star className="w-3.5 h-3.5" />
            Casos reais
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-black">
            Quem já <span className="text-pe-solar-400">economiza</span>
          </h2>
          <p className="mt-3 text-lg text-pe-slate-500">
            O resultado do Mercado e Açougue RK, em Marcelino Ramos
          </p>
        </motion.div>

        {/* Bento — unified panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-pe-slate-100 shadow-[0_8px_48px_rgb(0_0_0/0.08)] overflow-hidden bg-pe-slate-50/40 p-3 flex flex-col gap-3"
        >
          <FeaturedCard c={featured} />
        </motion.div>
      </div>
    </section>
  );
}
