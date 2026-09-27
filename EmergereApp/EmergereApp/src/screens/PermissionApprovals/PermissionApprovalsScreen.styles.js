// src/screens/PermissionApprovals/PermissionApprovalsScreen.styles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 96,
  },

  // ── Header Banner ──
  headerBannerWrap: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: '#0066FF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  headerBannerImg: {
    width: '100%',
    height: 120,
  },
  backBtnHitbox: {
    position: 'absolute',
    left: 14,
    top: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },

  // ── Segmented Tab Bar ──
  tabBarCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: -18,
    marginBottom: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F1E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 6,
    zIndex: 10,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  tabPillActive: {
    backgroundColor: '#EFF6FF',
  },
  tabTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePending: {
    backgroundColor: '#DBEAFE',
  },
  badgeApproved: {
    backgroundColor: '#DCFCE7',
  },
  badgeRejected: {
    backgroundColor: '#FEE2E2',
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
    color: '#0066FF',
    fontWeight: '700',
  },
  tabIndicator: {
    height: 2.5,
    width: '60%',
    backgroundColor: '#0066FF',
    borderRadius: 2,
    marginTop: 4,
  },

  // ── Main Content Container ──
  approvalsCardContainer: {
    marginHorizontal: 16,
  },
  emptyCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F1E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 2,
    minHeight: 460,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  emptyArtWrap: {
    width: '100%',
    maxWidth: 240,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyArtImg: {
    width: '100%',
    height: '100%',
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Request Cards ──
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F1E50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  employeeRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subLabel: {
    color: '#64748B',
    marginTop: 2,
    fontSize: 12.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  detailValue: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 13,
    maxWidth: '65%',
    textAlign: 'right',
  },
  detailValueBold: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rejectText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  approveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
