// src/components/BottomNavBar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

// Bottom tab bar matching the 5-tab layout seen on every screen:
// Dashboard | Attendance | Apply | History | More
const TABS = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'Attendance', label: 'Attendance', icon: 'calendar' },
  { key: 'Apply', label: 'Apply', icon: 'plus-circle' },
  { key: 'History', label: 'History', icon: 'clock' },
  { key: 'Profile', label: 'Profile', icon: 'user' },
];

export default function BottomNavBar({ active, onNavigate }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key || (tab.key === 'Profile' && (active === 'Profile' || active === 'More'));
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate(tab.key)}
          >
            <Feather
              name={tab.icon}
              size={22}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
