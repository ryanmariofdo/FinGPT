import { useCategories } from "@/hooks/useCategories";
import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

type ReceiptItem = { id: string; name: string; amount: string };

type ReceiptItemDraft = { name: string; amount: string };

type ApiTransaction = {
  id: string;
  title: string;
  amount: string;
  category_id: string | null;
  source: "manual" | "sms" | "receipt";
  occurred_at: string;
  needs_review: boolean;
  image_url: string | null;
  items: ReceiptItem[];
};

export function useTransactionDetail(id: string) {
  const [transaction, setTransaction] = useState<ApiTransaction | null>(null);
  const { categories, createCategory } = useCategories();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<"expense" | "income">("expense");
  const [occurredAt, setOccurredAt] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [items, setItems] = useState<ReceiptItemDraft[]>([]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/transactions/${id}`)
      .then((tx: ApiTransaction) => {
        setTransaction(tx);
        setTitle(tx.title);
        setAmount(String(Math.abs(Number(tx.amount))));
        setKind(Number(tx.amount) < 0 ? "expense" : "income");
        setOccurredAt(tx.occurred_at);
        setCategoryId(tx.category_id);
        setItems(tx.items.map((item) => ({ name: item.name, amount: item.amount })));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const categoryName = transaction?.category_id
    ? (categories.find((c) => c.id === transaction.category_id)?.name ?? "Uncategorized")
    : "Uncategorized";

  const updateItem = (index: number, field: "name" | "amount", value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", amount: "" }]);
  };

  const save = async () => {
    const parsedAmount = Number(amount);
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0");
      return false;
    }

    const parsedItems = items
      .filter((item) => item.name.trim())
      .map((item) => ({ name: item.name.trim(), amount: Number(item.amount) || 0 }));

    setSaving(true);
    setError(null);
    try {
      await api.post(`/transactions/${id}/receipt-items`, {
        title: title.trim(),
        category_id: categoryId,
        amount: kind === "expense" ? -parsedAmount : parsedAmount,
        occurred_at: occurredAt,
        items: parsedItems,
      });
      setEditing(false);
      refresh();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    setError(null);
    try {
      await api.delete(`/transactions/${id}`);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    transaction,
    categoryName,
    categories,
    createCategory,
    loading,
    error,
    refresh,
    editing,
    setEditing,
    title,
    setTitle,
    amount,
    setAmount,
    kind,
    setKind,
    occurredAt,
    setOccurredAt,
    categoryId,
    setCategoryId,
    items,
    updateItem,
    removeItem,
    addItem,
    saving,
    save,
    deleting,
    remove,
  };
}
