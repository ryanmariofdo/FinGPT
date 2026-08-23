import { useProfile } from "@/hooks/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Profile = () => {
  const { email, initial, signOut } = useProfile();

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background p-5 gap-6">
      <Text className="text-foreground text-2xl font-sans-bold">
        Profile
      </Text>

      <View className="bg-card rounded-2xl p-5 items-center gap-3">
        <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
          <Text className="text-primary-foreground text-2xl font-sans-bold">
            {initial}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="text-muted-foreground text-xs font-sans-semibold uppercase tracking-wide">
            Signed in
          </Text>
          <Text className="text-foreground text-base font-sans-medium">
            {email}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/general")}
        className="flex-row items-center justify-between bg-card rounded-2xl p-4"
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="settings-outline" size={20} color="#8B939B" />
          <Text className="text-foreground text-base font-sans-medium">
            General Settings
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8B939B" />
      </Pressable>

      <Pressable
        onPress={() => router.push("/preferences")}
        className="flex-row items-center justify-between bg-card rounded-2xl p-4"
      >
        <View className="flex-row items-center gap-3">
          <Ionicons name="options-outline" size={20} color="#8B939B" />
          <Text className="text-foreground text-base font-sans-medium">
            Preferences
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8B939B" />
      </Pressable>

      <Pressable
        onPress={signOut}
        className="bg-card rounded-2xl p-4 items-center mt-auto"
      >
        <Text className="text-destructive text-base font-sans-semibold">
          Sign Out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;
