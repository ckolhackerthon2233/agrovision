import { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { StatCard } from "@/src/components/ui/StatCard";
import { Badge } from "@/src/components/ui/Badge";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { AnimatedBar } from "@/src/components/AnimatedBar";
import { AnimatedMeter } from "@/src/components/AnimatedMeter";
import { useCrop } from "@/src/features/crops/hooks";
import { predictYield, RISK_COLOR, RISK_TONE } from "@/src/features/crops/prediction";
import { Colors } from "@/src/constants/Colors";

const BAR_RAMP = ["#95D5B2", "#74C69D", "#52B788", "#40916C", "#2D6A4F", "#1B4332"];

function money(n: number) {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}
function shortDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function YieldPredictionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: crop, isLoading, isError } = useCrop(id);

  const p = useMemo(() => (crop ? predictYield(crop) : null), [crop]);

  return (
    <Screen>
      <PageHeader title="Yield Prediction" subtitle={crop ? crop.name : undefined} />

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError || !crop || !p ? (
        <EmptyState icon="⚠️" title="Can't predict yet" text="This crop couldn't be loaded." />
      ) : (
        <>
          {/* AI hero */}
          <Card variant="solid">
            <View className="flex-row items-center justify-between">
              <Text className="text-white/80 text-xs font-semibold">🤖 AI ESTIMATED YIELD</Text>
              <View className="badge" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
                <Text className="badge__label text-white">{p.confidence}% confidence</Text>
              </View>
            </View>
            <Text className="text-white text-4xl font-extrabold mt-2">{p.expectedYieldTonnes} t</Text>
            <Text className="text-white/80 text-sm mt-1">
              Range {p.lowYieldTonnes}–{p.highYieldTonnes} t · {p.yieldPerHa} t/ha
            </Text>
            <View className="mt-3">
              <AnimatedMeter pct={p.confidence} color="#FFFFFF" />
            </View>
          </Card>

          {/* Key figures */}
          <View className="flex-row gap-3">
            <StatCard className="flex-1" icon="🗓️" value={shortDate(p.harvestDate)} label={`Harvest · ${p.daysToHarvest}d`} />
            <StatCard className="flex-1" icon="🌾" value={`${p.expectedYieldTonnes}t`} label="Expected yield" />
            <StatCard
              className="flex-1"
              icon={p.profit >= 0 ? "💰" : "⚠️"}
              value={money(p.profit)}
              label="Profit forecast"
            />
          </View>

          {/* Yield outlook chart */}
          <Card>
            <Text className="card__title">Season yield outlook</Text>
            <Text className="card__subtitle">Projected growth toward harvest (% of final yield).</Text>
            <View className="flex-row items-end gap-2 mt-4" style={{ height: 168 }}>
              {p.projection.map((point, i) => (
                <AnimatedBar
                  key={point.label}
                  pct={point.value}
                  value={`${point.value}%`}
                  label={point.label}
                  color={BAR_RAMP[i] ?? Colors.brand}
                  delay={i * 110}
                />
              ))}
            </View>
          </Card>

          {/* Profit breakdown */}
          <Card>
            <Text className="card__title mb-3">Profit forecast</Text>
            <ProfitRow label="Revenue" value={money(p.revenue)} pct={100} color={Colors.brand} delay={0} />
            <View className="h-3" />
            <ProfitRow
              label="Input cost"
              value={money(p.cost)}
              pct={p.revenue > 0 ? (p.cost / p.revenue) * 100 : 0}
              color="#C9821B"
              delay={120}
            />
            <View className="flex-row justify-between mt-4 pt-3 border-t border-line">
              <Text className="text-ink font-bold">Net profit</Text>
              <Text className="text-ink font-extrabold">{money(p.profit)}</Text>
            </View>
          </Card>

          {/* Risk analysis */}
          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="card__title">Risk analysis</Text>
              <Badge label={`${p.overallRisk} risk`} tone={RISK_TONE[p.overallRisk]} />
            </View>
            <View className="gap-3">
              {p.risks.map((risk, i) => (
                <View key={risk.label} className="gap-1.5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-ink text-sm font-semibold">
                      {risk.icon}  {risk.label}
                    </Text>
                    <Text className="text-muted text-xs font-bold capitalize">{risk.level}</Text>
                  </View>
                  <AnimatedMeter pct={risk.score} color={RISK_COLOR[risk.level]} delay={i * 120} />
                </View>
              ))}
            </View>
          </Card>

          <Text className="text-faint text-xs text-center px-4 leading-5">
            AI estimate based on area, growth stage and crop health. Figures are indicative, not a
            guarantee of actual harvest.
          </Text>
        </>
      )}
    </Screen>
  );
}

function ProfitRow({
  label,
  value,
  pct,
  color,
  delay,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
  delay: number;
}) {
  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between">
        <Text className="text-muted text-sm">{label}</Text>
        <Text className="text-ink text-sm font-bold">{value}</Text>
      </View>
      <AnimatedMeter pct={pct} color={color} delay={delay} />
    </View>
  );
}
