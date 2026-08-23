import "@/global.css";
import { DonutChart } from "@/components/DonutChart";
import { useFinances } from "@/hooks/useFinances";
import { styled } from "nativewind";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const formatAmount = (amount: number) =>
  `${amount >= 0 ? "+" : "−"}$${Math.abs(amount).toFixed(2)}`;

const CHART_COLORS = [
  "#2E6FF2",
  "#00D26A",
  "#FFB84D",
  "#FF5C5C",
  "#A78BFA",
  "#22D3EE",
];

export default function App() {
  const { summary, categoryBreakdown, loading, error, refetch } = useFinances();

  const pieData = categoryBreakdown.map((item, index) => ({
    value: item.value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {error && <Text className="text-destructive text-sm">{error}</Text>}

        {summary && (
          <View className="bg-card rounded-2xl p-5 flex-row">
            <View className="flex-1 gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Monthly Expenses
              </Text>
              <Text className="text-destructive text-2xl font-sans-bold">
                {formatAmount(-summary.expenses)}
              </Text>
            </View>

            <View className="flex-1 gap-2 items-end">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Monthly Income
              </Text>
              <Text className="text-success text-2xl font-sans-bold">
                {formatAmount(summary.income)}
              </Text>
            </View>
          </View>
        )}

        <View className="bg-card rounded-2xl p-5 gap-4">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Spending by Category
          </Text>

          {pieData.length > 0 ? (
            <>
              <View className="items-center">
                <DonutChart data={pieData} />
              </View>

              <View className="gap-3">
                {categoryBreakdown.map((item, index) => (
                  <View
                    key={item.category}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <Text className="text-foreground text-sm font-sans-medium">
                        {item.category}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-sm font-sans-medium">
                      {formatAmount(-item.value)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text className="text-muted-foreground text-sm">
              No expenses yet this month.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
