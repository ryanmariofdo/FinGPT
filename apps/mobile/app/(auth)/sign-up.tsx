import { useSignUp } from "@/hooks/useSignUp";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { email, setEmail, password, setPassword, loading, error, signUp } = useSignUp();
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const { success, needsEmailConfirmation } = await signUp();
    if (!success) return;
    if (needsEmailConfirmation) {
      setMessage("Check your email to confirm your account before signing in.");
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center p-5 gap-8">
          <View className="items-center gap-2">
            <Text className="text-foreground text-3xl font-sans-extrabold">
              FinGPT
            </Text>
            <Text className="text-muted-foreground text-xl font-sans-semibold">
              Create Account
            </Text>
          </View>

          <View className="gap-3">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#5A6068"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
            />
            <View className="relative justify-center">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#5A6068"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="bg-card rounded-2xl px-4 py-3 pr-12 text-foreground border border-border"
              />
              <Pressable
                hitSlop={8}
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-4"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#8B939B"
                />
              </Pressable>
            </View>

            {error && <Text className="text-destructive text-sm">{error}</Text>}
            {message && <Text className="text-primary text-sm">{message}</Text>}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`bg-primary rounded-2xl py-4 items-center mt-2 ${
                loading ? "opacity-60" : ""
              }`}
            >
              <Text className="text-primary-foreground font-sans-semibold text-base">
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </Pressable>
          </View>

          <Link href="/(auth)/sign-in" className="text-center">
            <Text className="text-primary text-sm font-sans-medium text-center">
              Already have an account? Sign In
            </Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
