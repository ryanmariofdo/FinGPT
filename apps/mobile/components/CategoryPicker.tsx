import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (name: string) => Promise<Category | null>;
};

export function CategoryPicker({ categories, selectedId, onSelect, onCreate }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeSheet = () => {
    setSheetVisible(false);
    setName("");
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    const category = await onCreate(name.trim());
    setSaving(false);
    if (category) {
      onSelect(category.id);
      closeSheet();
    } else {
      setError("Could not create category");
    }
  };

  return (
    <>
      <View className="flex-row flex-wrap gap-2">
        <Pressable
          onPress={() => onSelect(null)}
          className={`px-4 py-2 rounded-full ${
            selectedId === null ? "bg-primary" : "bg-card border border-border"
          }`}
        >
          <Text
            className={`text-sm font-sans-medium ${
              selectedId === null ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            None
          </Text>
        </Pressable>
        {categories.map((c) => {
          const isActive = selectedId === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onSelect(c.id)}
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
        <Pressable
          onPress={() => setSheetVisible(true)}
          className="px-4 py-2 rounded-full bg-card border border-border border-dashed"
        >
          <Text className="text-sm font-sans-medium text-muted-foreground">+ New</Text>
        </Pressable>
      </View>

      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <Pressable
          onPress={closeSheet}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable
            className="bg-surface rounded-t-3xl p-6 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-foreground text-base font-sans-semibold">
              New Category
            </Text>

            <TextInput
              placeholder="Category name"
              placeholderTextColor="#5A6068"
              value={name}
              onChangeText={setName}
              autoFocus
              className="bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
            />

            {error && <Text className="text-destructive text-sm">{error}</Text>}

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
    </>
  );
}
