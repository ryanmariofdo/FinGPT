import { Tabs } from "expo-router";
import { Image } from "react-native";

const TabLayout = () => (
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
);

export default TabLayout;
