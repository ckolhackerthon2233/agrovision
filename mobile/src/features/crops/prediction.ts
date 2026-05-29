import { Crop, GrowthStage } from "./schema";

// A lightweight, deterministic yield "prediction" derived from a crop's own
// data (area, growth stage, health). It is NOT a trained ML model — it's a
// transparent heuristic so the screen shows realistic, stable numbers. Swap in
// a real model behind the same shape later.

export type RiskLevel = "low" | "medium" | "high";
export type Risk = { label: string; icon: string; level: RiskLevel; score: number };

export type YieldPrediction = {
  harvestDate: Date;
  daysToHarvest: number;
  expectedYieldTonnes: number;
  lowYieldTonnes: number;
  highYieldTonnes: number;
  yieldPerHa: number;
  pricePerTonne: number;
  revenue: number;
  cost: number;
  profit: number;
  confidence: number; // 0–100
  risks: Risk[];
  overallRisk: RiskLevel;
  projection: { label: string; value: number }[]; // cumulative growth % by month
};

const STAGE_PROGRESS: Record<GrowthStage, number> = {
  SEEDLING: 0.1,
  VEGETATIVE: 0.35,
  FLOWERING: 0.6,
  MATURING: 0.85,
  HARVESTED: 1,
};

const BASE_YIELD_PER_HA = 4.2; // tonnes (generic)
const PRICE_PER_TONNE = 320; // USD
const COST_PER_HA = 210; // USD

const DAY = 86_400_000;
const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function toLevel(score: number): RiskLevel {
  return score >= 66 ? "high" : score >= 40 ? "medium" : "low";
}

export function predictYield(crop: Crop): YieldPrediction {
  const seed = hash(crop.id);
  const health = clamp(crop.healthScore, 0, 100) / 100;
  const healthFactor = 0.55 + health * 0.45; // 0.55–1.0

  const yieldPerHa = BASE_YIELD_PER_HA * healthFactor;
  const expectedYieldTonnes = round1(crop.areaHectares * yieldPerHa);
  const lowYieldTonnes = round1(expectedYieldTonnes * 0.8);
  const highYieldTonnes = round1(expectedYieldTonnes * 1.18);

  const revenue = Math.round(expectedYieldTonnes * PRICE_PER_TONNE);
  const cost = Math.round(crop.areaHectares * COST_PER_HA);
  const profit = revenue - cost;

  let harvestDate: Date;
  if (crop.expectedHarvestDate) {
    harvestDate = new Date(crop.expectedHarvestDate);
  } else {
    const remainingDays = (1 - STAGE_PROGRESS[crop.growthStage]) * 120;
    harvestDate = new Date(Date.now() + remainingDays * DAY);
  }
  const daysToHarvest = Math.max(0, Math.round((harvestDate.getTime() - Date.now()) / DAY));

  const confidence = clamp(
    Math.round(58 + health * 32 + (crop.expectedHarvestDate ? 6 : 0) + (seed % 4)),
    40,
    97,
  );

  const pest = clamp(Math.round((1 - health) * 80 + (seed % 20)), 5, 95);
  const weather = clamp(Math.round(35 + (seed % 40)), 5, 95);
  const market = clamp(Math.round(30 + ((seed >> 3) % 45)), 5, 95);
  const water = clamp(Math.round((1 - health) * 50 + ((seed >> 5) % 35)), 5, 95);

  const risks: Risk[] = [
    { label: "Pests & disease", icon: "🐛", level: toLevel(pest), score: pest },
    { label: "Weather", icon: "🌦️", level: toLevel(weather), score: weather },
    { label: "Market price", icon: "💱", level: toLevel(market), score: market },
    { label: "Water stress", icon: "💧", level: toLevel(water), score: water },
  ];
  const avgRisk = (pest + weather + market + water) / 4;
  const overallRisk = toLevel(avgRisk);

  // Logistic (S-curve) cumulative growth toward harvest, 6 points.
  const projection = Array.from({ length: 6 }, (_, i) => {
    const t = (i + 1) / 6;
    const s = 1 / (1 + Math.exp(-8 * (t - 0.5)));
    return { label: `M${i + 1}`, value: Math.round(s * 100) };
  });

  return {
    harvestDate,
    daysToHarvest,
    expectedYieldTonnes,
    lowYieldTonnes,
    highYieldTonnes,
    yieldPerHa: round1(yieldPerHa),
    pricePerTonne: PRICE_PER_TONNE,
    revenue,
    cost,
    profit,
    confidence,
    risks,
    overallRisk,
    projection,
  };
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#2D6A4F",
  medium: "#C9821B",
  high: "#C0392B",
};
export const RISK_TONE: Record<RiskLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};
