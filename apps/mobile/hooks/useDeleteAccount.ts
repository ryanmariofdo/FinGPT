import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";

export function useDeleteAccount() {
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async () => {
    setDeleting(true);
    setError(null);

    const { data, error: sessionError } = await supabase.auth.getSession();
    const email = data.session?.user.email;
    if (sessionError || !email) {
      setError("Could not verify your session. Please sign in again.");
      setDeleting(false);
      return false;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (reauthError) {
      setError("Incorrect password.");
      setDeleting(false);
      return false;
    }

    try {
      await api.delete("/account");
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
      return false;
    }

    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
    return true;
  };

  return { password, setPassword, deleting, error, deleteAccount };
}
