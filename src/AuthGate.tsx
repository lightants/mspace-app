import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from './constants/theme';
import { PrimaryButton, SecondaryButton } from './components/ui';

WebBrowser.maybeCompleteAuthSession();
const SESSION_KEY = '@mspace/gmailSession';
const signOutListeners = new Set<() => void>();

export async function signOut() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } finally {
    signOutListeners.forEach((listener) => listener());
  }
}
type GmailSession = { accessToken: string; email?: string };
type AuthExtra = { googleWebClientId?: string; googleAndroidClientId?: string; googleIosClientId?: string };
function getAuthExtra(): AuthExtra { return (Constants.expoConfig?.extra ?? {}) as AuthExtra; }

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const extra = useMemo(getAuthExtra, []);
  const [session, setSession] = useState<GmailSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: extra.googleAndroidClientId,
    iosClientId: extra.googleIosClientId,
    webClientId: extra.googleWebClientId,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    const onSignOut = () => { setSession(null); setBusy(false); setError(null); };
    signOutListeners.add(onSignOut);
    let mounted = true;
    AsyncStorage.getItem(SESSION_KEY).then((raw) => {
      if (!mounted) return;
      if (raw) { try { setSession(JSON.parse(raw) as GmailSession); } catch { AsyncStorage.removeItem(SESSION_KEY); } }
    }).catch(() => undefined).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; signOutListeners.delete(onSignOut); };
  }, []);

  useEffect(() => {
    if (!response) return;
    setBusy(false);
    if (response.type === 'success' && response.authentication?.accessToken) {
      const next = { accessToken: response.authentication.accessToken, email: response.params?.email };
      setSession(next);
      AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next)).catch(() => undefined);
      setError(null);
    } else if (response.type === 'error') setError('Gmail sign-in could not be completed. Please try again.');
  }, [response]);

  async function signIn() {
    setError(null);
    if (!request) { setError('Gmail sign-in is not configured for this build. Add Google OAuth client IDs to Expo extra settings.'); return; }
    setBusy(true);
    try { const result = await promptAsync(); if (result.type === 'dismiss' || result.type === 'cancel') setBusy(false); }
    catch { setBusy(false); setError('Gmail sign-in is unavailable right now. Please try again.'); }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator color={colors.gold} /></View>;
  if (session) return <>{children}</>;
  return <View style={styles.root}>
    <View style={styles.card}>
      <View style={styles.icon}><Ionicons name="mail-outline" size={30} color={colors.gold} /></View>
      <Text style={styles.eyebrow}>WELCOME TO MSPACE</Text>
      <Text style={styles.title}>Sign in with Gmail</Text>
      <Text style={styles.body}>Use your Gmail account to access booking, member rates, promotions, and contact details.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label={busy ? 'Opening Gmail…' : 'Continue with Google'} icon="logo-google" onPress={signIn} disabled={busy} />
      <SecondaryButton label="Why do I need to sign in?" icon="help-circle-outline" onPress={() => setError('Gmail sign-in keeps your MSpace access tied to one account on this device.')} />
    </View>
    <Text style={styles.note}>We only use sign-in to gate the app. No Gmail messages are read.</Text>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.nearBlack, justifyContent: 'center', padding: spacing.lg },
  center: { flex: 1, backgroundColor: colors.nearBlack, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  icon: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 7 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginTop: spacing.md },
  note: { color: colors.textSubtle, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.md },
});
