// src/screens/LeaveBalance/LeaveBalanceScreen.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F8FD',
  },
  scrollContent: {
    paddingBottom: 96,
  },

  // ── Header Banner ──
  headerBanner: {
    backgroundColor: '#0066FF',
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },

  // ── 3D Calendar Illustration ──
  calendarIllustrateBox: {
    width: 68,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    position: 'relative',
    shadowColor: '#001F5C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  calendarHeaderBar: {
    height: 14,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 4,
  },
  calendarRingsRow: {
    position: 'absolute',
    top: -4,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarRing: {
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: 2,
  },
  calendarCell: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
    opacity: 0.75,
  },
  calendarClockBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0066FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // ── Header Bottom Row (Period & Year) ──
  headerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    gap: 12,
  },
  periodPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  periodIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EBF3FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  periodVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 2,
  },
  yearPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  yearText: {
    color: '#0066FF',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Cards Container ──
  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#003296',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  availablePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Progress Bar ──
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    marginVertical: 14,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  // ── Stats Row ──
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  statBoxNeutral: {
    backgroundColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
});
