import React from 'react';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import {
  Card,
  Muted,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Subtitle,
  Title,
} from '../components/ui';
import { BRAND, LOCATION } from '../constants/config';
import { colors, spacing } from '../constants/theme';

export default function ReviewScreen() {
  async function openFacebook() {
    await Linking.openURL(BRAND.facebookUrl);
  }

  async function openInstagram() {
    await Linking.openURL(BRAND.instagramUrl);
  }

  async function openMaps() {
    if (BRAND.GOOGLE_MAPS_PLACE_URL) {
      await Linking.openURL(BRAND.GOOGLE_MAPS_PLACE_URL);
      return;
    }
    const q = encodeURIComponent(BRAND.mapsSearchQuery);
    await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Title>Review</Title>
        <Subtitle>Find us · follow · share the vibe</Subtitle>

        <Card>
          <Text style={styles.place}>{LOCATION.name}</Text>
          <Muted>{LOCATION.address}</Muted>
          <Muted>Hours {LOCATION.hours}</Muted>
          <Muted>
            @{BRAND.socialHandle} · {BRAND.studio} · {BRAND.name} {BRAND.version}
          </Muted>

          <PrimaryButton label="Open Facebook" onPress={openFacebook} />
          <PrimaryButton label="Open Instagram" onPress={openInstagram} />
          <SecondaryButton label="Open in Google Maps" onPress={openMaps} />

          <Muted>
            Maps opens a search for "{BRAND.mapsSearchQuery}". Set
            GOOGLE_MAPS_PLACE_URL in config when you have a real place link — no
            invented Place IDs.
          </Muted>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  place: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
