import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Card,
  Field,
  Label,
  Muted,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
} from '../components/ui';
import { PRICING } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import type { MembershipApplication } from '../types';
import { getMembership, saveMembership } from '../utils/storage';

export default function MemberScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [existing, setExisting] = useState<MembershipApplication | null>(null);

  const refresh = useCallback(async () => {
    const m = await getMembership();
    setExisting(m);
    if (m) {
      setName(m.name);
      setPhone(m.phone);
      setEmail(m.email);
      setNotes(m.notes);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function onApply() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing info', 'Name and phone are required.');
      return;
    }
    const app: MembershipApplication = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      appliedAt: new Date().toISOString(),
      status: 'active',
      membershipActive: true,
    };
    await saveMembership(app);
    setExisting(app);
    Alert.alert(
      'Membership saved',
      `Desk rate ₱${PRICING.memberPerHour}/hr (${PRICING.memberDiscountLabel}) is now active on this device.`
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Title>Member</Title>
        <Subtitle>10% desk discount + promotions</Subtitle>

        <Card>
          <Muted>
            Membership unlocks ₱{PRICING.memberPerHour}/hr desk rate (walk-in ₱
            {PRICING.walkInPerHour}/hr) and member promotions at MSpace.
          </Muted>

          {existing?.membershipActive ? (
            <Text style={styles.badge}>
              Status: {existing.status} · membershipActive
            </Text>
          ) : (
            <Text style={styles.badgeMuted}>Not a member on this device yet</Text>
          )}

          <Label>Name</Label>
          <Field value={name} onChangeText={setName} placeholder="Full name" />

          <Label>Phone</Label>
          <Field
            value={phone}
            onChangeText={setPhone}
            placeholder="09xxxxxxxxx"
            keyboardType="phone-pad"
          />

          <Label>Email (optional)</Label>
          <Field
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Label>Notes</Label>
          <Field
            value={notes}
            onChangeText={setNotes}
            placeholder="How you use the space"
            multiline
          />

          <PrimaryButton
            label={existing?.membershipActive ? 'Update membership' : 'Apply for membership'}
            onPress={onApply}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  badge: {
    color: colors.gold,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  badgeMuted: {
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
