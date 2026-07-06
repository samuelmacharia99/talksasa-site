import type { LeadPayload } from "./types";

export function computeLeadScore(payload: LeadPayload): number {
  let score = 0;

  if (payload.type === "demo") score += 40;
  else if (payload.type === "contact") score += 25;
  else score += 10;

  if (payload.phone?.trim()) score += 15;
  if (payload.message?.trim()) score += 5;
  if (payload.service?.trim()) score += 5;

  const attr = payload.attribution;
  if (attr?.gclid) score += 20;
  else if (attr?.utm_source) score += 10;

  return Math.min(100, score);
}

export function scoreLabel(score: number): "hot" | "warm" | "cold" {
  if (score >= 60) return "hot";
  if (score >= 35) return "warm";
  return "cold";
}
