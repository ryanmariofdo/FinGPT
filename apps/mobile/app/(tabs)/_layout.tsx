import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

const TabLayout = () => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const openOption = (path: "/(add)/add-expense" | "/(add)/add-income") => {
    setSheetVisible(false);
    router.push(path);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#0b0e11" },
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
                  top: -18,
                  alignSelf: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#2E6FF2",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="add" size={28} color="#ffffff" />
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
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
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
                backgroundColor: "#22272C",
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
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default TabLayout;
