import { useChat } from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Chat = () => {
  const { messages, input, setInput, sending, error, sendMessage, clearChat } = useChat();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          FinGPT AI Assistant
        </Text>
        <Pressable hitSlop={8} onPress={clearChat}>
          <Ionicons name="trash-outline" size={20} color="#8B939B" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <FlatList
          data={[...messages].reverse()}
          keyExtractor={(_, index) => String(index)}
          inverted
          className="flex-1 px-5"
          contentContainerClassName="gap-3 py-4"
          renderItem={({ item }) => (
            <View
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                item.role === "user"
                  ? "self-end bg-primary"
                  : "self-start bg-card"
              }`}
            >
              <Text
                className={
                  item.role === "user"
                    ? "text-primary-foreground text-sm"
                    : "text-foreground text-sm"
                }
              >
                {item.content}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-muted-foreground text-sm text-center mt-10">
              Ask me anything about your finances.
            </Text>
          }
        />

        {sending && (
          <View className="px-5 pb-2">
            <ActivityIndicator />
          </View>
        )}

        {error && (
          <Text className="text-destructive text-sm px-5 pb-2">{error}</Text>
        )}

        <View className="flex-row items-center gap-2 p-5 pt-2">
          <TextInput
            placeholder="Ask about your finances..."
            placeholderTextColor="#5A6068"
            value={input}
            onChangeText={setInput}
            multiline
            className="flex-1 bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
          />
          <Pressable
            onPress={sendMessage}
            disabled={sending || !input.trim()}
            className={`bg-primary rounded-2xl p-3 ${
              sending || !input.trim() ? "opacity-60" : ""
            }`}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
