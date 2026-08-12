import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="bg-card rounded-2xl p-5 gap-2">
        <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
          Total Spent
        </Text>

        <Text className="text-foreground text-4xl font-sans-bold">
          − $3,240
        </Text>

        <View className="flex-row items-center gap-1">
          <Text className="text-warning text-xs font-sans-medium">▲</Text>
          <Text className="text-warning text-xs font-sans-medium">
            12% vs last period
          </Text>
        </View>
      </View>

      {/* TEMPORARY: plain links until Add Expense/Income get real entry points in the UI */}
      <View style={{ marginTop: 16, gap: 8 }}>
        <Link href="/(add)/add-expense">Add Expense</Link>
        <Link href="/(add)/add-income">Add Income</Link>
      </View>
    </SafeAreaView>
  );
}
