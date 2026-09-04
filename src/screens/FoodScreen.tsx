import React from 'react';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import {
  Card,
  Muted,
  PrimaryButton,
  Screen,
  Subtitle,
  Title,
} from '../components/ui';
import { BRAND } from '../constants/config';
import { colors, spacing } from '../constants/theme';
import partnersData from '../data/partners.json';
import type { Partner } from '../types';

const partners = partnersData as Partner[];

export default function FoodScreen() {
  async function openInstagram() {
    await Linking.openURL(BRAND.instagramUrl);
  }

  if (partners.length === 0) {
    return (
      <Screen>
        <Title>Food</Title>
        <Subtitle>Partner shops near MSpace</Subtitle>
        <Card>
          <Text style={styles.emptyTitle}>Coming soon</Text>
          <Muted>
            Partner shops around M'lang coming. Message @{BRAND.socialHandle} for
            food & drink nearby while you work.
          </Muted>
          <PrimaryButton
            label={`Message @${BRAND.socialHandle}`}
            onPress={openInstagram}
          />
        </Card>
        <Muted>
          Tip for operators: add partners in src/data/partners.json — do not invent
          shop names in the app.
        </Muted>
      </Screen>
    );
  }

  return (
    <Screen>
      <Title>Food</Title>
      <Subtitle>Partner shops near MSpace</Subtitle>
      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.name}</Text>
            {item.note ? <Muted>{item.note}</Muted> : null}
          </Card>
        )}
        ListFooterComponent={
          <View>
            <Muted>More partners? Message @{BRAND.socialHandle}</Muted>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyTitle: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
