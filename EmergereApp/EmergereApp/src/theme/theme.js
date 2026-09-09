// src/theme/theme.js
// Central design tokens used across every screen so the app stays visually consistent.

export const colors = {
  primary: '#2F6BFF',
  primaryDark: '#1E4FD6',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  navyDark: '#1B2333', // login screen background

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9AA3B2',

  success: '#1FAE6E',
  successBg: '#E3F8EE',
  successBgStrong: '#DFF7EC',
  danger: '#E5484D',
  dangerBg: '#FCE4E4',
  warning: '#F5A623',
  warningBg: '#FDF0DA',
  purple: '#8B5CF6',
  purpleBg: '#EFE9FE',
  info: '#2F6BFF',
  infoBg: '#E7EEFF',

  border: '#E7EAF0',
  divider: '#EDEFF3',
  chipBg: '#EEF2FF',
  disabled: '#C6CCD6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400', color: colors.textPrimary },
  bodyBold: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
};

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

export default { colors, spacing, radius, typography, shadow };
