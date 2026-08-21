import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import {
  requestReadSMSPermission,
  startReadSMS,
} from "@maniac-tech/react-native-expo-read-sms";
import { useEffect } from "react";
import { Platform } from "react-native";

// Module-level, not component state: survives re-renders and JS reloads
// within the same app process, so startReadSMS is only ever called once.
let listenerStarted = false;

export function useSmsCapture() {
  useEffect(() => {
    if (Platform.OS !== "android" || listenerStarted) return;

    const start = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || listenerStarted) return;

      const granted = await requestReadSMSPermission();
      if (!granted || listenerStarted) return;

      listenerStarted = true;
      startReadSMS(
        (_status, sms) => {
          if (!sms) return;
          api.post("/transactions/ingest-sms", { raw_text: sms }).catch(() => {});
        },
        () => {}
      );
    };

    start();
  }, []);
}
