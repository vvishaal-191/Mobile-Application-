// src/screens/ManagerDashboard/ManagerDashboardScreen.styles.js
import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, radius } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: spacing.xxl + 20 },

  // Top Royal Blue Header
  headerWrap: {
    backgroundColor: '#003DA5',
    paddingTop: spacing.xxl + 4,
    paddingBottom: spacing.xxl + 10,
    paddingHorizontal: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // Sidebar Hamburger Icon (Image 3)
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(224, 242, 254, 0.85)',
    marginTop: 2,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Greeting row
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(224, 242, 254, 0.85)',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dateText: {
    color: 'rgba(224, 242, 254, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },

  // 4 Top Stats Cards matching Image 3
  statsCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 16,
    marginTop: -24,
    marginBottom: spacing.lg,
    shadowColor: '#002888',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    gap: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 12,
  },

  // Section Headers (WITHOUT "View All")
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },

  // Quick Actions 2x2 Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: (width - 68) / 2,
    borderRadius: 14,
    padding: 12,
    minHeight: 96,
  },
  quickCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickCardDesc: {
    fontSize: 10,
    fontWeight: '500',
  },
  qbadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
  },
  qbadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // Empty State in Recent Requests
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },

  // Sidebar Drawer Modal
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 24, 0.6)',
  },
  sidebarDrawer: {
    width: 310,
    height: '100%',
    backgroundColor: '#001A5E',
    padding: 20,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sidebarProfileCard: {
    backgroundColor: 'rgba(20, 85, 220, 0.45)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(120, 180, 255, 0.35)',
  },
  sidebarProfileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E78FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sidebarProfileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sidebarRoleBadge: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sidebarRoleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  sidebarLogoutBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.6)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sidebarLogoutText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 13,
  },
  sidebarNavList: {
    gap: 6,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 12,
  },
  sidebarNavItemActive: {
    backgroundColor: '#DCE9FE',
  },
  sidebarNavIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarNavIconBoxActive: {
    backgroundColor: '#0066FF',
  },
  sidebarNavLabel: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sidebarNavLabelActive: {
    color: '#0A2540',
    fontWeight: '700',
  },
});
