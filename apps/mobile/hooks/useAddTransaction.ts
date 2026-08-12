import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Category = { id: string; name: string };

export function useAddTransaction(kind: "expense" | "income") {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/categories").then(setCategories).catch((err) => setError(err.message));
  }, []);

  const save = async () => {
    const parsed = Number(amount);
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than 0");
      return false;
    }

    setSaving(true);
    setError(null);
    try {
      await api.post("/transactions", {
        title: title.trim(),
        amount: kind === "expense" ? -parsed : parsed,
        category_id: categoryId,
        occurred_at: new Date().toISOString().slice(0, 10),
      });
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    title,
    setTitle,
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    categories,
    saving,
    error,
    save,
  };
}
