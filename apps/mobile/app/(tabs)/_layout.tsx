import { Tabs } from "expo-router";

const TabLayout = () => (
  <Tabs screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="finances" options={{ title: "Finances" }} />
    <Tabs.Screen name="insights" options={{ title: "Insights" }} />
    <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    <Tabs.Screen name="finances/[id]" options={{ href: null }} />
  </Tabs>
);

export default TabLayout;
