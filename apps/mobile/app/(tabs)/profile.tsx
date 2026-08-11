import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Profile = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Profile</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default Profile;
