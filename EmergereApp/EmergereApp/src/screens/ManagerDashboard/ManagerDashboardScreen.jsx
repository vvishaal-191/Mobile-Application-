// src/screens/ManagerDashboard/ManagerDashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ManagerDashboardScreen.styles';

const STATS = [
  { key: 'pending', value: '18', label: 'Pending\nRequests', icon: 'file-text', color: '#0066FF', haloBg: '#DBEAFE', cardBg: '#F0F6FF', numColor: '#0066FF', borderColor: '#D6E6FE', target: 'LeaveApprovals' },
  { key: 'approved', value: '24', label: 'Approved\nThis Month', icon: 'check-circle', color: '#00A859', haloBg: '#DCFCE7', cardBg: '#F0FDF4', numColor: '#00A859', borderColor: '#CEF3D8', target: 'LeaveApprovals' },
  { key: 'rejected', value: '3', label: 'Rejected\nThis Month', icon: 'x-circle', color: '#EF4444', haloBg: '#FEE2E2', cardBg: '#FEF2F2', numColor: '#EF4444', borderColor: '#FCD4D4', target: 'LeaveApprovals' },
  { key: 'requestDetail', value: '12', label: 'Request\nDetail', icon: 'file-text', color: '#7C3AED', haloBg: '#EDE9FE', cardBg: '#FAF5FF', numColor: '#7C3AED', borderColor: '#E9D8FE', target: 'LeaveApprovalDetail' },
];

const QUICK_ACTIONS_CONFIG = [
  {
    key: 'TeamAttendance',
    title: 'Team Attendance',
    desc: 'View and manage team attendance',
    icon: 'users',
    target: 'TeamAttendance',
    bg: '#2563EB',
    iconBg: 'rgba(255,255,255,0.2)',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,0.85)',
    chevronBg: 'rgba(255,255,255,0.2)',
    chevronColor: '#FFFFFF',
  },
  {
    key: 'LeaveApprovals',
    title: 'Leave Approvals',
    desc: 'Review and approve leave requests',
    icon: 'file-text',
    target: 'LeaveApprovals',
    bg: '#EFF6FF',
    iconBg: '#2563EB',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#2563EB',
    badge: 0,
  },
  {
    key: 'PermissionApprovals',
    title: 'Permission Approvals',
    desc: 'Review permission requests',
    icon: 'clock',
    target: 'PermissionApprovals',
    bg: '#FFFBEB',
    iconBg: '#F59E0B',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#D97706',
    badge: 0,
  },
  {
    key: 'HolidayCalendar',
    title: 'Holiday Calendar',
    desc: 'View leaves, holidays and team schedule',
    icon: 'calendar',
    target: 'HolidayCalendar',
    bg: '#FAF5FF',
    iconBg: '#8B5CF6',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#8B5CF6',
  },
];

const SIDEBAR_ITEMS = [
  { key: 'ManagerDashboard', label: 'Manager Dashboard', icon: 'home', target: 'ManagerDashboard', active: true },
  { key: 'TeamAttendance', label: 'Team Attendance', icon: 'users', target: 'TeamAttendance' },
  { key: 'LeaveApprovals', label: 'Leave Approvals', icon: 'file-text', target: 'LeaveApprovals' },
  { key: 'PermissionApprovals', label: 'Permission Approvals', icon: 'check-square', target: 'PermissionApprovals' },
  { key: 'HolidayCalendar', label: 'Holiday Calendar', icon: 'calendar', target: 'HolidayCalendar' },
  { key: 'Notifications', label: 'Notifications', icon: 'bell', target: 'Notifications' },
  { key: 'MyProfile', label: 'My Profile', icon: 'user', target: 'MyProfile' },
];

/** Helper: detect if a request is a Permission request */
function isPermissionRequest(r) {
  if (!r) return false;
  if (r.isPermission === true || r._isPermCard === true) return true;
  if (r.isPermission === false) return false;
  if (r.permissionType) return true;
  const permTypes = ['Early Going', 'Late Coming', 'Personal Work', 'Official Work', 'Permission'];
  const t = (r.type || r.leaveType || r.permissionType || '').trim();
  return permTypes.includes(t);
}

