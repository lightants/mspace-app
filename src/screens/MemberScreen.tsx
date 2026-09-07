import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Field, Label, Muted, PrimaryButton, Screen, SectionHeader, Subtitle, Title, screenContentStyle } from '../components/ui';
import { PRICING } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import type { MembershipApplication } from '../types';
import { getMembership, saveMembership } from '../utils/storage';

export default function MemberScreen() {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState(''); const [notes, setNotes] = useState(''); const [existing, setExisting] = useState<MembershipApplication | null>(null);
  const refresh = useCallback(async () => { const m = await getMembership(); setExisting(m); if (m) { setName(m.name); setPhone(m.phone); setEmail(m.email); setNotes(m.notes); } }, []);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  async function onApply() { if (!name.trim() || !phone.trim()) { Alert.alert('Missing info', 'Name and phone are required.'); return; } const app: MembershipApplication = { name: name.trim(), phone: phone.trim(), email: email.trim(), notes: notes.trim(), appliedAt: new Date().toISOString(), status: 'active', membershipActive: true }; await saveMembership(app); setExisting(app); Alert.alert('Membership saved', `Desk rate ₱${PRICING.memberPerHour}/hr (${PRICING.memberDiscountLabel}) is now active on this device.`); }
  return <Screen><ScrollView contentContainerStyle={screenContentStyle} keyboardShouldPersistTaps="handled">
    <Title eyebrow="More value, every visit">Member</Title><Subtitle>Unlock better desk rates and member-only promotions.</Subtitle>
    <Card style={styles.perkCard}><View style={styles.perkIcon}><Ionicons name="sparkles-outline" size={25} color={colors.gold} /></View><View style={styles.perkCopy}><Text style={styles.perkTitle}>Member desk rate</Text><Text style={styles.perkPrice}>₱{PRICING.memberPerHour}<Text style={styles.perkUnit}> / hour</Text></Text><Muted>{PRICING.memberDiscountLabel} compared with the ₱{PRICING.walkInPerHour}/hr walk-in rate.</Muted></View></Card>
    <SectionHeader>{existing?.membershipActive ? 'Your membership' : 'Apply in a minute'}</SectionHeader>
    <Card>{existing?.membershipActive ? <Badge tone="green">MEMBER ACTIVE</Badge> : <Badge>NOT A MEMBER YET</Badge>}<Text style={styles.formIntro}>{existing?.membershipActive ? 'Keep your details current so we can reach you about promotions.' : 'Your membership is saved securely on this device and activates the member rate for bookings.'}</Text><Label>Name</Label><Field value={name} onChangeText={setName} placeholder="Full name" /><Label>Phone</Label><Field value={phone} onChangeText={setPhone} placeholder="09xxxxxxxxx" keyboardType="phone-pad" /><Label>Email (optional)</Label><Field value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" /><Label>Notes</Label><Field value={notes} onChangeText={setNotes} placeholder="How you use the space" multiline /><PrimaryButton label={existing?.membershipActive ? 'Update membership' : 'Apply for membership'} icon="arrow-forward" onPress={onApply} /></Card>
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ perkCard: { flexDirection: 'row', backgroundColor: '#1A1813', borderColor: colors.borderStrong }, perkIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, perkCopy: { flex: 1 }, perkTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '700' }, perkPrice: { color: colors.goldBright, fontSize: 26, fontWeight: '800', marginVertical: 2 }, perkUnit: { color: colors.textMuted, fontSize: 13, fontWeight: '500' }, formIntro: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: spacing.md } });
