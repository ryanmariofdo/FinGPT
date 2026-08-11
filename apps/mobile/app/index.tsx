import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  if (session === undefined) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={session ? "/(tabs)" : "/(auth)/sign-in"} />;
}
