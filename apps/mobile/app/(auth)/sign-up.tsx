import { useSignUp } from "@/hooks/useSignUp";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

const SignUp = () => {
  const { email, setEmail, password, setPassword, loading, error, signUp } = useSignUp();
  const [message, setMessage] = useState<string | null>(null);

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
    <View>
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: "#888", color: "#fff", padding: 8, margin: 8 }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#888", color: "#fff", padding: 8, margin: 8 }}
      />
      {error && <Text>{error}</Text>}
      {message && <Text>{message}</Text>}
      <Button title={loading ? "Creating account..." : "Sign Up"} onPress={handleSubmit} disabled={loading} />
      <Link href="/(auth)/sign-in">Already have an account? Sign In</Link>
    </View>
  );
};

export default SignUp;
