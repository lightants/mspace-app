import React, { useCallback, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {
  Card,
  Muted,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
} from '../components/ui';
import { colors, spacing } from '../constants/theme';
import { getPushToken, savePushToken } from '../utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AlertsScreen() {
  const [permission, setPermission] = useState<string>('unknown');
  const [token, setToken] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState('Tap below to request permission.');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const perm = await Notifications.getPermissionsAsync();
    setPermission(perm.status);
    const saved = await getPushToken();
    setToken(saved);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function requestAndRegister() {
    setBusy(true);
    try {
      if (!Device.isDevice && Platform.OS !== 'android') {
        setStatusNote('Physical device recommended for push; local notifications still work on Android emulators.');
      }

      const current = await Notifications.getPermissionsAsync();
      let finalStatus = current.status;
      if (finalStatus !== 'granted') {
        const asked = await Notifications.requestPermissionsAsync();
        finalStatus = asked.status;
      }
      setPermission(finalStatus);

      if (finalStatus !== 'granted') {
        setStatusNote('Permission denied. Enable notifications in system settings to get booking alerts.');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('mspace-default', {
          name: 'MSpace',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      // Expo push token — no FCM server key / secrets in this app
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId;

      try {
        const push = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );
        await savePushToken(push.data);
        setToken(push.data);
        setStatusNote('Permission granted. Expo push token stored locally (no FCM secrets).');
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'token unavailable';
        setStatusNote(
          `Permission granted. Local notifications OK. Push token not available yet (${msg}). Add an EAS projectId later if needed — no fake FCM keys.`
        );
      }
    } finally {
      setBusy(false);
      await refresh();
    }
  }

  async function sendTestLocal() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      setStatusNote('Grant permission first.');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MSpace alert',
        body: 'Local test notification from Alerts tab.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
    setStatusNote('Test local notification scheduled (~1s).');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title>Alerts</Title>
        <Subtitle>Local booking reminders · Expo Notifications</Subtitle>

        <Card>
          <Text style={styles.label}>Permission</Text>
          <Text style={styles.value}>{permission}</Text>

          <Text style={styles.label}>Expo push token</Text>
          <Text style={styles.token} selectable>
            {token || '(none yet)'}
          </Text>

          <Muted>{statusNote}</Muted>
          <Muted>
            Booking confirm on the Book tab also schedules a local notification. No FCM
            server keys or secrets are bundled in this app.
          </Muted>

          <PrimaryButton
            label={busy ? 'Working…' : 'Request permission / refresh token'}
            onPress={requestAndRegister}
            disabled={busy}
          />
          <PrimaryButton label="Send test local notification" onPress={sendTestLocal} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  label: { color: colors.gold, fontWeight: '600', marginTop: spacing.sm },
  value: { color: colors.text, fontSize: 16, marginBottom: 8 },
  token: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
    fontFamily: Platform.OS === 'android' ? 'monospace' : undefined,
  },
});
