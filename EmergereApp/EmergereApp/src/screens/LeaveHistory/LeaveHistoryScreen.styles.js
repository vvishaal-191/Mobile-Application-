// src/screens/LeaveHistory/LeaveHistoryScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Royal Blue Gradient Header Banner matching Image 2 */
  headerBanner: {
    width: '100%',
    paddingTop: 48,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: '#0066FF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
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
    justifyContent: 'center',
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
    marginTop: 3,
  },
  headerIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerArtImg: {
    width: 80,
    height: 80,
  },

  /* Filter Segment Bar matching Image 2 */
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 18,
    marginVertical: 14,
    gap: 4,
  },
  filterPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
  },
  filterPillActive: {
    backgroundColor: '#0066FF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  scrollContent: {
    paddingBottom: 96,
  },

  /* Request Card */
  requestCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    padding: 16,
    shadowColor: '#0F1E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  requestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  requestDate: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: '500',
  },
  remarkDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remarkText: {
    color: '#64748B',
    fontStyle: 'italic',
    fontSize: 12.5,
    flex: 1,
  },
  viewDetailsLink: {
    color: '#0066FF',
    fontWeight: '700',
    fontSize: 12.5,
    marginLeft: 8,
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  emptyArtImg: {
    width: 240,
    height: 190,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  emptyActionBtn: {
    backgroundColor: '#0066FF',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },

  /* Expanded In-line Details */
  expandedDetailsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  expandedHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  detailGrid: {
    gap: 4,
  },
  detailGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailGridLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  detailGridValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  detailBlock: {
    marginTop: 8,
  },
  detailBlockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  detailBlockText: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
  },
  approverCommentsBox: {
    backgroundColor: '#EEF4FF',
    borderRadius: 8,
    padding: 10,
  },
  approverCommentsText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '600',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
  },
  docText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '600',
  },
});
