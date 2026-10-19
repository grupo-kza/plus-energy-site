"use client";

import { useEffect, useSyncExternalStore } from "react";

// ========================================
// Plus Energy: página com filtro em etapas
// ========================================
// Páginas por público (/casa, /empresas) se registram aqui. Cabeçalho, rodapé
// e botão flutuante leem o registro e, enquanto houver filtro na página, abrem
// o filtro em vez de mandar direto para o WhatsApp ou para o popup antigo.

export type QualifyFlow = "casa" | "empresa";

export const OPEN_QUALIFY_EVENT = "open-qualify-modal";

let current: QualifyFlow | null = null;
const listeners = new Set<() => void>();

function set(flow: QualifyFlow | null) {
  current = flow;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Fluxo da página atual, ou null quando a página não tem filtro. */
export function useQualifyFlow(): QualifyFlow | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** A página com filtro chama isto uma vez. */
export function useRegisterQualifyFlow(flow: QualifyFlow) {
  useEffect(() => {
    set(flow);
    return () => set(null);
  }, [flow]);
}

/** Pede à página para abrir o filtro dela. */
export function openQualifyModal() {
  window.dispatchEvent(new CustomEvent(OPEN_QUALIFY_EVENT));
}
