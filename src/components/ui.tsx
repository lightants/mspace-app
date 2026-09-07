import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LOCATION } from '../constants/config';
import { colors, radius, spacing, type } from '../constants/theme';

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 600 ? 24 : 16;
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.shell}><View style={[styles.content, { paddingHorizontal: horizontalPadding }, style]}>
        <Header />{children}
      </View></View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

export function Header() {
  return <View style={styles.header}>
    <View style={styles.brandRow}>
      <Image source={require('../../assets/logo-transparent.png')} style={styles.logo} />
      <View><Text style={styles.brandName}>MSpace</Text><Text style={styles.brandCaption}>work, focus, connect</Text></View>
    </View>
    <View style={styles.locationChip}><View style={styles.liveDot} /><Text style={styles.locationText}>M’lang · {LOCATION.hours}</Text></View>
  </View>;
}

export function Title({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return <View style={styles.titleBlock}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.title}>{children}</Text></View>;
}
export function Subtitle({ children }: { children: React.ReactNode }) { return <Text style={styles.subtitle}>{children}</Text>; }
export function SectionHeader({ children, action }: { children: React.ReactNode; action?: string }) { return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{children}</Text>{action ? <Text style={styles.sectionAction}>{action}</Text> : null}</View>; }
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) { return <View style={[styles.card, style]}>{children}</View>; }
export function Divider() { return <View style={styles.divider} />; }
export function Badge({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'green' | 'muted' }) { return <View style={[styles.badge, tone === 'green' && styles.badgeGreen, tone === 'muted' && styles.badgeMuted]}>{tone === 'green' ? <View style={styles.badgeDot} /> : null}<Text style={[styles.badgeText, tone === 'green' && styles.badgeTextGreen, tone === 'muted' && styles.badgeTextMuted]}>{children}</Text></View>; }
export function Label({ children }: { children: React.ReactNode }) { return <Text style={styles.label}>{children}</Text>; }

export function Field(props: TextInputProps) {
  const [focused, setFocused] = useState(false);
  return <TextInput placeholderTextColor={colors.textSubtle} {...props} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} style={[styles.input, focused && styles.inputFocused, props.style as TextStyle]} />;
}

export function PrimaryButton({ label, onPress, disabled, icon }: { label: string; onPress: () => void; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryBtn, disabled && styles.btnDisabled, pressed && !disabled && styles.btnPressed]}><Text style={styles.primaryBtnText}>{label}</Text>{icon ? <Ionicons name={icon} size={18} color={colors.nearBlack} /> : null}</Pressable>;
}
export function SecondaryButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}><Text style={styles.secondaryBtnText}>{label}</Text>{icon ? <Ionicons name={icon} size={18} color={colors.gold} /> : null}</Pressable>;
}
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}>{selected ? <Ionicons name="checkmark" size={14} color={colors.gold} /> : null}<Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>;
}
export function Muted({ children }: { children: React.ReactNode }) { return <Text style={styles.muted}>{children}</Text>; }
export function EmptyState({ icon, title, body, action }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: React.ReactNode }) { return <Card style={styles.emptyCard}><View style={styles.emptyIcon}><Ionicons name={icon} size={25} color={colors.gold} /></View><Text style={styles.emptyTitle}>{title}</Text><Muted>{body}</Muted>{action ? <View style={styles.emptyAction}>{action}</View> : null}</Card>; }
export const screenContentStyle = { paddingBottom: spacing.xxl } as const;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.nearBlack }, keyboard: { flex: 1 }, shell: { flex: 1, alignItems: 'center' }, content: { flex: 1, width: '100%', maxWidth: 528 },
  header: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }, brandRow: { flexDirection: 'row', alignItems: 'center' }, logo: { width: 38, height: 38, borderRadius: 11, marginRight: 10, backgroundColor: colors.nearBlack }, brandName: { color: colors.text, fontSize: 17, fontWeight: '800', letterSpacing: 0.3 }, brandCaption: { color: colors.textSubtle, fontSize: 10, marginTop: 1, letterSpacing: 0.5 }, locationChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 6 }, locationText: { color: colors.textMuted, fontSize: 10, fontWeight: '600' },
  titleBlock: { marginTop: 14 }, eyebrow: { color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11, fontWeight: '800', marginBottom: 6 }, title: { color: colors.text, fontSize: type.title, lineHeight: 32, fontWeight: '800', letterSpacing: -0.5 }, subtitle: { color: colors.textMuted, fontSize: type.body, lineHeight: 21, marginTop: 5, marginBottom: spacing.lg }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.sm }, sectionTitle: { color: colors.text, fontSize: type.section, fontWeight: '700' }, sectionAction: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md }, divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md }, badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, backgroundColor: colors.goldSoft, paddingHorizontal: 9, paddingVertical: 5 }, badgeGreen: { backgroundColor: colors.successSoft }, badgeMuted: { backgroundColor: colors.surfaceAlt }, badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 6 }, badgeText: { color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 }, badgeTextGreen: { color: colors.success }, badgeTextMuted: { color: colors.textMuted },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.2, marginTop: spacing.md, marginBottom: 7 }, input: { minHeight: 50, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, color: colors.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 }, inputFocused: { borderColor: colors.gold, backgroundColor: colors.goldSoft }, primaryBtn: { minHeight: 50, borderRadius: radius.sm, paddingHorizontal: spacing.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, backgroundColor: colors.gold, marginTop: spacing.md }, primaryBtnText: { color: colors.nearBlack, fontWeight: '800', fontSize: 15 }, secondaryBtn: { minHeight: 50, borderRadius: radius.sm, paddingHorizontal: spacing.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: colors.gold, marginTop: spacing.sm }, secondaryBtnText: { color: colors.gold, fontWeight: '700', fontSize: 15 }, btnDisabled: { opacity: 0.45 }, btnPressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  chip: { minHeight: 38, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, marginRight: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }, chipSelected: { backgroundColor: colors.goldSoft, borderColor: colors.gold }, chipPressed: { opacity: 0.75 }, chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' }, chipTextSelected: { color: colors.gold, fontWeight: '800' }, muted: { color: colors.textMuted, fontSize: 13, lineHeight: 19 }, emptyCard: { alignItems: 'center', paddingVertical: 30 }, emptyIcon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 27, backgroundColor: colors.goldSoft, marginBottom: spacing.md }, emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 6 }, emptyAction: { width: '100%', marginTop: spacing.sm },
});
