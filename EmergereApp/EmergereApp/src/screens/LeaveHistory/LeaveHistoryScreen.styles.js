// src/screens/LeaveHistory/LeaveHistoryScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme/theme';

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
  subtitle: { color: colors.textSecondary, paddingHorizontal: spacing.lg, marginTop: 4 },
  scrollContent: { paddingBottom: spacing.xxl },
  requestCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  requestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  requestLeft: { flexDirection: 'row', gap: spacing.md, flex: 1, paddingRight: spacing.sm },
  requestTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  requestDate: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },
  remarkDivider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remarkText: { color: colors.textSecondary, fontStyle: 'italic', fontSize: 13, flex: 1 },
  viewDetailsLink: { color: colors.primary, fontWeight: '700', fontSize: 13, marginLeft: 8 },

  /* Expanded In-line Details Styles */
  expandedDetailsContainer: {
    marginTop: spacing.sm,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  expandedHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  detailGrid: {
    gap: 4,
  },
  detailGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  detailGridLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailGridValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  detailBlock: {
    marginTop: spacing.sm,
  },
  detailBlockLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
  },
  detailBlockText: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailBlockTextHighlight: {
    backgroundColor: colors.infoBg,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
