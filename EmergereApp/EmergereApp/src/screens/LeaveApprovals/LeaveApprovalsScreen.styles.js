// src/screens/LeaveApprovals/LeaveApprovalsScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  requestCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  employeeRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  empId: { color: colors.textSecondary, marginTop: 2, fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  detailLabel: { color: colors.textSecondary },
  detailValue: { color: colors.textPrimary, fontWeight: '600', maxWidth: '65%', textAlign: 'right' },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  rejectText: { color: colors.danger, fontWeight: '800' },
  approveBtn: {
    flex: 1,
    backgroundColor: colors.successBgStrong,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  approveText: { color: colors.success, fontWeight: '800' },
});
