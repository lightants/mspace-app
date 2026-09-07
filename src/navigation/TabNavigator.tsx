import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import BookScreen from '../screens/BookScreen';
import AlertsScreen from '../screens/AlertsScreen';
import FoodScreen from '../screens/FoodScreen';
import MemberScreen from '../screens/MemberScreen';
import ReviewScreen from '../screens/ReviewScreen';

export type RootTabParamList = { Book: undefined; Alerts: undefined; Food: undefined; Member: undefined; Review: undefined };
const Tab = createBottomTabNavigator<RootTabParamList>();
type IconName = keyof typeof Ionicons.glyphMap;
function TabIcon({ name, focused }: { name: IconName; focused: boolean }) { return <Ionicons name={name} size={22} color={focused ? colors.gold : colors.textMuted} />; }

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return <Tab.Navigator initialRouteName="Book" screenOptions={{
    headerShown: false,
    tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 64 + insets.bottom, paddingTop: 8, paddingBottom: insets.bottom + 6 },
    tabBarActiveTintColor: colors.gold, tabBarInactiveTintColor: colors.textMuted,
    tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 }, tabBarItemStyle: { minHeight: 50 },
  }}>
    <Tab.Screen name="Book" component={BookScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} /> }} />
    <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'notifications' : 'notifications-outline'} focused={focused} /> }} />
    <Tab.Screen name="Food" component={FoodScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'cafe' : 'cafe-outline'} focused={focused} /> }} />
    <Tab.Screen name="Member" component={MemberScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} /> }} />
    <Tab.Screen name="Review" component={ReviewScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} /> }} />
  </Tab.Navigator>;
}
