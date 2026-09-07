import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import {
  Card,
  Chip,
  Field,
  Label,
  Muted,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Subtitle,
  Title,
} from '../components/ui';
import { BOOKING, LOCATION, PRICING } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import type { Booking } from '../types';
import {
  getBookings,
  isMembershipActive,
  makeBookingRef,
  saveBooking,
} from '../utils/storage';

type Step = 'form' | 'pay' | 'done';

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BookScreen() {
  const [step, setStep] = useState<Step>('form');
  const [date, setDate] = useState(todayISO());
  const [startHour, setStartHour] = useState(9);
  const [hours, setHours] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [member, setMember] = useState(false);
  const [pending, setPending] = useState<Booking | null>(null);
  const [recent, setRecent] = useState<Booking[]>([]);

  const refresh = useCallback(async () => {
    setMember(await isMembershipActive());
    setRecent(await getBookings());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const rate = member ? PRICING.memberPerHour : PRICING.walkInPerHour;
  const total = rate * hours;

  const startHours = Array.from(
    { length: BOOKING.startHourMax - BOOKING.startHourMin + 1 },
    (_, i) => BOOKING.startHourMin + i
  );
  const hourOptions = Array.from(
    { length: BOOKING.maxHours - BOOKING.minHours + 1 },
    (_, i) => BOOKING.minHours + i
  );

  async function scheduleConfirmNotification(ref: string) {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== 'granted') return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'MSpace booking confirmed',
          body: `Ref ${ref} · See you at MSpace Mlang`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
    } catch {
      // Notifications unavailable on some environments; booking still saved
    }
  }

  function onContinueToPay() {
    if (!date.trim() || !name.trim() || !phone.trim()) {
      Alert.alert('Missing info', 'Please fill date, name, and phone.');
      return;
    }
    const end = startHour + hours;
    if (end > LOCATION.closeHour) {
      Alert.alert(
        'Hours',
        `Booking would end after ${LOCATION.closeHour}:00. Choose fewer hours or an earlier start.`
      );
      return;
    }
    const bookingRef = makeBookingRef();
    const booking: Booking = {
      id: bookingRef,
      date: date.trim(),
      startHour,
      hours,
      name: name.trim(),
      phone: phone.trim(),
      ratePerHour: rate,
      total,
      isMemberRate: member,
      bookingRef,
      createdAt: new Date().toISOString(),
      paidPlaceholder: false,
    };
    setPending(booking);
    setStep('pay');
  }

  async function onConfirmPaid() {
    if (!pending) return;
    const confirmed = { ...pending, paidPlaceholder: true };
    await saveBooking(confirmed);
    await scheduleConfirmNotification(confirmed.bookingRef);
    setPending(confirmed);
    setStep('done');
    await refresh();
  }

  function resetForm() {
    setStep('form');
    setPending(null);
    setHours(1);
    setStartHour(9);
  }

  if (step === 'pay' && pending) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Title>GCash pay</Title>
          <Subtitle>Scan GCash · then confirm</Subtitle>
          <Card>
            <Text style={styles.ref}>Ref: {pending.bookingRef}</Text>
            <Muted>
              Cashless only — scan the official MSpace GCash poster. Amount ₱{pending.total}.
              Put the booking ref in the transfer note. We do not auto-verify GCash.
            </Muted>
            <View style={styles.qrBox}>
              <Image
                source={require('../../assets/gcash-qr.png')}
                style={styles.qrImg}
                resizeMode="contain"
                accessibilityLabel="MSpace GCash Scan to Pay poster"
              />
              <Muted>Booking ref for transfer note:</Muted>
              <Text style={styles.refBig}>{pending.bookingRef}</Text>
            </View>
            <Text style={styles.summary}>
              {pending.date} · {pending.startHour}:00 · {pending.hours}h · ₱
              {pending.ratePerHour}/hr
            </Text>
            <PrimaryButton label="I've paid — confirm booking" onPress={onConfirmPaid} />
            <SecondaryButton label="Back" onPress={() => setStep('form')} />
          </Card>
        </ScrollView>
      </Screen>
    );
  }

  if (step === 'done' && pending) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Title>Booked</Title>
          <Subtitle>Saved on this device · notification scheduled</Subtitle>
          <Card>
            <Text style={styles.refBig}>{pending.bookingRef}</Text>
            <Text style={styles.summary}>
              {pending.name} · {pending.phone}
            </Text>
            <Text style={styles.summary}>
              {pending.date} · start {pending.startHour}:00 · {pending.hours} hour(s)
            </Text>
            <Text style={styles.total}>₱{pending.total}</Text>
            <Muted>
              {LOCATION.name} · {LOCATION.address} · Hours {LOCATION.hours}
            </Muted>
            <PrimaryButton label="Book again" onPress={resetForm} />
          </Card>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Title>Book</Title>
        <Subtitle>
          Desk time at {LOCATION.name} · Hours {LOCATION.hours}
        </Subtitle>

        <Card>
          <Label>Date (YYYY-MM-DD)</Label>
          <Field value={date} onChangeText={setDate} placeholder="2026-09-04" />

          <Label>Start hour (9–17)</Label>
          <View style={styles.rowWrap}>
            {startHours.map((h) => (
              <Chip
                key={h}
                label={`${h}:00`}
                selected={startHour === h}
                onPress={() => setStartHour(h)}
              />
            ))}
          </View>

          <Label>Hours (1–8)</Label>
          <View style={styles.rowWrap}>
            {hourOptions.map((h) => (
              <Chip
                key={h}
                label={`${h}h`}
                selected={hours === h}
                onPress={() => setHours(h)}
              />
            ))}
          </View>

          <Label>Name</Label>
          <Field value={name} onChangeText={setName} placeholder="Your name" />

          <Label>Phone</Label>
          <Field
            value={phone}
            onChangeText={setPhone}
            placeholder="09xxxxxxxxx"
            keyboardType="phone-pad"
          />

          <View style={styles.priceBox}>
            <Text style={styles.priceLine}>
              Rate: ₱{rate}/hr ({member ? `member · ${PRICING.memberDiscountLabel}` : 'walk-in'})
            </Text>
            <Text style={styles.total}>Total ₱{total}</Text>
            <Muted>
              Walk-in ₱{PRICING.walkInPerHour}/hr · Member/app ₱{PRICING.memberPerHour}/hr
              {member ? ' · membership active on this device' : ' · apply in Member tab for ₱45'}
            </Muted>
          </View>

          <PrimaryButton label="Continue to GCash" onPress={onContinueToPay} />
        </Card>

        {recent.length > 0 && (
          <Card>
            <Text style={styles.section}>Recent bookings</Text>
            {recent.slice(0, 5).map((b) => (
              <Text key={b.id} style={styles.recentLine}>
                {b.bookingRef} · {b.date} · ₱{b.total}
              </Text>
            ))}
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  priceBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.goldSoft,
  },
  priceLine: { color: colors.text, marginBottom: 4 },
  total: { color: colors.gold, fontSize: 22, fontWeight: '700', marginVertical: 4 },
  ref: { color: colors.gold, fontWeight: '700', marginBottom: 8 },
  refBig: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
    letterSpacing: 1,
  },
  qrImg: { width: "100%", height: 320, marginVertical: 12 },
  qrBox: {
    marginVertical: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
  },
  qrNote: { color: colors.gold, fontWeight: '600', marginBottom: 8 },
  summary: { color: colors.text, marginTop: 4 },
  section: { color: colors.gold, fontWeight: '700', marginBottom: 8 },
  recentLine: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
});
