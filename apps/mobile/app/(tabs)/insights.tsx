import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const TIME_RANGES = ["Daily", "Weekly", "Monthly", "Yearly"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

const CATEGORIES = [
  "All",
  "Food",
  "Groceries",
  "Transport",
  "Shopping",
  "Bills",
  "Subscriptions",
];

const TREND_BARS = [40, 65, 30, 95, 55, 30, 80];
const ACTIVE_BAR_INDICES = [1, 5];

const Insights = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("Monthly");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
      return;
    }
    setSelectedCategories((prev) => {
      const withoutAll = prev.filter((c) => c !== "All");
      const isSelected = withoutAll.includes(category);
      const next = isSelected
        ? withoutAll.filter((c) => c !== category)
        : [...withoutAll, category];
      return next.length === 0 ? ["All"] : next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-6"
        showsVerticalScrollIndicator={false}
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
          <Pressable hitSlop={8}>
            <Text className="text-muted-foreground text-base">‹</Text>
          </Pressable>
          <Text className="text-foreground text-sm font-sans-medium">
            Jul 1 – Jul 31, 2026
          </Text>
          <Pressable hitSlop={8}>
            <Text className="text-muted-foreground text-base">›</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Category Filter (multi-select)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategories.includes(category);
              return (
                <Pressable
                  key={category}
                  onPress={() => toggleCategory(category)}
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
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="bg-card rounded-2xl p-5 gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Total (filtered)
          </Text>
          <Text className="text-foreground text-4xl font-sans-bold">
            − $3,240
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Trend
          </Text>
          <View className="flex-row items-end justify-between gap-2 h-40">
            {TREND_BARS.map((height, index) => (
              <View
                key={index}
                className={`flex-1 rounded-md ${
                  ACTIVE_BAR_INDICES.includes(index) ? "bg-primary" : "bg-surface"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
