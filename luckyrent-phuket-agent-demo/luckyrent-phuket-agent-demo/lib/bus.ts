/** Tiny event bus so "ask the agent" buttons elsewhere on the page can
 *  pre-fill the chat widget (client-side only, no dependencies). */
export type PrefillEvent =
  | { kind: "ask-price"; modelId: string }
  | { kind: "start-booking"; zoneId?: string };

export const PREFILL_EVENT = "lr:prefill";

export function emitPrefill(detail: PrefillEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PrefillEvent>(PREFILL_EVENT, { detail }));
}

export function onPrefill(handler: (detail: PrefillEvent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => handler((e as CustomEvent<PrefillEvent>).detail);
  window.addEventListener(PREFILL_EVENT, listener);
  return () => window.removeEventListener(PREFILL_EVENT, listener);
}
