// src/screens/ManagerDashboard/ManagerDashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
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
    title: 'Perm. Approvals',
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
    key: 'TeamCalendar',
    title: 'Team Calendar',
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
  { key: 'PermissionApprovals', label: 'Perm. Approvals', icon: 'check-square', target: 'PermissionApprovals' },
  { key: 'TeamCalendar', label: 'Team Calendar', icon: 'calendar', target: 'HolidayCalendar' },
  { key: 'Notifications', label: 'Notifications', icon: 'bell', target: 'Notifications' },
  { key: 'MyProfile', label: 'My Profile', icon: 'user', target: 'MyProfile' },
];

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
    // Sync any leave/permission requests that have been decided (approved or rejected)
    const leaveReqs = (typeof global !== 'undefined' && global.LEAVE_REQUESTS) || [];
    const permReqs = (typeof global !== 'undefined' && global.PERMISSION_REQUESTS) || [];

    const allNew = [...leaveReqs, ...permReqs]
      .filter((r) => r && r.id && (r.status || 'Pending').toLowerCase() !== 'pending')
      .map((r) => ({
        id: r.id,
        name: r.name || 'Employee',
        role: r.role || '',
        empId: r.empId || '',
        initials: r.initials || 'EE',
        leaveType: r.leaveType || r.type || 'Leave',
        fromDate: r.fromDate || r.schedule || '',
        toDate: r.toDate || '',
        totalDays: r.totalDays || r.duration || '',
        emergencyContact: r.emergencyContact || '',
        reason: r.reason || '',
        subtitle: r.subtitle || `${r.leaveType || r.type || 'Leave'} • ${r.fromDate || r.schedule || ''}`,
        status: (r.status && r.status.toLowerCase() === 'rejected') ? 'Rejected' : 'Approved',
        tone: (r.status && r.status.toLowerCase() === 'rejected') ? 'danger' : 'success',
      }));

    const getSig = (item) =>
      `${(item.name || '').trim().toLowerCase()}|${(item.leaveType || item.type || '').trim().toLowerCase()}|${(item.fromDate || item.schedule || '').trim().toLowerCase()}`;

    const dedupeList = (list) => {
      const seen = new Set();
      return list.filter((item) => {
        const sig = getSig(item);
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      });
    };

    if (allNew.length > 0) {
      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const existingSigs = new Set(prev.map(getSig));
        const fresh = allNew.filter((r) => !existingIds.has(r.id) && !existingSigs.has(getSig(r)));
        if (fresh.length === 0) return prev;
        setQuickActions((qa) =>
          qa.map((action) =>
            action.key === 'LeaveApprovals'
              ? { ...action, badge: (action.badge || 0) + fresh.filter((r) => r.leaveType !== r.type).length || (action.badge || 0) + fresh.length }
              : action
          )
        );
        return dedupeList([...fresh, ...prev]);
      });
    }

    // Handle status change from LeaveApprovalDetail or global store
    const routeDecision = route?.params?.newStatus;
    const targetPerson = route?.params?.person;
    const isPermission = route?.params?.isPermission;
    const targetId = route?.params?.requestId || targetPerson?.id;

    const leaveDec = typeof global !== 'undefined' ? global.LAST_LEAVE_DECISION : null;
    const permDec = typeof global !== 'undefined' ? global.LAST_PERMISSION_DECISION : null;

    const activeStatus = routeDecision || (leaveDec && leaveDec.status) || (permDec && permDec.status);

    if (activeStatus) {
      const isApproved = activeStatus.toLowerCase() === 'approved';
      const statusText = isApproved ? 'Approved' : 'Rejected';
      const tone = isApproved ? 'success' : 'danger';

      setRequests((prev) => {
        let matched = false;
        const updated = prev.map((r) => {
          const nameMatch = targetPerson?.name && r.name && r.name.toLowerCase() === targetPerson.name.toLowerCase();
          const globalMatch = (leaveDec?.name && r.name && r.name.toLowerCase() === leaveDec.name.toLowerCase()) ||
                              (permDec?.name && r.name && r.name.toLowerCase() === permDec.name.toLowerCase());
          const idMatch = targetId && (r.id === targetId || (targetId === 'priya' && r.name === 'Priya Sharma') || (targetId === 'sneha' && r.name === 'Sneha Gupta'));

          if ((idMatch && !targetPerson?.name) || nameMatch || (idMatch && (!r.leaveType || !targetPerson?.leaveType || r.leaveType === targetPerson.leaveType)) || (!targetId && globalMatch)) {
            matched = true;
            return {
              ...r,
              status: statusText,
              tone: tone,
            };
          }
          return r;
        });

        if (!matched && targetPerson) {
          const newReq = {
            id: targetPerson.id || Date.now().toString(),
            name: targetPerson.name || 'Employee',
            role: targetPerson.role || 'Team Member',
            empId: targetPerson.empId || 'EMP-2024-0000',
            initials: targetPerson.initials || 'EM',
            leaveType: targetPerson.leaveType || targetPerson.type || (isPermission ? 'Permission' : 'Leave'),
            fromDate: targetPerson.fromDate || targetPerson.schedule || '',
            toDate: targetPerson.toDate || '',
            totalDays: targetPerson.totalDays || targetPerson.duration || '1 Day',
            emergencyContact: targetPerson.emergencyContact || '',
            reason: targetPerson.reason || '',
            subtitle: `${targetPerson.leaveType || targetPerson.type || 'Request'} • ${targetPerson.schedule || targetPerson.fromDate || 'Recent'}`,
            status: statusText,
            tone: tone,
          };
          return dedupeList([newReq, ...updated]);
        }

        return dedupeList(updated);
      });

      // Update badge counts in Quick Actions
      setQuickActions((prev) =>
        prev.map((qa) => {
          if (qa.key === 'LeaveApprovals' && (leaveDec || (!isPermission && routeDecision))) {
            return { ...qa, badge: 2 };
          }
          if (qa.key === 'PermissionApprovals' && (permDec || (isPermission && routeDecision))) {
            return { ...qa, badge: Math.max(0, (qa.badge || 0) - 1) };
          }
          return qa;
        })
      );
    }
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header matching Image 2 */}
        <View style={styles.headerWrap}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              {/* Sidebar Icon replacing circled logo (Image 3) */}
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
            <TouchableOpacity style={styles.bellButton} onPress={() => go('Notifications')}>
              <Feather name="bell" size={18} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Greeting Row */}
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingSub}>Good Morning,</Text>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Rahul Sharma</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Manager</Text>
                </View>
              </View>
              <View style={styles.dateRow}>
                <Feather name="calendar" size={13} color="rgba(224, 242, 254, 0.85)" />
                <Text style={styles.dateText}>Thu, Sep 03 2026</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4 Stat Cards Row matching Image 3 */}
        <View style={styles.statsCardRow}>
          {STATS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.statItem, { backgroundColor: item.cardBg, borderWidth: 1, borderColor: item.borderColor }]}
              activeOpacity={0.7}
              onPress={() => go(item.target)}
            >
              <View style={[styles.statIconBox, { backgroundColor: item.haloBg }]}>
                <Feather name={item.icon} size={16} color={item.color} />
              </View>
              <Text style={[styles.statValue, { color: item.numColor }]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#0066FF' }]}>
              <Feather name="zap" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionSubtitle}>Manage your team activities</Text>
            </View>
          </View>

          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={[styles.quickCard, { backgroundColor: action.bg }]}
                activeOpacity={0.8}
                onPress={() => go(action.target)}
              >
                <View style={styles.quickCardTop}>
                  <View style={[styles.quickIconBox, { backgroundColor: action.iconBg }]}>
                    <Feather name={action.icon} size={16} color={action.key === 'TeamAttendance' ? '#FFFFFF' : '#FFFFFF'} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {action.badge !== undefined && action.badge > 0 ? (
                      <View style={styles.qbadge}>
                        <Text style={styles.qbadgeText}>{action.badge}</Text>
                      </View>
                    ) : null}
                    <View style={[styles.chevronCircle, { backgroundColor: action.chevronBg }]}>
                      <Feather name="chevron-right" size={14} color={action.chevronColor} />
                    </View>
                  </View>
                </View>
                <Text style={[styles.quickCardTitle, { color: action.textColor }]}>{action.title}</Text>
                <Text style={[styles.quickCardDesc, { color: action.descColor }]}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Requests */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="clock" size={16} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Recent Requests ({requests.length})</Text>
              <Text style={styles.sectionSubtitle}>Latest leave and permission requests from your team</Text>
            </View>
          </View>

          {requests.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="file-text" size={42} color="#BFDBFE" />
              <Text style={styles.emptyTitle}>No recent requests</Text>
              <Text style={styles.emptyDesc}>New leave or permission requests from your team will appear here.</Text>
            </View>
          ) : (
            requests.map((r) => (
              <TouchableOpacity
                key={r.id}
                activeOpacity={0.7}
                onPress={() => go('LeaveApprovalDetail', { person: r, decision: r.status })}
              >
                <Card style={{ marginBottom: 10, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
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
                <Feather name="shield" size={20} color="#38BDF8" />
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
