import { SOURCES, TYPES, useFinances } from "@/hooks/useFinances";
import { styled } from "nativewind";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const formatAmount = (amount: number) =>
  `${amount >= 0 ? "+" : "−"}$${Math.abs(amount).toFixed(2)}`;

const Finances = () => {
  const {
    source,
    setSource,
    type,
    setType,
    monthLabel,
    goToPreviousMonth,
    goToNextMonth,
    groups,
    summary,
    loading,
    error,
  } = useFinances();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-foreground text-2xl font-sans-bold">
          Finances
        </Text>

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
            Source
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SOURCES.map((s) => {
              const isActive = s === source;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSource(s)}
                  className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                    isActive ? "bg-primary" : "bg-card border border-border"
                  }`}
                >
                  {s !== "All" && (
                    <View
                      className={`w-2 h-2 rounded-full ${
                        isActive
                          ? "bg-primary-foreground"
                          : s === "Auto (SMS)"
                            ? "bg-primary"
                            : "bg-muted-foreground"
                      }`}
                    />
                  )}
                  <Text
                    className={`text-sm font-sans-medium ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Type
          </Text>
          <View className="flex-row bg-card rounded-full p-1">
            {TYPES.map((t) => {
              const isActive = t === type;
              return (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  className={`flex-1 items-center py-2 rounded-full ${
                    isActive ? "bg-primary" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-semibold ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {loading && <ActivityIndicator />}
        {error && <Text className="text-destructive text-sm">{error}</Text>}

        {summary && (
          <View className="bg-card rounded-2xl p-5 flex-row justify-between">
            <View className="gap-1">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Income
              </Text>
              <Text className="text-success text-base font-sans-bold">
                {formatAmount(summary.income)}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Expenses
              </Text>
              <Text className="text-destructive text-base font-sans-bold">
                {formatAmount(-summary.expenses)}
              </Text>
            </View>
            <View className="gap-1">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Net
              </Text>
              <Text className="text-foreground text-base font-sans-bold">
                {formatAmount(summary.net)}
              </Text>
            </View>
          </View>
        )}

        {groups.map(({ label, items }) => {
          return (
            <View key={label} className="gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                {label}
              </Text>
              <View className="gap-2">
                {items.map((tx) => (
                  <View
                    key={tx.id}
                    className="flex-row items-center justify-between bg-card rounded-2xl px-4 py-3"
                  >
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <View
                        className={`w-2 h-2 rounded-full ${
                          tx.source === "Auto (SMS)"
                            ? "bg-primary"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <View className="gap-0.5 flex-1">
                        <Text
                          className="text-foreground text-sm font-sans-semibold"
                          numberOfLines={1}
                        >
                          {tx.title}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                          {tx.category} · {tx.source}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm font-sans-semibold ${
                        tx.amount >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {formatAmount(tx.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Finances;
