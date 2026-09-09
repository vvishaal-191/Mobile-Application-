// src/screens/LeaveBalance/LeaveBalanceScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
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
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  periodText: { color: colors.textSecondary, fontWeight: '600' },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.infoBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  yearText: { color: colors.primary, fontWeight: '700' },
  balanceCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  balanceLabel: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  availableText: { fontWeight: '800', fontSize: 15 },
  progressTrack: { height: 8, backgroundColor: colors.divider, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.md },
  progressFill: { height: '100%', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: spacing.xxl },
  statLabel: { color: colors.textSecondary, fontSize: 13 },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
});
