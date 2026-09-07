import React from 'react';
import { FlatList, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, EmptyState, Muted, PrimaryButton, Screen, SectionHeader, Subtitle, Title, screenContentStyle } from '../components/ui';
import { BRAND } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import partnersData from '../data/partners.json';
import type { Partner } from '../types';

const partners = partnersData as Partner[];
export default function FoodScreen() {
  async function openInstagram() { await Linking.openURL(BRAND.instagramUrl); }
  if (partners.length === 0) return <Screen><ScrollView contentContainerStyle={screenContentStyle}><Title eyebrow="Take a break">Food & drink</Title><Subtitle>Good fuel for a focused day at MSpace.</Subtitle><EmptyState icon="cafe-outline" title="Partners coming soon" body={`We’re curating food and drink partners around M’lang. Message @${BRAND.socialHandle} for nearby recommendations.`} action={<PrimaryButton label={`Message @${BRAND.socialHandle}`} icon="open-outline" onPress={openInstagram} />} /><Muted>Partner listings will appear here once confirmed. We never invent shop names.</Muted></ScrollView></Screen>;
  return <Screen><FlatList data={partners} keyExtractor={(item) => item.id} contentContainerStyle={screenContentStyle} ListHeaderComponent={<><Title eyebrow="Take a break">Food & drink</Title><Subtitle>Good fuel for a focused day at MSpace.</Subtitle><SectionHeader action={`${partners.length} listed`}>Near MSpace</SectionHeader></>} renderItem={({ item }) => <Card><View style={styles.partnerRow}><View style={styles.partnerIcon}><Ionicons name="cafe-outline" size={20} color={colors.gold} /></View><View style={styles.partnerCopy}><Text style={styles.name}>{item.name}</Text>{item.note ? <Muted>{item.note}</Muted> : null}</View></View></Card>} ListFooterComponent={<View style={styles.footer}><Muted>More partners? Message @{BRAND.socialHandle}</Muted></View>} /></Screen>;
}
const styles = StyleSheet.create({ partnerRow: { flexDirection: 'row', alignItems: 'center' }, partnerIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 }, partnerCopy: { flex: 1 }, name: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 3 }, footer: { paddingVertical: spacing.sm } });
