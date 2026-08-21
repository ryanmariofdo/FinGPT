import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

const TAB_COLORS = {
  background: "#0B0E11",
  surface: "#1B2025",
  primary: "#2E6FF2",
  primaryForeground: "#FFFFFF",
  mutedForeground: "#8B939B",
  border: "#22272C",
};

const TabLayout = () => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const openOption = (
    path: "/(add)/add-expense" | "/(add)/add-income" | "/(add)/scan-receipt"
  ) => {
    setSheetVisible(false);
    router.push(path);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: TAB_COLORS.primary,
          tabBarInactiveTintColor: TAB_COLORS.mutedForeground,
          tabBarStyle: {
            backgroundColor: TAB_COLORS.background,
            borderTopWidth: 1,
            borderTopColor: TAB_COLORS.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("@/assets/icons/home.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="finances"
          options={{
            title: "Finances",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("@/assets/icons/wallet.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarButton: (props) => (
              <Pressable
                onPress={() => setSheetVisible(true)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 35,
                    borderRadius: 12,
                    backgroundColor: TAB_COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={16} color={TAB_COLORS.primaryForeground} />
                </View>
              </Pressable>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setSheetVisible(true);
            },
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("@/assets/icons/insights.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen name="finances/[id]" options={{ href: null }} />
      </Tabs>

      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable
          onPress={() => setSheetVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <Pressable
            className="bg-surface rounded-t-3xl p-6 pb-15 gap-3"
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: TAB_COLORS.border,
                alignSelf: "center",
                marginBottom: 8,
              }}
            />

            <Pressable
              onPress={() => openOption("/(add)/add-expense")}
              className="bg-card rounded-2xl p-4 flex-row items-center gap-3"
            >
              <Ionicons name="arrow-down-circle" size={22} color="#FF5C5C" />
              <Text className="text-foreground text-base font-sans-medium">
                Add Expense
              </Text>
            </Pressable>

            <Pressable
              onPress={() => openOption("/(add)/add-income")}
              className="bg-card rounded-2xl p-4 flex-row items-center gap-3"
            >
              <Ionicons name="arrow-up-circle" size={22} color="#00D26A" />
              <Text className="text-foreground text-base font-sans-medium">
                Add Income
              </Text>
            </Pressable>

            <Pressable
              onPress={() => openOption("/(add)/scan-receipt")}
              className="bg-card rounded-2xl p-4 flex-row items-center gap-3"
            >
              <Ionicons name="camera" size={22} color={TAB_COLORS.primary} />
              <Text className="text-foreground text-base font-sans-medium">
                Scan Receipt
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default TabLayout;
