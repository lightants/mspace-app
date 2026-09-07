import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavigator from './src/navigation/TabNavigator';
import AuthGate from './src/AuthGate';
import { colors } from './src/constants/theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.nearBlack,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.gold,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthGate><NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer></AuthGate>
    </SafeAreaProvider>
  );
}
