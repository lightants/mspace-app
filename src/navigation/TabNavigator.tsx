import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import BookScreen from '../screens/BookScreen';
import PromoScreen from '../screens/PromoScreen';
import FoodScreen from '../screens/FoodScreen';
import MemberScreen from '../screens/MemberScreen';
import ContactScreen from '../screens/ContactScreen';

export type RootTabParamList = { Book: undefined; Promo: undefined; Food: undefined; Member: undefined; Contact: undefined };
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
    <Tab.Screen name="Book" component={BookScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'book' : 'book-outline'} focused={focused} /> }} />
    <Tab.Screen name="Promo" component={PromoScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'alarm' : 'alarm-outline'} focused={focused} /> }} />
    <Tab.Screen name="Food" component={FoodScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'restaurant' : 'restaurant-outline'} focused={focused} /> }} />
    <Tab.Screen name="Member" component={MemberScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} /> }} />
    <Tab.Screen name="Contact" component={ContactScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'call' : 'call-outline'} focused={focused} /> }} />
  </Tab.Navigator>;
}
