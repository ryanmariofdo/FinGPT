import { api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

export const SOURCES = ["All", "Auto (SMS)", "Manual", "Scanned"] as const;
export type Source = (typeof SOURCES)[number];

export const TYPES = ["All", "Expenses", "Income"] as const;
export type TxType = (typeof TYPES)[number];

export type Transaction = {
  id: string;
  title: string;
  category: string;
  source: Exclude<Source, "All">;
  amount: number;
  occurredAt: string;
};

type Category = { id: string; name: string };

type ApiTransaction = {
  id: string;
  title: string;
  amount: string;
  category_id: string | null;
  source: "manual" | "sms" | "receipt";
  occurred_at: string;
};

type Summary = { income: string; expenses: string; net: string };

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

const monthRange = (date: Date) => {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { date_from: toISO(from), date_to: toISO(to) };
};

export function useFinances() {
  const [month, setMonth] = useState(() => new Date());
  const [source, setSource] = useState<Source>("All");
  const [type, setType] = useState<TxType>("All");

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { date_from, date_to } = monthRange(month);
    const params = new URLSearchParams({ date_from, date_to });
    if (source === "Auto (SMS)") params.set("source", "sms");
    if (source === "Manual") params.set("source", "manual");
    if (source === "Scanned") params.set("source", "receipt");
    if (type === "Income") params.set("type", "income");
    if (type === "Expenses") params.set("type", "expense");

    setLoading(true);
    setError(null);
    Promise.all([
      categories.length ? Promise.resolve(categories) : api.get("/categories"),
      api.get(`/transactions?${params.toString()}`),
      api.get(`/transactions/summary?date_from=${date_from}&date_to=${date_to}`),
    ])
      .then(([cats, txs, summ]) => {
        setCategories(cats);
        setTransactions(txs);
        setSummary(summ);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, source, type]);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string | null) => (id ? (map.get(id) ?? "Uncategorized") : "Uncategorized");
  }, [categories]);

  const items: Transaction[] = useMemo(
    () =>
      transactions.map((tx) => ({
        id: tx.id,
        title: tx.title,
        category: categoryName(tx.category_id),
        source:
          tx.source === "sms" ? "Auto (SMS)" : tx.source === "receipt" ? "Scanned" : "Manual",
        amount: Number(tx.amount),
        occurredAt: tx.occurred_at,
      })),
    [transactions, categoryName],
  );

  const groups = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sorted = [...items].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

    const buckets = new Map<string, Transaction[]>();
    for (const item of sorted) {
      const occurred = new Date(item.occurredAt);
      const label = isSameDay(occurred, today)
        ? "Today"
        : isSameDay(occurred, yesterday)
          ? "Yesterday"
          : occurred.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      buckets.set(label, [...(buckets.get(label) ?? []), item]);
    }
    return Array.from(buckets.entries()).map(([label, txs]) => ({ label, items: txs }));
  }, [items]);

  return {
    source,
    setSource,
    type,
    setType,
    monthLabel: monthLabel(month),
    goToPreviousMonth: () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)),
    goToNextMonth: () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)),
    groups,
    summary: summary
      ? { income: Number(summary.income), expenses: Number(summary.expenses), net: Number(summary.net) }
      : null,
    loading,
    error,
  };
}
