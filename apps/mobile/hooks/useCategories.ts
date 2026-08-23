import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export type Category = { id: string; name: string; user_id: string | null };

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/categories")
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createCategory = async (name: string): Promise<Category | null> => {
    setError(null);
    try {
      const category: Category = await api.post("/categories", { name });
      setCategories((prev) => [...prev, category]);
      return category;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };

  const updateCategory = async (id: string, name: string): Promise<Category | null> => {
    setError(null);
    try {
      const category: Category = await api.patch(`/categories/${id}`, { name });
      setCategories((prev) => prev.map((c) => (c.id === id ? category : c)));
      return category;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return { categories, loading, error, createCategory, updateCategory, deleteCategory };
}
