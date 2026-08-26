import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { usePreferences } from "@/hooks/usePreferences";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const General = () => {
  const { currency, setCurrency } = usePreferences();
  const [pickerVisible, setPickerVisible] = useState(false);
  const { password, setPassword, deleting, error, deleteAccount } = useDeleteAccount();
  const [deleteVisible, setDeleteVisible] = useState(false);

  const currentLabel = CURRENCIES.find((c) => c.code === currency)?.code ?? currency;

  const handleSelect = async (code: CurrencyCode) => {
    setPickerVisible(false);
    await setCurrency(code);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-5">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#8B939B" />
        </Pressable>
        <Text className="text-foreground text-base font-sans-semibold">
          General
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="px-5 gap-2">
        <Pressable
          onPress={() => setPickerVisible(true)}
          className="flex-row items-center justify-between bg-card rounded-2xl p-4"
        >
          <Text className="text-foreground text-base font-sans-medium">
            Currency
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground text-sm font-sans-medium">
              {currentLabel}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#8B939B" />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable
          onPress={() => setPickerVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable
            className="bg-surface rounded-t-3xl p-6 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-foreground text-base font-sans-semibold">
              Select Currency
            </Text>

            {CURRENCIES.map((c) => {
              const isActive = c.code === currency;
              return (
                <Pressable
                  key={c.code}
                  onPress={() => handleSelect(c.code)}
                  className={`flex-row items-center justify-between rounded-2xl px-4 py-3 ${
                    isActive ? "bg-primary" : "bg-card border border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-sans-medium ${
                      isActive ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {c.label}
                  </Text>
                  <Text
                    className={`text-sm font-sans-semibold ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {c.code} ({c.symbol})
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <View className="px-5 pt-8 mt-auto pb-5">
        <Pressable
          onPress={() => setDeleteVisible(true)}
          className="bg-card rounded-2xl p-4 items-center"
        >
          <Text className="text-destructive text-base font-sans-semibold">
            Delete Account
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={deleteVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteVisible(false)}
      >
        <Pressable
          onPress={() => setDeleteVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable
            className="bg-surface rounded-t-3xl p-6 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-foreground text-base font-sans-semibold">
              Delete Account
            </Text>
            <Text className="text-muted-foreground text-sm">
              This permanently deletes your account and all your data. This
              can't be undone. Enter your password to confirm.
            </Text>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#5A6068"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-card rounded-2xl px-4 py-3 text-foreground border border-border"
            />

            {error && <Text className="text-destructive text-sm">{error}</Text>}

            <Pressable
              onPress={handleDeleteAccount}
              disabled={deleting || !password}
              className={`bg-destructive rounded-2xl py-4 items-center ${
                deleting || !password ? "opacity-60" : ""
              }`}
            >
              <Text className="text-primary-foreground font-sans-semibold text-base">
                {deleting ? "Deleting..." : "Delete Account"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default General;
