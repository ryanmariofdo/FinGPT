import { api } from "@/lib/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export const TIME_RANGES = ["Daily", "Weekly", "Monthly", "Yearly"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

const RANGE_PARAM: Record<TimeRange, string> = {
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
};

type Category = { id: string; name: string };
type TrendPoint = { bucket: string; income: string; expenses: string; net: string };
type Summary = { income: string; expenses: string; net: string };

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

const monthRange = (date: Date) => {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { date_from: toISO(from), date_to: toISO(to) };
};

const sumSummaries = (summaries: Summary[]): Summary =>
  summaries.reduce(
    (acc, s) => ({
      income: String(Number(acc.income) + Number(s.income)),
      expenses: String(Number(acc.expenses) + Number(s.expenses)),
      net: String(Number(acc.net) + Number(s.net)),
    }),
    { income: "0", expenses: "0", net: "0" },
  );

export function useInsights() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Monthly");
  const [month, setMonth] = useState(() => new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [total, setTotal] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/categories").then(setCategories).catch((err) => setError(err.message));
  }, []);

  const fetchData = useCallback(() => {
    const { date_from, date_to } = monthRange(month);
    const categoryIds = selectedCategoryIds.length ? selectedCategoryIds : [null];

    setLoading(true);
    setError(null);
    Promise.all([
      Promise.all(
        categoryIds.map((categoryId) => {
          const params = new URLSearchParams({ date_from, date_to });
          if (categoryId) params.set("category_id", categoryId);
          return api.get(`/transactions/summary?${params.toString()}`);
        }),
      ),
      Promise.all(
        categoryIds.map((categoryId) => {
          const params = new URLSearchParams({ date_from, date_to, range: RANGE_PARAM[timeRange] });
          if (categoryId) params.set("category_id", categoryId);
          return api.get(`/transactions/trend?${params.toString()}`);
        }),
      ),
    ])
      .then(([summaries, trends]) => {
        setTotal(sumSummaries(summaries));

        const merged = new Map<string, TrendPoint>();
        for (const points of trends) {
          for (const point of points as TrendPoint[]) {
            const existing = merged.get(point.bucket);
            merged.set(
              point.bucket,
              existing ? sumSummaries([existing, point]) as TrendPoint & { bucket: string } : point,
            );
            merged.get(point.bucket)!.bucket = point.bucket;
          }
        }
        setTrend(Array.from(merged.values()).sort((a, b) => a.bucket.localeCompare(b.bucket)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, timeRange, selectedCategoryIds]);

  useFocusEffect(fetchData);

  const categoryOptions = useMemo(
    () => [{ id: null as string | null, name: "All" }, ...categories],
    [categories],
  );

  const toggleCategory = (id: string | null) => {
    if (id === null) {
      setSelectedCategoryIds([]);
      return;
    }
    setSelectedCategoryIds((prev) => {
      const isSelected = prev.includes(id);
      const next = isSelected ? prev.filter((c) => c !== id) : [...prev, id];
      return next;
    });
  };

  const trendBars = useMemo(() => {
    const expenses = trend.map((t) => Math.abs(Number(t.expenses)));
    const max = Math.max(1, ...expenses);
    return trend.map((t, i) => ({
      bucket: t.bucket,
      heightPercent: Math.round((expenses[i] / max) * 100),
    }));
  }, [trend]);

  return {
    timeRange,
    setTimeRange,
    monthLabel: monthLabel(month),
    goToPreviousMonth: () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)),
    goToNextMonth: () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)),
    categoryOptions,
    selectedCategoryIds,
    toggleCategory,
    total: total ? Number(total.expenses) : 0,
    trendBars,
    loading,
    error,
    refetch: fetchData,
  };
}
