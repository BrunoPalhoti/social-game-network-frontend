import type { JourneyStatus } from "@/data/types/journey";

/** Status que contam como "jogo zerado". */
export const ZERADOS_STATUS: JourneyStatus[] = ["COMPLETED", "PLATINUM"];

export function isZeradoStatus(status: string): status is "COMPLETED" | "PLATINUM" {
  return status === "COMPLETED" || status === "PLATINUM";
}

/** Formata YYYY-MM-DD como DD/MM/YYYY (evita mudar dia por timezone). */
export function formatJourneyDate(iso?: string): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
