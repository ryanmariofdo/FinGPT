import { CategoryPicker } from "@/components/CategoryPicker";
import { ReceiptItemsEditor } from "@/components/ReceiptItemsEditor";
import { useTransactionDetail } from "@/hooks/useTransactionDetail";
import { usePreferences } from "@/hooks/usePreferences";
import { CURRENCIES, formatCurrency } from "@/lib/currency";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  sms: "Auto (SMS)",
  receipt: "Scanned",
};

const FinanceDetails = () => {
  const id = useLocalSearchParams<{ id: string }>().id;
  const { currency } = usePreferences();
  const formatAmount = (amount: number) => formatCurrency(amount, currency);
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";

  const {
    transaction,
    categoryName,
    categories,
    createCategory,
    loading,
    error,
    editing,
    setEditing,
    title,
    setTitle,
    amount,
    setAmount,
    kind,
    setKind,
    occurredAt,
    setOccurredAt,
    categoryId,
    setCategoryId,
    items,
    updateItem,
    removeItem,
    addItem,
    saving,
    save,
    deleting,
    remove,
  } = useTransactionDetail(id);

  const handleDelete = () => {
    Alert.alert("Delete transaction?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await remove();
          if (success) router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => (editing ? setEditing(false) : router.back())}>
          <Ionicons name={editing ? "close" : "chevron-back"} size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          {editing ? "Edit Transaction" : "Transaction"}
        </Text>
        {transaction && !editing ? (
          <Pressable hitSlop={8} onPress={() => setEditing(true)}>
            <Ionicons name="pencil" size={20} color="#8B939B" />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {loading && <ActivityIndicator className="mt-6" />}
      {error && <Text className="text-destructive text-sm px-5">{error}</Text>}

      {transaction && !editing && (
        <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-6">
          <View className="items-center py-4 gap-2">
            <Text
              className={`text-4xl font-sans-extrabold ${
                Number(transaction.amount) >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {formatAmount(Number(transaction.amount))}
            </Text>
            <Text className="text-foreground text-base font-sans-semibold">
              {transaction.title}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {categoryName} · {SOURCE_LABEL[transaction.source] ?? transaction.source} ·{" "}
              {transaction.occurred_at}
            </Text>
          </View>

          {transaction.image_url && (
            <Image
              source={{ uri: transaction.image_url }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
          )}

          {transaction.items.length > 0 && (
            <View className="gap-2">
              <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
                Items
              </Text>
              <View className="bg-card rounded-2xl border border-border">
                {transaction.items.map((item, index) => (
                  <View
                    key={item.id}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index !== transaction.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <Text className="text-foreground text-sm">{item.name}</Text>
                    <Text className="text-foreground text-sm font-sans-medium">
                      {formatCurrency(Number(item.amount), currency)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(add)/scan-receipt",
                params: { transactionId: transaction.id },
              })
            }
            className="flex-row items-center justify-center gap-2 py-4 rounded-2xl bg-card border border-border"
          >
            <Ionicons name="camera" size={18} color="#8B939B" />
            <Text className="text-foreground text-sm font-sans-medium">
              {transaction.items.length > 0 ? "Rescan Receipt" : "Scan Receipt"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            className={`flex-row items-center justify-center gap-2 py-4 rounded-2xl bg-card border border-border ${
              deleting ? "opacity-60" : ""
            }`}
          >
            <Ionicons name="trash" size={18} color="#FF5C5C" />
            <Text className="text-destructive text-sm font-sans-medium">
              {deleting ? "Deleting..." : "Delete Transaction"}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {transaction && editing && (
        <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-6">
          <View className="flex-row bg-card rounded-full p-1">
            {(["expense", "income"] as const).map((k) => {
              const isActive = kind === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => setKind(k)}
                  className={`flex-1 items-center py-2 rounded-full ${
                    isActive ? "bg-primary" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-semibold ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {k === "expense" ? "Expense" : "Income"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="items-center py-2 gap-2">
            <View className="flex-row items-center gap-1 border-b border-border pb-2">
              <Text className="text-destructive text-4xl font-sans-extrabold">{currencySymbol}</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#5A6068"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                className="text-destructive text-5xl font-sans-extrabold"
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

          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#5A6068"
            value={occurredAt}
            onChangeText={setOccurredAt}
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

          <ReceiptItemsEditor
            items={items}
            onChange={updateItem}
            onRemove={removeItem}
            onAdd={addItem}
          />

          {error && <Text className="text-destructive text-sm">{error}</Text>}
        </ScrollView>
      )}

      {transaction && editing && (
        <View className="p-5">
          <Pressable
            onPress={save}
            disabled={saving}
            className={`bg-primary rounded-2xl py-4 items-center ${
              saving ? "opacity-60" : ""
            }`}
          >
            <Text className="text-primary-foreground font-sans-semibold text-base">
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FinanceDetails;
