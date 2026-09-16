// src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './EmployeeDashboardScreen.styles';

const LEAVE_BALANCES = [
  { label: 'Casual Leave', used: 8, total: 12 },
  { label: 'Sick Leave', used: 5, total: 7 },
  { label: 'Earned Leave', used: 10, total: 15 },
];

const QUICK_ACTIONS = [
  { key: 'applyLeave', label: 'Apply Leave', icon: 'plus-circle' },
  { key: 'applyPermission', label: 'Apply Permission', icon: 'clock' },
  { key: 'viewAttendance', label: 'View Attendance', icon: 'calendar' },
  { key: 'viewHolidays', label: 'View Holidays', icon: 'x-circle' },
];

const INITIAL_REQUESTS = [
  {
    id: '1',
    title: 'Casual Leave (1 Day)',
    subtitle: 'Sep 07, 2026 • Personal Work',
    status: 'Pending',
    tone: 'warning',
  },
  {
    id: '2',
    title: 'Early Going (2 hrs)',
    subtitle: 'Sep 04, 2026 • Doctor Appointment',
    status: 'Approved',
    tone: 'success',
  },
];

export default function EmployeeDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [checkedIn, setCheckedIn] = useState(true);
  const [userProfile, setUserProfile] = useState(
    (typeof global !== 'undefined' && global.USER_PROFILE) || {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      employeeId: 'EMP-2024-0156',
    }
  );

  const go = (screen) => {
    if (screen === 'Profile' || screen === 'More' || screen === 'MyProfile') {
      const status = (typeof global !== 'undefined' && global.EMPLOYMENT_STATUS)
        ? global.EMPLOYMENT_STATUS
        : (checkedIn ? 'Active' : 'Inactive');
      navigation && navigation.navigate('MyProfile', { employmentStatus: status });
    } else {
      navigation && navigation.navigate(screen);
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    if (typeof global !== 'undefined') {
      global.EMPLOYMENT_STATUS = 'Active';
    }
    navigation && navigation.navigate('MyProfile', { employmentStatus: 'Active' });
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    if (typeof global !== 'undefined') {
      global.EMPLOYMENT_STATUS = 'Inactive';
    }
  };

  const handleDeleteRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  useEffect(() => {
    if (typeof global !== 'undefined' && global.USER_PROFILE) {
      setUserProfile(global.USER_PROFILE);
    }
    if (route && route.params) {
      // Manager approved / rejected a request — update its status in the list
      if (route.params.newStatus) {
        const { requestId, newStatus } = route.params;
        const tone = newStatus === 'Approved' ? 'success' : 'danger';
        setRequests((prev) =>
          prev.map((req) => (req.id === (requestId || '1') ? { ...req, status: newStatus, tone } : req))
        );
      }
      // Employee just submitted a leave request — prepend as Pending
      if (route.params.newLeaveRequest) {
        const req = route.params.newLeaveRequest;
        setRequests((prev) => {
          // Avoid duplicate if navigate is called twice
          if (prev.some((r) => r.id === req.id)) return prev;
          return [
            {
              id: req.id,
              title: req.title || `${req.leaveType || req.type} (${req.totalDays || '1 Day'})`,
              subtitle: req.subtitle || `${req.fromDate || ''} • ${req.reason || 'Leave request'}`,
              status: 'Pending',
              tone: 'warning',
            },
            ...prev,
          ];
        });
      }
      // Employee just submitted a permission request — prepend as Pending
      if (route.params.newPermissionRequest) {
        const req = route.params.newPermissionRequest;
        setRequests((prev) => {
          if (prev.some((r) => r.id === req.id)) return prev;
          return [
            {
              id: req.id,
              title: req.title || `${req.type} (${req.duration || '2 Hours'})`,
              subtitle: req.subtitle || `${req.schedule || ''} • ${req.reason || 'Permission request'}`,
              status: 'Pending',
              tone: 'warning',
            },
            ...prev,
          ];
        });
      }
      if (route.params.checkedIn !== undefined) {
        setCheckedIn(route.params.checkedIn);
      }
      if (route.params.userProfile) {
        setUserProfile(route.params.userProfile);
      }
    }
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../../assets/emergere-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => go('Notifications')}
          >
            <Feather name="bell" size={20} color={'#2F6BFF'} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
        <Text style={styles.companyName}>IT Solutions Pvt. Ltd.</Text>

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>Hello, {userProfile.name || 'Priya Sharma'}</Text>
          <Text style={styles.roleSubtitle}>{userProfile.role || 'Senior Software Engineer'} • {userProfile.employeeId || 'EMP-2024-0156'}</Text>
          <Text style={styles.date}>Thu, Sep 03 2026</Text>
        </View>

        <Card style={styles.attendanceCard}>
          <View style={styles.attendanceRow}>
            <View style={styles.statusDotRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: checkedIn ? '#1FAE6E' : '#E5484D' },
                ]}
              />
              <Text style={styles.attendanceText}>
                {checkedIn ? 'Checked In' : 'Checked Out'}
              </Text>
            </View>
            <View style={styles.btnGroup}>
              <TouchableOpacity
                style={styles.checkInBtn}
                onPress={handleCheckIn}
                activeOpacity={0.7}
              >
                <Text style={styles.checkInText}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkOutBtn}
                onPress={handleCheckOut}
                activeOpacity={0.7}
              >
                <Text style={styles.checkOutText}>Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Working Hours</Text>
              <Text style={styles.statValue}>6h 45m</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Break Duration</Text>
              <Text style={styles.statValue}>30m</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.balancesCard}>
          <Text style={styles.cardTitle}>Leave Balances</Text>
          {LEAVE_BALANCES.map((item) => (
            <View key={item.label} style={styles.balanceItem}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>{item.label}</Text>
                <Text style={styles.balanceValue}>
                  {item.used}/{item.total} Days
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(item.used / item.total) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.quickAction}
              onPress={() => go(action.key)}
            >
              <Feather name={action.icon} size={18} color="#2F6BFF" />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>RECENT REQUESTS ({requests.length})</Text>
        {requests.map((req) => (
          <Card key={req.id} style={styles.requestCard}>
            <View style={styles.requestRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.requestSubtitle}>{req.subtitle}</Text>
              </View>
              <View style={styles.requestActions}>
                <StatusBadge label={req.status} tone={req.tone} />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleDeleteRequest(req.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel="Delete request"
                >
                  <Feather name="x-circle" size={18} color="#9AA3B2" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
