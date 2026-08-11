import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function useSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return { success: false, needsEmailConfirmation: false };
    }
    const needsEmailConfirmation = data.session === null;
    return { success: true, needsEmailConfirmation };
  };

  return { email, setEmail, password, setPassword, loading, error, signUp };
}
