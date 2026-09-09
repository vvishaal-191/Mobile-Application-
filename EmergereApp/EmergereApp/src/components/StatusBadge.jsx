// src/components/StatusBadge.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

// Maps a semantic "tone" to background/text colors so every screen
// (approvals, history, attendance) renders badges consistently.
const TONE_STYLES = {
  success: { bg: colors.successBg, fg: colors.success },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  warning: { bg: colors.warningBg, fg: colors.warning },
  info: { bg: colors.infoBg, fg: colors.info },
  purple: { bg: colors.purpleBg, fg: colors.purple },
  neutral: { bg: colors.divider, fg: colors.textSecondary },
};

export default function StatusBadge({ label, tone = 'neutral', style }) {
  const toneStyle = TONE_STYLES[tone] || TONE_STYLES.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.bg }, style]}>
      <Text style={[styles.text, { color: toneStyle.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
