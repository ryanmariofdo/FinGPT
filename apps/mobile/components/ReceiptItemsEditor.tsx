import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

export type ReceiptItemDraft = {
  name: string;
  amount: string;
};

type Props = {
  items: ReceiptItemDraft[];
  onChange: (index: number, field: "name" | "amount", value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
};

export function ReceiptItemsEditor({ items, onChange, onRemove, onAdd }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
        Items
      </Text>

      {items.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center gap-2 bg-card rounded-2xl px-4 py-3 border border-border"
        >
          <View className="flex-1">
            <TextInput
              placeholder="Item name"
              placeholderTextColor="#5A6068"
              value={item.name}
              onChangeText={(value) => onChange(index, "name", value)}
              className="text-foreground"
            />
          </View>
          <View className="w-20">
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#5A6068"
              value={item.amount}
              onChangeText={(value) => onChange(index, "amount", value)}
              keyboardType="decimal-pad"
              className="text-foreground"
            />
          </View>
          <Pressable hitSlop={8} onPress={() => onRemove(index)}>
            <Ionicons name="close-circle" size={20} color="#5A6068" />
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={onAdd}
        className="flex-row items-center justify-center gap-2 py-3 rounded-2xl border border-border border-dashed"
      >
        <Ionicons name="add" size={18} color="#8B939B" />
        <Text className="text-muted-foreground text-sm font-sans-medium">
          Add item
        </Text>
      </Pressable>
    </View>
  );
}
