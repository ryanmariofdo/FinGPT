import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SOURCES = ["All", "Auto (SMS)", "Manual"] as const;
type Source = (typeof SOURCES)[number];

const TYPES = ["All", "Expenses", "Income"] as const;
type TxType = (typeof TYPES)[number];

type Transaction = {
  id: string;
  title: string;
  category: string;
  source: Exclude<Source, "All">;
  amount: number;
  group: "Today" | "Yesterday";
};

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Trader Joe's",
    category: "Groceries",
    source: "Auto (SMS)",
    amount: -47.2,
    group: "Today",
  },
  {
    id: "2",
    title: "Freelance payout",
    category: "Freelance",
    source: "Manual",
    amount: 650.0,
    group: "Today",
  },
  {
    id: "3",
    title: "Shell Gas Station",
    category: "Transport",
    source: "Auto (SMS)",
    amount: -38.0,
    group: "Yesterday",
  },
  {
    id: "4",
    title: "Grocery run",
    category: "Groceries",
    source: "Manual",
    amount: -62.4,
    group: "Yesterday",
  },
  {
    id: "5",
    title: "Salary — Acme Corp",
    category: "Salary",
    source: "Auto (SMS)",
    amount: 3200.0,
    group: "Yesterday",
  },
];

const GROUPS: Array<Transaction["group"]> = ["Today", "Yesterday"];

const formatAmount = (amount: number) =>
  `${amount >= 0 ? "+" : "−"}$${Math.abs(amount).toFixed(2)}`;

const Finances = () => {
  const [source, setSource] = useState<Source>("All");
  const [type, setType] = useState<TxType>("All");

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

        <View className="bg-card rounded-2xl p-5 flex-row justify-between">
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
              Income
            </Text>
            <Text className="text-success text-base font-sans-bold">
              +$4,120
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
              Expenses
            </Text>
            <Text className="text-destructive text-base font-sans-bold">
              −$3,240
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
              Net
            </Text>
            <Text className="text-foreground text-base font-sans-bold">
              +$880
            </Text>
          </View>
        </View>

        {GROUPS.map((group) => {
          const items = TRANSACTIONS.filter((t) => t.group === group);
          if (items.length === 0) return null;
          return (
            <View key={group} className="gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                {group}
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
