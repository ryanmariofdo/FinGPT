import { useAddTransaction } from "@/hooks/useAddTransaction";
import { router } from "expo-router";
import React from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";

const inputStyle = { borderWidth: 1, borderColor: "#888", color: "#fff", padding: 8, margin: 8 };

const AddExpense = () => {
  const { title, setTitle, amount, setAmount, categoryId, setCategoryId, categories, saving, error, save } =
    useAddTransaction("expense");

  const handleSubmit = async () => {
    const success = await save();
    if (success) router.back();
  };

  return (
    <View>
      <Text>Add Expense</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
      />
      <TextInput
        placeholder="Amount"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={inputStyle}
      />
      <Text style={{ margin: 8, color: "#888" }}>Category (optional)</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 8 }}>
        <Pressable
          onPress={() => setCategoryId(null)}
          style={{
            padding: 8,
            borderWidth: 1,
            borderColor: categoryId === null ? "#fff" : "#888",
          }}
        >
          <Text style={{ color: "#fff" }}>None</Text>
        </Pressable>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCategoryId(c.id)}
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: categoryId === c.id ? "#fff" : "#888",
            }}
          >
            <Text style={{ color: "#fff" }}>{c.name}</Text>
          </Pressable>
        ))}
      </View>
      {error && <Text style={{ color: "red", margin: 8 }}>{error}</Text>}
      <Button title={saving ? "Saving..." : "Save Expense"} onPress={handleSubmit} disabled={saving} />
    </View>
  );
};

export default AddExpense;
