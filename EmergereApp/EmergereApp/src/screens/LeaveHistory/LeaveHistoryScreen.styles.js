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
  logo: { width: 26, height: 26, resizeMode: 'contain' },
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

  /* ── Empty state ── */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptyActionBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  /* ── Expanded In-line Details ── */
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
    letterSpacing: 0.8,
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

  /* ── Tracking Timeline ── */
  trackingContainer: {
    marginBottom: spacing.xs,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 52,
  },
  trackingDotCol: {
    alignItems: 'center',
    width: 28,
    marginRight: spacing.md,
  },
  trackingDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C6CCD6',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  trackingDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2F6BFF',
  },
  trackingLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E7EAF0',
    marginVertical: 2,
  },
  trackingLabelCol: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  trackingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  trackingSubLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  trackingBadgeWrap: {
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  trackingChipPending: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  trackingChipPendingText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
  trackingChipApproved: {
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  trackingChipApprovedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  trackingChipRejected: {
    backgroundColor: colors.dangerBg,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  trackingChipRejectedText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
});
