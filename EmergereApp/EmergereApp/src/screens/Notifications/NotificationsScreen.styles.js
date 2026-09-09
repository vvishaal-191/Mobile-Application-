// src/screens/Notifications/NotificationsScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  logo: { width: 22, height: 22 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, paddingHorizontal: spacing.lg, marginTop: 4, marginBottom: spacing.lg },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  recentLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  markAllText: { color: colors.primary, fontWeight: '700' },
  scrollContent: { paddingBottom: spacing.xxl },
  notifCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  notifCardUnread: { backgroundColor: colors.infoBg, borderColor: colors.infoBg },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTextWrap: { flex: 1 },
  notifText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },
  notifTime: { color: colors.textSecondary, marginTop: 6, fontSize: 13 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },

  emptyContainer: {
    alignItems: 'center',
    justify: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});