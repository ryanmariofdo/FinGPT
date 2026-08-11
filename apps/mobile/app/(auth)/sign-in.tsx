import { useSignIn } from "@/hooks/useSignIn";
import { Link, router } from "expo-router";
import { Button, Text, TextInput, View } from "react-native";

const SignIn = () => {
  const { email, setEmail, password, setPassword, loading, error, signIn } = useSignIn();

  const handleSubmit = async () => {
    const success = await signIn();
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <View>
      <Text>Sign In</Text>
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
      <Button title={loading ? "Signing in..." : "Sign In"} onPress={handleSubmit} disabled={loading} />
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default SignIn;
