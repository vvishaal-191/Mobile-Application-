// src/screens/HolidayCalendar/HolidayCalendarScreen.styles.js
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
  subtitle: { color: colors.textSecondary, paddingHorizontal: spacing.lg, marginTop: 4 },
  scrollContent: { paddingBottom: spacing.xxl },
  monthLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  holidayCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  holidayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  dateBlock: { width: 60 },
  dateText: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  dayText: { color: colors.textSecondary, fontSize: 13 },
  nameText: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
});
