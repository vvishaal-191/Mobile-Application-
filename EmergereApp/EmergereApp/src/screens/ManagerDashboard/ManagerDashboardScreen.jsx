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

const INITIAL_RECENT_REQUESTS = [
  { id: '1', name: 'Priya Sharma', subtitle: 'Casual Leave • Sep 10-11 (2 Days)', status: 'Pending', tone: 'warning' },
  { id: '2', name: 'Sneha Gupta', subtitle: 'Earned Leave • Sep 15-19 (5 Days)', status: 'Pending', tone: 'warning' },
];

export default function ManagerDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState(INITIAL_RECENT_REQUESTS);
  const [quickActions, setQuickActions] = useState(INITIAL_QUICK_ACTIONS);

  const go = (screen) => navigation && navigation.navigate(screen);

  useEffect(() => {
    if (route && route.params && route.params.newStatus) {
      const { requestId, newStatus } = route.params;
      const tone = newStatus === 'Approved' ? 'success' : 'danger';

      setRequests((prev) =>
        prev.map((r) => (r.id === (requestId || '1') ? { ...r, status: newStatus, tone } : r))
      );

      setQuickActions((prev) =>
        prev.map((qa) =>
          qa.key === 'LeaveApprovals' && qa.badge
            ? { ...qa, badge: Math.max(0, qa.badge - 1) }
            : qa
        )
      );
    }
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>Manager Hub</Text>
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
            onPress={() => navigation && navigation.navigate('LeaveApprovalDetail', { request: r })}
          >
            <Card style={styles.requestCard}>
              <View style={styles.requestRow}>
                <View>
                  <Text style={styles.requestName}>{r.name}</Text>
                  <Text style={styles.requestSubtitle}>{r.subtitle}</Text>
                </View>
                <StatusBadge
                  label={r.status}
                  tone={r.tone || (r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning')}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
