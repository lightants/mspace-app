import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Chip, Divider, Field, Label, Muted, PrimaryButton, Screen, SecondaryButton, SectionHeader, Subtitle, Title, screenContentStyle } from '../components/ui';
import { BOOKING, LOCATION, PRICING } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import type { Booking } from '../types';
import { withNotificationTimeout } from '../utils/notifications';
import { getBookings, isMembershipActive, makeBookingRef, saveBooking } from '../utils/storage';

type Step = 'form' | 'pay' | 'done';
function todayISO(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

export default function BookScreen() {
  const [step, setStep] = useState<Step>('form'); const [date, setDate] = useState(todayISO()); const [startHour, setStartHour] = useState(9); const [hours, setHours] = useState(1); const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [member, setMember] = useState(false); const [pending, setPending] = useState<Booking | null>(null); const [recent, setRecent] = useState<Booking[]>([]);
  const refresh = useCallback(async () => { setMember(await isMembershipActive()); setRecent(await getBookings()); }, []);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  const rate = member ? PRICING.memberPerHour : PRICING.walkInPerHour; const total = rate * hours;
  const startHours = Array.from({ length: BOOKING.startHourMax - BOOKING.startHourMin + 1 }, (_, i) => BOOKING.startHourMin + i);
  const hourOptions = Array.from({ length: BOOKING.maxHours - BOOKING.minHours + 1 }, (_, i) => BOOKING.minHours + i);
  async function scheduleConfirmNotification(ref: string) { try { const { status } = await withNotificationTimeout(Notifications.getPermissionsAsync()); if (status !== 'granted') { const req = await withNotificationTimeout(Notifications.requestPermissionsAsync()); if (req.status !== 'granted') return; } await withNotificationTimeout(Notifications.scheduleNotificationAsync({ content: { title: 'MSpace booking confirmed', body: `Ref ${ref} · See you at MSpace Mlang`, sound: true }, trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 } })); } catch { /* booking remains saved if notifications are unavailable */ } }
  function onContinueToPay() {
    if (!date.trim() || !name.trim() || !phone.trim()) { Alert.alert('Missing info', 'Please fill date, name, and phone.'); return; }
    if (startHour + hours > LOCATION.closeHour) { Alert.alert('Hours', `Booking would end after ${LOCATION.closeHour}:00. Choose fewer hours or an earlier start.`); return; }
    const bookingRef = makeBookingRef(); const booking: Booking = { id: bookingRef, date: date.trim(), startHour, hours, name: name.trim(), phone: phone.trim(), ratePerHour: rate, total, isMemberRate: member, bookingRef, createdAt: new Date().toISOString(), paidPlaceholder: false };
    setPending(booking); setStep('pay');
  }
  async function onConfirmPaid() { if (!pending) return; const confirmed = { ...pending, paidPlaceholder: true }; await saveBooking(confirmed); await scheduleConfirmNotification(confirmed.bookingRef); setPending(confirmed); setStep('done'); await refresh(); }
  function resetForm() { setStep('form'); setPending(null); setHours(1); setStartHour(9); }

  if (step === 'pay' && pending) return <Screen><ScrollView contentContainerStyle={screenContentStyle}>
    <Title eyebrow="Step 2 of 2">Complete payment</Title><Subtitle>Scan the official GCash QR, then confirm your booking.</Subtitle>
    <Card><Badge>GCASH PAYMENT</Badge><Text style={styles.payTotal}>₱{pending.total}</Text><Text style={styles.payMeta}>{pending.date} · {pending.startHour}:00–{pending.startHour + pending.hours}:00 · {pending.hours}h</Text><Divider />
      <View style={styles.qrCard}><Image source={require('../../assets/gcash-qr.png')} style={styles.qrImg} resizeMode="contain" accessibilityLabel="MSpace GCash Scan to Pay poster" /><Text style={styles.qrLabel}>Put this booking ref in the transfer note</Text><Text style={styles.refBig}>{pending.bookingRef}</Text></View>
      <Muted>Cashless only. We do not auto-verify GCash; keep your transfer receipt for reference.</Muted>
      <PrimaryButton label="I’ve paid — confirm booking" icon="checkmark-circle-outline" onPress={onConfirmPaid} /><SecondaryButton label="Back to booking" icon="arrow-back" onPress={() => setStep('form')} />
    </Card>
  </ScrollView></Screen>;

  if (step === 'done' && pending) return <Screen><ScrollView contentContainerStyle={screenContentStyle}>
    <Title eyebrow="You’re all set">Booking confirmed</Title><Subtitle>Saved on this device. A reminder will arrive shortly.</Subtitle>
    <Card style={styles.successCard}><View style={styles.successIcon}><Ionicons name="checkmark" size={28} color={colors.nearBlack} /></View><Badge tone="green">CONFIRMED</Badge><Text style={styles.refBig}>{pending.bookingRef}</Text><Text style={styles.summary}>{pending.name} · {pending.phone}</Text><Text style={styles.summary}>{pending.date} · start {pending.startHour}:00 · {pending.hours} hour(s)</Text><Text style={styles.total}>₱{pending.total}</Text><Divider /><Muted>{LOCATION.name} · {LOCATION.address} · {LOCATION.hours}</Muted><PrimaryButton label="Book another session" icon="add" onPress={resetForm} /></Card>
  </ScrollView></Screen>;

  return <Screen><ScrollView contentContainerStyle={screenContentStyle} keyboardShouldPersistTaps="handled">
    <Title eyebrow="Reserve your desk">Book your focus time</Title><Subtitle>Simple, quiet desk time at {LOCATION.name}.</Subtitle>
    <Card style={styles.hero}><View style={styles.heroTop}><View><Text style={styles.heroKicker}>DESK RATE</Text><Text style={styles.heroRate}>₱{rate}<Text style={styles.heroUnit}> / hour</Text></Text></View><Badge tone={member ? 'green' : 'gold'}>{member ? 'MEMBER RATE' : 'WALK-IN'}</Badge></View><Divider /><View style={styles.heroRow}><View><Text style={styles.heroLabel}>Today’s hours</Text><Text style={styles.heroValue}>{LOCATION.hours}</Text></View><View><Text style={styles.heroLabel}>Your total</Text><Text style={styles.heroValue}>₱{total}</Text></View></View><Muted>{member ? 'Membership is active on this device.' : `Join Member for ₱${PRICING.memberPerHour}/hr and extra promotions.`}</Muted></Card>
    <SectionHeader>When are you coming?</SectionHeader>
    <Card><Label>Date</Label><Field value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" /><Label>Start time</Label><View style={styles.rowWrap}>{startHours.map((h) => <Chip key={h} label={`${h}:00`} selected={startHour === h} onPress={() => setStartHour(h)} />)}</View><Label>How long?</Label><View style={styles.rowWrap}>{hourOptions.map((h) => <Chip key={h} label={`${h} hour${h > 1 ? 's' : ''}`} selected={hours === h} onPress={() => setHours(h)} />)}</View><Label>Your name</Label><Field value={name} onChangeText={setName} placeholder="Full name" /><Label>Phone</Label><Field value={phone} onChangeText={setPhone} placeholder="09xxxxxxxxx" keyboardType="phone-pad" /><View style={styles.priceBox}><Text style={styles.priceLine}>{member ? 'Member rate' : 'Walk-in rate'} · ₱{rate}/hr</Text><Text style={styles.total}>₱{total}</Text><Muted>Payment via GCash after you review the details.</Muted></View><PrimaryButton label="Review & pay with GCash" icon="arrow-forward" onPress={onContinueToPay} /></Card>
    {recent.length > 0 ? <><SectionHeader action={`${recent.length} saved`}>Recent bookings</SectionHeader><Card>{recent.slice(0, 5).map((b, index) => <View key={b.id} style={styles.recentRow}><View><Text style={styles.recentRef}>{b.bookingRef}</Text><Text style={styles.recentMeta}>{b.date} · {b.startHour}:00 · {b.hours}h</Text></View><Text style={styles.recentTotal}>₱{b.total}</Text>{index < Math.min(recent.length, 5) - 1 ? <Divider /> : null}</View>)}</Card></> : null}
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  hero: { borderColor: colors.borderStrong, backgroundColor: '#1A1813' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, heroKicker: { color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, heroRate: { color: colors.text, fontSize: 31, fontWeight: '800', marginTop: 4 }, heroUnit: { color: colors.textMuted, fontSize: 13, fontWeight: '500' }, heroRow: { flexDirection: 'row', gap: 42, marginBottom: spacing.sm }, heroLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 3 }, heroValue: { color: colors.text, fontSize: 15, fontWeight: '700' }, rowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 3 }, priceBox: { backgroundColor: colors.goldSoft, borderRadius: 12, padding: spacing.md, marginTop: spacing.lg }, priceLine: { color: colors.textMuted, fontSize: 13 }, total: { color: colors.goldBright, fontSize: 26, fontWeight: '800', marginVertical: 4 }, payTotal: { color: colors.goldBright, fontSize: 30, fontWeight: '800', marginTop: spacing.md }, payMeta: { color: colors.textMuted, fontSize: 13, marginTop: 3 }, qrCard: { backgroundColor: colors.white, borderRadius: 14, padding: 12, alignItems: 'center', marginBottom: spacing.md }, qrImg: { width: '100%', height: 270 }, qrLabel: { color: '#555', fontSize: 11, marginTop: 4 }, refBig: { color: colors.gold, fontSize: 21, fontWeight: '800', letterSpacing: 1, marginVertical: 7 }, successCard: { alignItems: 'center', paddingVertical: 28 }, successIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success, marginBottom: spacing.md }, summary: { color: colors.text, fontSize: 14, marginTop: 4, textAlign: 'center' }, recentRow: { position: 'relative' }, recentRef: { color: colors.gold, fontSize: 13, fontWeight: '800' }, recentMeta: { color: colors.textMuted, fontSize: 12, marginTop: 3 }, recentTotal: { position: 'absolute', right: 0, top: 1, color: colors.text, fontWeight: '700' },
});
