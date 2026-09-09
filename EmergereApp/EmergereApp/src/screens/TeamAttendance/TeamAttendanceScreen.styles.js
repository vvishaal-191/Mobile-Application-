// src/screens/TeamAttendance/TeamAttendanceScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../theme/theme';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  dateNav: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  arrowBtn: {
    padding: spacing.md,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7EEFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  dateText: { fontSize: 15, fontWeight: '800', color: colors.primary },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryText: { fontWeight: '700', fontSize: 13 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  scrollContent: { paddingBottom: spacing.xxl },
  memberCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  memberDetail: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },

  /* Modal Picker Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl || 20,
    padding: spacing.lg,
    elevation: 8,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md || 12,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: '#E7EEFF',
  },
  pickerItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: '800',
  },
  closePickerBtn: {
    marginTop: spacing.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closePickerText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 15,
  },
});
