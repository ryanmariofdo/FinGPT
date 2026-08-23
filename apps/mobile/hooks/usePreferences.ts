import { CurrencyCode } from "@/lib/currency";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export function usePreferences() {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/preferences")
      .then((prefs: { currency: CurrencyCode }) => setCurrencyState(prefs.currency))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const setCurrency = async (code: CurrencyCode): Promise<boolean> => {
    setError(null);
    try {
      const prefs: { currency: CurrencyCode } = await api.patch("/preferences", {
        currency: code,
      });
      setCurrencyState(prefs.currency);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return { currency, loading, error, setCurrency };
}
