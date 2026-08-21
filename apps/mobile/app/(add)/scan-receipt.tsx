import { ReceiptItemsEditor } from "@/components/ReceiptItemsEditor";
import { useScanReceipt } from "@/hooks/useScanReceipt";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

type Category = { id: string; name: string };

const ScanReceipt = () => {
  const {
    imageUri,
    pickImage,
    scan,
    scanning,
    title,
    setTitle,
    amount,
    setAmount,
    occurredAt,
    setOccurredAt,
    categoryId,
    setCategoryId,
    items,
    updateItem,
    removeItem,
    addItem,
    saving,
    error,
    save,
  } = useScanReceipt({ mode: "create" });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/categories").then(setCategories).catch(() => {});
  }, []);

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
          Scan Receipt
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-6">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-48 rounded-2xl"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => pickImage("camera")}
              className="flex-1 items-center justify-center gap-2 py-8 rounded-2xl bg-card border border-border"
            >
              <Ionicons name="camera" size={28} color="#8B939B" />
              <Text className="text-muted-foreground text-sm font-sans-medium">
                Take Photo
              </Text>
            </Pressable>
            <Pressable
              onPress={() => pickImage("gallery")}
              className="flex-1 items-center justify-center gap-2 py-8 rounded-2xl bg-card border border-border"
            >
              <Ionicons name="images" size={28} color="#8B939B" />
              <Text className="text-muted-foreground text-sm font-sans-medium">
                Choose Photo
              </Text>
            </Pressable>
          </View>
        )}

        {imageUri && !title && (
          <Pressable
            onPress={scan}
            disabled={scanning}
            className={`bg-primary rounded-2xl py-4 items-center ${
              scanning ? "opacity-60" : ""
            }`}
          >
            <Text className="text-primary-foreground font-sans-semibold text-base">
              {scanning ? "Scanning..." : "Scan Receipt"}
            </Text>
          </Pressable>
        )}

        {title !== "" && (
          <>
            <View className="items-center py-2 gap-2">
              <View className="flex-row items-center gap-1 border-b border-border pb-2">
                <Text className="text-destructive text-4xl font-sans-extrabold">
                  $
                </Text>
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
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => setCategoryId(null)}
                  className={`px-4 py-2 rounded-full ${
                    categoryId === null ? "bg-primary" : "bg-card border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-medium ${
                      categoryId === null ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    None
                  </Text>
                </Pressable>
                {categories.map((c) => {
                  const isActive = categoryId === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => setCategoryId(c.id)}
                      className={`px-4 py-2 rounded-full ${
                        isActive ? "bg-primary" : "bg-card border border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-sans-medium ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <ReceiptItemsEditor
              items={items}
              onChange={updateItem}
              onRemove={removeItem}
              onAdd={addItem}
            />
          </>
        )}

        {error && <Text className="text-destructive text-sm">{error}</Text>}
      </ScrollView>

      {title !== "" && (
        <View className="p-5">
          <Pressable
            onPress={handleSubmit}
            disabled={saving}
            className={`bg-destructive rounded-2xl py-4 items-center ${
              saving ? "opacity-60" : ""
            }`}
          >
            <Text className="text-primary-foreground font-sans-semibold text-base">
              {saving ? "Saving..." : "Save Expense"}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScanReceipt;
