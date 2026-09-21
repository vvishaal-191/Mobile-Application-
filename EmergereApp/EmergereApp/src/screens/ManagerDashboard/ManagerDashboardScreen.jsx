// src/screens/ManagerDashboard/ManagerDashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ManagerDashboardScreen.styles';

const OVERVIEW = [
  { label: 'Total Team', value: 12, color: '#2F6BFF' },
  { label: 'Present', value: 9, color: '#1FAE6E' },
  { label: 'On Leave', value: 2, color: '#E5484D' },
  { label: 'WFH', value: 1, color: '#8B5CF6' },
];

const INITIAL_QUICK_ACTIONS = [
  { key: 'TeamAttendance', label: 'Team Attendance', target: 'TeamAttendance' },
  { key: 'LeaveApprovals', label: 'Leave Approvals', badge: 3, target: 'LeaveApprovals' },
  { key: 'PermissionApprovals', label: 'Perm. Approvals', badge: 2, target: 'PermissionApprovals' },
  { key: 'TeamCalendar', label: 'Team Calendar', target: 'HolidayCalendar' },
];

const INITIAL_RECENT_REQUESTS = [];

export default function ManagerDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState(INITIAL_RECENT_REQUESTS);
  const [quickActions, setQuickActions] = useState(INITIAL_QUICK_ACTIONS);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

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
        status: 'Pending',
        tone: 'warning',
      }));

    if (allNew.length > 0) {
      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const fresh = allNew.filter((r) => !existingIds.has(r.id));
        if (fresh.length === 0) return prev;
        // Update leave approval badge count
        setQuickActions((qa) =>
          qa.map((action) =>
            action.key === 'LeaveApprovals'
              ? { ...action, badge: (action.badge || 0) + fresh.filter((r) => r.leaveType !== r.type).length || (action.badge || 0) + fresh.length }
              : action
          )
        );
        return [...fresh, ...prev];
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
          return [newReq, ...updated];
        }

        return updated;
      });

      // Decrement badge count in Quick Actions
      setQuickActions((prev) =>
        prev.map((qa) => {
          if (qa.key === 'LeaveApprovals' && (leaveDec || (!isPermission && routeDecision))) {
            return { ...qa, badge: 2 };
          }
          if (qa.key === 'PermissionApprovals' && (permDec || (isPermission && routeDecision))) {
            return { ...qa, badge: 1 };
          }
          return qa;
        })
      );
    }
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>Manager Dashboard</Text>
              <Text style={styles.headerSubtitle}>Emergere IT Solutions</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => go('Notifications')}>
            <Feather name="bell" size={20} color={'#2F6BFF'} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Hello, Rahul Sharma</Text>
            <Text style={styles.date}>Thu, Sep 03 2026</Text>
          </View>
          <StatusBadge label="Manager" tone="purple" />
        </View>

        <Card style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Team Attendance Overview</Text>
          <View style={styles.overviewRow}>
            {OVERVIEW.map((item) => (
              <View key={item.label} style={styles.overviewItem}>
                <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.overviewLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.quickAction}
              onPress={() => go(action.target)}
            >
              <Text style={styles.quickActionText}>{action.label}</Text>
              {action.badge ? (
                <View style={styles.quickBadge}>
                  <Text style={styles.quickBadgeText}>{action.badge}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>RECENT REQUESTS</Text>
        {requests.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.7}
            onPress={() => go('LeaveApprovalDetail', { person: r, decision: r.status })}
          >
            <Card style={styles.requestCard}>
              <View style={styles.requestRow}>
                <View>
                  <Text style={styles.requestName}>{r.name}</Text>
                  <Text style={styles.requestSubtitle}>{r.subtitle}</Text>
                </View>
                <StatusBadge label={r.status} tone={r.tone || (r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning')} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
