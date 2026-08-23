import { CategoryPicker } from "@/components/CategoryPicker";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { usePreferences } from "@/hooks/usePreferences";
import { CURRENCIES } from "@/lib/currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const AddIncome = () => {
  const { currency } = usePreferences();
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";

  const {
    title,
    setTitle,
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    categories,
    createCategory,
    saving,
    error,
    save,
  } = useAddTransaction("income");

  const handleSubmit = async () => {
    const success = await save();
    if (success) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          Add Income
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-5 gap-6">
        <View className="items-center py-6 gap-2">
          <View className="flex-row items-center gap-1 border-b border-border pb-2">
            <Text className="text-success text-4xl font-sans-extrabold">
              {currencySymbol}
            </Text>
            <TextInput
              placeholder="0"
              placeholderTextColor="#5A6068"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus
              className="text-success text-5xl font-sans-extrabold"
              style={{ minWidth: 60 }}
            />
          </View>
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Amount
          </Text>
        </View>

        <TextInput
          placeholder="What's this for?"
          placeholderTextColor="#5A6068"
          value={title}
          onChangeText={setTitle}
          className="bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
        />

        <View className="gap-2">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Category (optional)
          </Text>
          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            onCreate={createCategory}
          />
        </View>

        {error && <Text className="text-destructive text-sm">{error}</Text>}
      </View>

      <View className="p-5">
        <Pressable
          onPress={handleSubmit}
          disabled={saving}
          className={`bg-success rounded-2xl py-4 items-center ${
            saving ? "opacity-60" : ""
          }`}
        >
          <Text className="text-primary-foreground font-sans-semibold text-base">
            {saving ? "Saving..." : "Save Income"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddIncome;
