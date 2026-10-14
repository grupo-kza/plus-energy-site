"use client";

import { useEffect, useState } from "react";

// Banner de cookies (decisão do Lucas, 14/10/2026: 2efe03a5-424).
// O consentimento começa negado (script "consent-default" no layout) e só vira
// "granted" quando a pessoa aceita. A escolha fica salva no navegador.
const KEY = "pe_consent";

type Choice = "granted" | "denied";

function applyConsent(choice: Choice) {
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag usa o objeto arguments, não um array
  // eslint-disable-next-line prefer-rest-params
  function gtag(..._args: unknown[]) { w.dataLayer.push(arguments); }
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  w.dataLayer.push({ event: "consent_update", consent_choice: choice });
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function choose(choice: Choice) {
    try { localStorage.setItem(KEY, choice); } catch { /* segue sem salvar */ }
    applyConsent(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/95 p-4 text-sm text-white/85 shadow-2xl backdrop-blur sm:flex sm:items-center sm:gap-4"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <p className="leading-snug">
        A Plus Energy usa cookies para medir visitas e anúncios. Aceitar ou recusar não muda nada no site.{" "}
        <a href="/politica-de-privacidade" className="underline text-white">Política de privacidade</a>.
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-xl border border-white/30 px-4 py-2.5 font-semibold text-white hover:bg-white/10"
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-xl bg-accent px-4 py-2.5 font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
