import { TIME_RANGES, useInsights } from "@/hooks/useInsights";
import { styled } from "nativewind";
import React from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const formatAmount = (amount: number) =>
  `${amount >= 0 ? "" : "− "}$${Math.abs(amount).toFixed(0)}`;

const Insights = () => {
  const {
    timeRange,
    setTimeRange,
    monthLabel,
    goToPreviousMonth,
    goToNextMonth,
    categoryOptions,
    selectedCategoryIds,
    toggleCategory,
    total,
    trendBars,
    loading,
    error,
    refetch,
  } = useInsights();

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text className="text-foreground text-2xl font-sans-bold">
          Insights
        </Text>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Time Range
          </Text>
          <View className="flex-row bg-card rounded-full p-1">
            {TIME_RANGES.map((range) => {
              const isActive = range === timeRange;
              return (
                <Pressable
                  key={range}
                  onPress={() => setTimeRange(range)}
                  className={`flex-1 items-center py-2 rounded-full ${
                    isActive ? "bg-primary" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-semibold ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {range}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-card rounded-2xl px-4 py-4">
          <Pressable hitSlop={8} onPress={goToPreviousMonth}>
            <Text className="text-muted-foreground text-base">‹</Text>
          </Pressable>
          <Text className="text-foreground text-sm font-sans-medium">
            {monthLabel}
          </Text>
          <Pressable hitSlop={8} onPress={goToNextMonth}>
            <Text className="text-muted-foreground text-base">›</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Category Filter (multi-select)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const isActive =
                category.id === null
                  ? selectedCategoryIds.length === 0
                  : selectedCategoryIds.includes(category.id);
              return (
                <Pressable
                  key={category.id ?? "all"}
                  onPress={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-full ${
                    isActive
                      ? "bg-primary"
                      : "bg-card border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-medium ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error && <Text className="text-destructive text-sm">{error}</Text>}

        <View className="bg-card rounded-2xl p-5 gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Total (filtered)
          </Text>
          <Text className="text-foreground text-4xl font-sans-bold">
            {formatAmount(-total)}
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Trend
          </Text>
          <View className="flex-row items-end justify-between gap-2 h-40">
            {trendBars.map((bar) => (
              <View
                key={bar.bucket}
                className="flex-1 rounded-md bg-primary"
                style={{ height: `${bar.heightPercent}%` }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
