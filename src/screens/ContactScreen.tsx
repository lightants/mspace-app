import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Divider, Muted, PrimaryButton, Screen, SecondaryButton, SectionHeader, Subtitle, Title, screenContentStyle } from '../components/ui';
import { BRAND, LOCATION } from '../constants/config';
import { colors, spacing } from '../constants/theme';
export default function ContactScreen() {
  async function openFacebook() { await Linking.openURL(BRAND.facebookUrl); }
  async function openInstagram() { await Linking.openURL(BRAND.instagramUrl); }
  async function openMaps() { if (BRAND.GOOGLE_MAPS_PLACE_URL) { await Linking.openURL(BRAND.GOOGLE_MAPS_PLACE_URL); return; } await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.mapsSearchQuery)}`); }
  return <Screen><ScrollView contentContainerStyle={screenContentStyle}>
    <Title eyebrow="Make it official">Contact & connect</Title><Subtitle>Find us, share the vibe, and help more people discover MSpace.</Subtitle>
    <Card style={styles.placeCard}><View style={styles.placeTop}><View style={styles.pin}><Ionicons name="location" size={22} color={colors.gold} /></View><Badge tone="green">OPEN TODAY</Badge></View><Text style={styles.place}>{LOCATION.name}</Text><Muted>{LOCATION.address}</Muted><Text style={styles.hours}>{LOCATION.hours} · daily</Text><Divider /><View style={styles.detailRow}><Ionicons name="at-outline" size={17} color={colors.gold} /><Text style={styles.detail}>@{BRAND.socialHandle}</Text></View><View style={styles.detailRow}><Ionicons name="sparkles-outline" size={17} color={colors.gold} /><Text style={styles.detail}>{BRAND.studio} · {BRAND.name} {BRAND.version}</Text></View></Card>
    <SectionHeader>Stay connected</SectionHeader><Card><PrimaryButton label="Open Facebook" icon="logo-facebook" onPress={openFacebook} /><PrimaryButton label="Open Instagram" icon="logo-instagram" onPress={openInstagram} /><SecondaryButton label="Open in Google Maps" icon="map-outline" onPress={openMaps} /><Muted>Maps opens a search for “{BRAND.mapsSearchQuery}”. No Place ID is invented or bundled.</Muted></Card>
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ placeCard: { backgroundColor: '#1A1813', borderColor: colors.borderStrong }, placeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, pin: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' }, place: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.md, marginBottom: 5 }, hours: { color: colors.gold, fontSize: 13, fontWeight: '700', marginTop: spacing.sm }, detailRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }, detail: { color: colors.textMuted, fontSize: 13 } });
