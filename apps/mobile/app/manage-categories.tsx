import { useCategories } from "@/hooks/useCategories";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const ManageCategories = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } =
    useCategories();
  const customCategories = categories.filter((c) => c.user_id !== null);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setSheetError(null);
    setSheetVisible(true);
  };

  const openEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
    setSheetError(null);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setEditingId(null);
    setName("");
    setSheetError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setSheetError("Name is required");
      return;
    }
    setSaving(true);
    setSheetError(null);
    const category = editingId
      ? await updateCategory(editingId, name.trim())
      : await createCategory(name.trim());
    setSaving(false);
    if (category) {
      closeSheet();
    } else {
      setSheetError(editingId ? "Could not update category" : "Could not create category");
    }
  };

  const handleDelete = (id: string, categoryName: string) => {
    Alert.alert(`Delete "${categoryName}"?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setRowError(null);
          const success = await deleteCategory(id);
          if (!success) setRowError(`Could not delete "${categoryName}" — it may still be in use`);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          Manage Categories
        </Text>
        <Pressable hitSlop={8} onPress={openCreate}>
          <Ionicons name="add" size={24} color="#8B939B" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-2 pb-6">
        {loading && <ActivityIndicator />}
        {error && <Text className="text-destructive text-sm">{error}</Text>}
        {rowError && <Text className="text-destructive text-sm">{rowError}</Text>}

        {!loading && customCategories.length === 0 && (
          <Text className="text-muted-foreground text-sm">
            No custom categories yet.
          </Text>
        )}

        {customCategories.map((c) => (
          <View
            key={c.id}
            className="flex-row items-center justify-between bg-card rounded-2xl px-4 py-3"
          >
            <Text className="text-foreground text-sm font-sans-medium">{c.name}</Text>
            <View className="flex-row items-center gap-4">
              <Pressable hitSlop={8} onPress={() => openEdit(c.id, c.name)}>
                <Ionicons name="pencil" size={18} color="#8B939B" />
              </Pressable>
              <Pressable hitSlop={8} onPress={() => handleDelete(c.id, c.name)}>
                <Ionicons name="trash" size={18} color="#FF5C5C" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={closeSheet}>
        <Pressable
          onPress={closeSheet}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable
            className="bg-surface rounded-t-3xl p-6 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-foreground text-base font-sans-semibold">
              {editingId ? "Rename Category" : "New Category"}
            </Text>

            <TextInput
              placeholder="Category name"
              placeholderTextColor="#5A6068"
              value={name}
              onChangeText={setName}
              autoFocus
              className="bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
            />

            {sheetError && <Text className="text-destructive text-sm">{sheetError}</Text>}

            <View className="flex-row gap-3">
              <Pressable
                onPress={closeSheet}
                className="flex-1 items-center py-3 rounded-2xl bg-card border border-border"
              >
                <Text className="text-muted-foreground text-sm font-sans-semibold">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                className={`flex-1 items-center py-3 rounded-2xl bg-primary ${
                  saving ? "opacity-60" : ""
                }`}
              >
                <Text className="text-primary-foreground text-sm font-sans-semibold">
                  {saving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageCategories;
