// src/screens/Notifications/NotificationsScreen.styles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  // Curved Royal Blue Header
  headerBanner: {
    backgroundColor: '#0066FF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: '#0050EA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  bellArtWrap: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Body Content
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0066FF',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  recentPillText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearAllText: {
    color: '#0066FF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    marginLeft: 2,
    letterSpacing: -0.2,
  },

  // Notification Cards
  cardList: {
    gap: 12,
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4.5,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  cardApproved: {
    borderLeftColor: '#10B981',
  },
  cardPermission: {
    borderLeftColor: '#0066FF',
  },
  cardRejected: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FFFDFD',
  },
  cardHoliday: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFFFE',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeGreen: {
    backgroundColor: '#DCFCE7',
  },
  badgeBlue: {
    backgroundColor: '#DBEAFE',
  },
  badgeRed: {
    backgroundColor: '#FEE2E2',
  },
  badgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  notifTextWrap: {
    flex: 1,
    paddingRight: 4,
  },
  notifText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 19,
  },
  highlightGreen: {
    color: '#059669',
    fontWeight: '700',
  },
  highlightBlue: {
    color: '#0066FF',
    fontWeight: '700',
  },
  highlightRed: {
    color: '#DC2626',
    fontWeight: '700',
  },
  highlightAmber: {
    color: '#D97706',
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '500',
  },
  dismissBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnRed: {
    backgroundColor: '#FEE2E2',
  },
  dismissBtnAmber: {
    backgroundColor: '#FEF3C7',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
  },
});