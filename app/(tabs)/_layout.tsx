import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
   <Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // active icon/text color
    tabBarInactiveTintColor: "white",                          // inactive icon/text color
    tabBarStyle: {
      backgroundColor: "#4F252E",                              // base maroon background
    },
    tabBarActiveBackgroundColor: "#3A1B23",                    // 👈 darker shade when active
    headerShown: false,
    tabBarButton: HapticTab,
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="house.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="favourites"
    options={{
      title: 'Liked',
      tabBarIcon: ({ color }) => (
        <Ionicons name="heart" size={28} color={color} />
      ),
    }}
  />
</Tabs>

  );
}
