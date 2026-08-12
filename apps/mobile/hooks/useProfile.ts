import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useProfile() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user.email ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const initial = email ? email.charAt(0).toUpperCase() : "?";

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  };

  return { email, initial, signOut };
}
