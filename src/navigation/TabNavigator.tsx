import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "../constants/theme";
import BookScreen from "../screens/BookScreen";
import AlertsScreen from "../screens/AlertsScreen";
import FoodScreen from "../screens/FoodScreen";
import MemberScreen from "../screens/MemberScreen";
import ReviewScreen from "../screens/ReviewScreen";

export type RootTabParamList = {
  Book: undefined;
  Alerts: undefined;
  Food: undefined;
  Member: undefined;
  Review: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ color: focused ? colors.gold : colors.textMuted, fontSize: 11, fontWeight: focused ? "700" : "500" }}>
      {label}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Book"
      screenOptions={{
        headerStyle: { backgroundColor: colors.nearBlack },
        headerTintColor: colors.gold,
        headerTitleStyle: { fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Book" component={BookScreen} options={{ title: "MSpace", tabBarLabel: "Book", tabBarIcon: ({ focused }) => <TabIcon label="B" focused={focused} /> }} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="A" focused={focused} /> }} />
      <Tab.Screen name="Food" component={FoodScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="F" focused={focused} /> }} />
      <Tab.Screen name="Member" component={MemberScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="M" focused={focused} /> }} />
      <Tab.Screen name="Review" component={ReviewScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="R" focused={focused} /> }} />
    </Tab.Navigator>
  );
}
