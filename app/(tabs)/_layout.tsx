import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "../../components/Theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.tabBg,
            borderTopColor: "#00000033",
            height: 80,
          },
          tabBarActiveTintColor: Colors.tabActive,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarLabelStyle: { fontSize: 20, marginBottom: 8 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tickets",
            tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
          }}
        />
      </Tabs>
    </View>
    </SafeAreaProvider>
  );
}
