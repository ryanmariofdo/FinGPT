import "@/global.css";
import { useSmsCapture } from "@/hooks/useSmsCapture";
import { Stack } from "expo-router";

export default function RootLayout() {
  useSmsCapture();
  return <Stack screenOptions={{ headerShown: false }} />;
}