export default function ManagerDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const [quickActions, setQuickActions] = useState(QUICK_ACTIONS_CONFIG);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const go = (screen, params) => {
    setSidebarVisible(false);
    if (navigation && navigation.navigate) {
      navigation.navigate(screen, params);
    }
  };

  useEffect(() => {
    const leaveReqs = (typeof global !== 'undefined' && global.LEAVE_REQUESTS) || [];
    const permReqs = (typeof global !== 'undefined' && (global.PERMISSION_REQUESTS || global.PERM_STATE)) || [];

    // Calculate pending badges for Quick Actions separately
    const pendingLeavesCount = leaveReqs.filter((r) => !isPermissionRequest(r) && (r.status || 'pending').toLowerCase() === 'pending').length;
    const pendingPermsCount = permReqs.filter((r) => isPermissionRequest(r) && (r.status || 'pending').toLowerCase() === 'pending').length;

    setQuickActions((qa) =>
      qa.map((action) => {
        if (action.key === 'LeaveApprovals') {
          return { ...action, badge: pendingLeavesCount };
        }
        if (action.key === 'PermissionApprovals') {
          return { ...action, badge: pendingPermsCount };
        }
        return action;
      })
    );

    // Build Recent Requests: ONLY approved or rejected requests appear in Recent Requests
    // Both Leave and Permission requests are kept completely independent and separate
    const decidedLeaves = leaveReqs
      .filter((r) => {
        const s = (r.status || '').toLowerCase();
        return !isPermissionRequest(r) && (s === 'approved' || s === 'rejected');
      })
      .map((r) => ({
        id: String(r.id),
        name: r.name || r.employeeName || 'Employee',
        role: r.role || r.employeeRole || 'Senior Software Engineer',
        empId: r.empId || r.employeeId || 'EMP-2024-0156',
        initials: r.initials || r.employeeInitials || 'EE',
        leaveType: r.leaveType || r.type || 'Casual Leave',
        type: r.leaveType || r.type || 'Casual Leave',
        fromDate: r.fromDate || '',
        toDate: r.toDate || '',
        totalDays: r.totalDays || r.duration || '1 Day',
        emergencyContact: r.emergencyContact || '',
        reason: r.reason || 'Personal work',
        subtitle: `${r.leaveType || r.type || 'Leave'} • ${r.fromDate ? `${r.fromDate}${r.toDate ? ' – ' + r.toDate : ''}` : (r.duration || 'Recent')}`,
        status: (r.status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected',
        tone: (r.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: false,
        timestamp: r.approvedAt || r.rejectedAt || r.createdAt || Date.now(),
      }));

    const decidedPerms = permReqs
      .filter((r) => {
        const s = (r.status || '').toLowerCase();
        return isPermissionRequest(r) && (s === 'approved' || s === 'rejected');
      })
      .map((r) => ({
        id: String(r.id),
        name: r.name || r.employeeName || 'Employee',
        role: r.role || r.employeeRole || 'UI/UX Designer',
        empId: r.empId || r.employeeId || 'EMP-2024-0101',
        initials: r.initials || r.employeeInitials || 'EE',
        leaveType: r.permissionType || r.type || 'Early Going',
        type: r.permissionType || r.type || 'Early Going',
        permissionType: r.permissionType || r.type || 'Early Going',
        schedule: r.schedule || (r.date ? `${r.date} (${r.duration || '2 Hours'})` : 'Today'),
        fromDate: r.date || r.fromDate || '',
        totalDays: r.duration || '2 Hours',
        reason: r.reason || 'Personal work',
        subtitle: `${r.permissionType || r.type || 'Early Going'} • ${r.schedule || r.date || 'Today'}`,
        status: (r.status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected',
        tone: (r.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: true,
        timestamp: r.approvedAt || r.rejectedAt || r.createdAt || Date.now(),
      }));

    const leaveDec = typeof global !== 'undefined' ? global.LAST_LEAVE_DECISION : null;
    const permDec = typeof global !== 'undefined' ? global.LAST_PERMISSION_DECISION : null;

    const combined = [...decidedLeaves, ...decidedPerms];

    if (leaveDec && !combined.some((c) => !c.isPermission && (String(c.id) === String(leaveDec.id) || c.name === leaveDec.name))) {
      combined.unshift({
        id: String(leaveDec.id || Date.now()),
        name: leaveDec.name || 'Priya Sharma',
        role: 'Senior Software Engineer',
        empId: 'EMP-2024-0156',
        initials: 'PS',
        leaveType: leaveDec.type || 'Casual Leave',
        type: leaveDec.type || 'Casual Leave',
        subtitle: `${leaveDec.type || 'Casual Leave'} • Sep 10 – Sep 11`,
        status: leaveDec.status || 'Approved',
        tone: (leaveDec.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: false,
        reason: 'Family function in hometown',
        timestamp: leaveDec.approvedAt || leaveDec.rejectedAt || Date.now(),
      });
    }

    if (permDec && !combined.some((c) => c.isPermission && (String(c.id) === String(permDec.id) || c.name === permDec.name))) {
      combined.unshift({
        id: String(permDec.id || Date.now()),
        name: permDec.name || 'Employee',
        role: 'UI/UX Designer',
        empId: 'EMP-2024-0101',
        initials: 'EE',
        leaveType: permDec.type || 'Early Going',
        type: permDec.type || 'Early Going',
        permissionType: permDec.type || 'Early Going',
        subtitle: `${permDec.type || 'Early Going'} • ${permDec.schedule || 'Today'}`,
        status: permDec.status || 'Approved',
        tone: (permDec.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: true,
        reason: 'Personal work',
        timestamp: permDec.approvedAt || permDec.rejectedAt || Date.now(),
      });
    }

    // Sort by latest timestamp
    combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Deduplicate by key
    const seen = new Set();
    const finalRecent = combined.filter((item) => {
      const key = `${item.isPermission ? 'perm' : 'leave'}_${item.id}_${item.name}_${item.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setRequests(finalRecent);
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerWrap}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.hamburgerBtn}
                activeOpacity={0.8}
                onPress={() => setSidebarVisible(true)}
              >
                <Feather name="menu" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Manager Dashboard</Text>
                <Text style={styles.headerSubtitle}>IT Solutions</Text>
              </View>
            </View>
          </View>

          {/* Greeting Row */}
          <View style={styles.greetingRow}>
            <View style={styles.greetingLeft}>
              <Text style={styles.greetingTitle}>Welcome back, Rahul 👋</Text>
              <Text style={styles.greetingSub}>Manage your team leave and permission requests</Text>
            </View>
            <View style={styles.mgrAvatarWrap}>
              <Text style={styles.mgrAvatarText}>RS</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.statCard, { backgroundColor: s.cardBg, borderColor: s.borderColor }]}
              activeOpacity={0.8}
              onPress={() => go(s.target)}
            >
              <View style={[styles.statHalo, { backgroundColor: s.haloBg }]}>
                <Feather name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.numColor }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSub}>Manage your team activities</Text>
        </View>

        <View style={styles.qaGrid}>
          {quickActions.map((qa) => (
            <TouchableOpacity
              key={qa.key}
              style={[styles.qaCard, { backgroundColor: qa.bg }]}
              activeOpacity={0.85}
              onPress={() => go(qa.target)}
            >
              <View style={styles.qaTop}>
                <View style={[styles.qaIconWrap, { backgroundColor: qa.iconBg }]}>
                  <Feather name={qa.icon} size={18} color="#FFFFFF" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {qa.badge !== undefined && qa.badge > 0 && (
                    <View style={styles.qaBadge}>
                      <Text style={styles.qaBadgeText}>{qa.badge}</Text>
                    </View>
                  )}
                  <View style={[styles.qaChevron, { backgroundColor: qa.chevronBg }]}>
                    <Feather name="chevron-right" size={14} color={qa.chevronColor} />
                  </View>
                </View>
              </View>
              <Text style={[styles.qaTitle, { color: qa.textColor }]}>{qa.title}</Text>
              <Text style={[styles.qaDesc, { color: qa.descColor }]}>{qa.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Requests Section (Approved/Rejected Leave and Permission Requests) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests ({requests.length})</Text>
          <Text style={styles.sectionSub}>Processed leave and permission requests</Text>
        </View>

        <View style={styles.recentList}>
          {requests.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="file-text" size={42} color="#BFDBFE" />
              <Text style={styles.emptyTitle}>No recent requests</Text>
              <Text style={styles.emptyDesc}>New leave or permission requests from your team will appear here.</Text>
            </View>
          ) : (
            requests.map((r) => (
              <TouchableOpacity
                key={`${r.isPermission ? 'perm' : 'leave'}_${r.id}`}
                activeOpacity={0.7}
                onPress={() => go('LeaveApprovalDetail', { person: r, decision: r.status, isPermission: r.isPermission })}
              >
                <Card style={{ marginBottom: 10, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{r.name}</Text>
                      <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.subtitle}</Text>
                    </View>
                    <StatusBadge label={r.status} tone={r.tone || (r.status === 'Approved' ? 'success' : 'danger')} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sidebar Drawer Modal */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebarDrawer} onStartShouldSetResponder={() => true}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarBrand}>
                <Image
                  source={require('../../../assets/tech-circuit-logo.png')}
                  style={styles.sidebarLogo}
                  resizeMode="contain"
                />
                <Text style={styles.sidebarTitle}>Mobile Application</Text>
              </View>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <Feather name="x" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.sidebarProfileCard}>
              <View style={styles.sidebarProfileTop}>
                <View style={styles.sidebarAvatar}>
                  <Text style={styles.sidebarAvatarText}>RS</Text>
                </View>
                <View>
                  <Text style={styles.sidebarProfileName}>Rahul Sharma</Text>
                  <View style={styles.sidebarRoleBadge}>
                    <Text style={styles.sidebarRoleBadgeText}>MANAGER</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.sidebarLogoutBtn}
                onPress={() => go('Login')}
              >
                <Feather name="log-out" size={15} color="#F87171" />
                <Text style={styles.sidebarLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation List */}
            <View style={styles.sidebarNavList}>
              {SIDEBAR_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.sidebarNavItem, item.active && styles.sidebarNavItemActive]}
                  onPress={() => go(item.target)}
                >
                  <View style={[styles.sidebarNavIconBox, item.active && styles.sidebarNavIconBoxActive]}>
                    <Feather name={item.icon} size={18} color={item.active ? '#FFFFFF' : '#FFFFFF'} />
                  </View>
                  <Text style={[styles.sidebarNavLabel, item.active && styles.sidebarNavLabelActive]}>
                    {item.label}
                  </Text>
                  <Feather name="chevron-right" size={16} color={item.active ? '#2563EB' : 'rgba(147, 197, 253, 0.65)'} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
