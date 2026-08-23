import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Preferences = () => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          Preferences
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="px-5 gap-2">
        <Pressable
          onPress={() => router.push("/manage-categories")}
          className="flex-row items-center justify-between bg-card rounded-2xl p-4"
        >
          <Text className="text-foreground text-base font-sans-medium">
            Manage Categories
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#8B939B" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Preferences;
