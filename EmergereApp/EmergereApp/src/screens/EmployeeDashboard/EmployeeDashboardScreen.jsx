// src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
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

const ACTION_CARDS = [
  {
    key: 'applyLeave',
    title: 'Apply Leave',
    subtitle: 'Plan your time off',
    icon: 'calendar',
    iconColor: '#2F6BFF',
    iconBg: '#EEF4FF',
    screen: 'ApplyLeave',
  },
  {
    key: 'applyPermission',
    title: 'Apply Permission',
    subtitle: 'Request short leave',
    icon: 'file-text',
    iconColor: '#1FAE6E',
    iconBg: '#E6F9F0',
    screen: 'ApplyPermission',
  },
  {
    key: 'myRequests',
    title: 'My Requests',
    subtitle: 'Track your leaves & permissions',
    icon: 'layers',
    iconColor: '#7C3AED',
    iconBg: '#F1EDFD',
    screen: 'LeaveHistory',
  },
  {
    key: 'holidayCalendar',
    title: 'Holiday Calendar',
    subtitle: 'View upcoming holidays',
    icon: 'calendar',
    iconColor: '#FA6400',
    iconBg: '#FFF1E5',
    screen: 'HolidayCalendar',
  },
];

const INITIAL_REQUESTS = [];

export default function EmployeeDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [userProfile, setUserProfile] = useState(
    (typeof global !== 'undefined' && global.USER_PROFILE) || {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      employeeId: 'EMP-2024-0156',
      email: 'priya@it-solutions.com',
    }
  );

  const go = (screen) => {
    if (screen === 'Profile' || screen === 'More' || screen === 'MyProfile') {
      const status = (typeof global !== 'undefined' && global.EMPLOYMENT_STATUS)
        ? global.EMPLOYMENT_STATUS
        : 'Active';
      navigation && navigation.navigate('MyProfile', { employmentStatus: status });
    } else {
      navigation && navigation.navigate(screen);
    }
  };

  const handleDeleteRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  // Start or stop the gentle glow pulse animation
  useEffect(() => {
    if (hasNewNotification) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [hasNewNotification]);

  useEffect(() => {
    // Check for any unread notifications pushed by the manager
    if (typeof global !== 'undefined' && global.NOTIFICATIONS && global.NOTIFICATIONS.some((n) => n.unread)) {
      setHasNewNotification(true);
    }
    if (typeof global !== 'undefined' && global.USER_PROFILE) {
      setUserProfile(global.USER_PROFILE);
    }
    if (typeof global !== 'undefined' && global.LAST_LEAVE_DECISION) {
      const dec = global.LAST_LEAVE_DECISION;
      const tone = dec.status.toLowerCase() === 'approved' ? 'success' : 'danger';
      const st = dec.status.toLowerCase() === 'approved' ? 'Approved' : 'Rejected';
      setRequests((prev) => {
        const seen = new Set();
        const updated = prev.map((req) =>
          (req.id === (dec.id || '1') || (req.title && req.title.includes(dec.type || 'Casual Leave')))
            ? { ...req, status: st, tone }
            : req
        );
        return updated.filter((r) => {
          const key = `${r.title}|${r.subtitle}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });
    }
    if (typeof global !== 'undefined' && global.LAST_PERMISSION_DECISION) {
      const pDec = global.LAST_PERMISSION_DECISION;
      const tone = pDec.status.toLowerCase() === 'approved' ? 'success' : 'danger';
      const st = pDec.status.toLowerCase() === 'approved' ? 'Approved' : 'Rejected';
      setRequests((prev) => {
        const seen = new Set();
        let matched = false;
        const updated = prev.map((req) => {
          if (req.id === pDec.id || (req.title && (req.title.includes(pDec.type || 'Going') || req.title.includes('Late Coming')))) {
            matched = true;
            return { ...req, status: st, tone };
          }
          return req;
        });
        return updated.filter((r) => {
          const key = `${r.title}|${r.subtitle}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });
    }
    if (route && route.params) {
      // Manager approved / rejected a request — trigger the notification glow
      if (route.params.newStatus) {
        setHasNewNotification(true);
        const { requestId, newStatus, isPermission, permissionType, duration } = route.params;
        const tone = newStatus === 'Approved' ? 'success' : 'danger';
        setRequests((prev) => {
          const seen = new Set();
          let matched = false;
          const updated = prev.map((req) => {
            const isIdMatch = req.id === requestId;
            const isLeaveMatch = !isPermission && (req.id === (requestId || '1') || (req.title && req.title.includes('Casual Leave')));
            const isPermMatch = isPermission && (req.id === requestId || (req.title && (req.title.includes(permissionType || 'Going') || req.title.includes('Late Coming') || req.title.includes('Permission'))));
            if (isIdMatch || isPermMatch || isLeaveMatch) {
              matched = true;
              return { ...req, status: newStatus, tone };
            }
            return req;
          });
          if (isPermission && !matched) {
            updated.unshift({
              id: requestId || Date.now().toString(),
              title: `${permissionType || 'Permission'} (${duration || '30 Mins'})`,
              subtitle: 'Sep 04, 2026 • Doctor Appointment',
              status: newStatus,
              tone,
            });
          }
          return updated.filter((r) => {
            const key = `${r.title}|${r.subtitle}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });
      }
      // Employee just submitted a leave request — prepend as Pending (display only once)
      if (route.params.newLeaveRequest) {
        const req = route.params.newLeaveRequest;
        setRequests((prev) => {
          const title = req.title || `${req.leaveType || req.type} (${req.totalDays || '1 Day'})`;
          const subtitle = req.subtitle || `${req.fromDate || ''} • ${req.reason || 'Leave request'}`;
          if (prev.some((r) => r.id === req.id || (r.title === title && r.subtitle === subtitle))) return prev;
          return [
            {
              id: req.id,
              title,
              subtitle,
              status: 'Pending',
              tone: 'warning',
            },
            ...prev,
          ];
        });
      }
      // Employee just submitted a permission request — prepend as Pending (display only once)
      if (route.params.newPermissionRequest) {
        const req = route.params.newPermissionRequest;
        setRequests((prev) => {
          const title = req.title || `${req.type} (${req.duration || '2 Hours'})`;
          const subtitle = req.subtitle || `${req.schedule || ''} • ${req.reason || 'Permission request'}`;
          if (prev.some((r) => r.id === req.id || (r.title === title && r.subtitle === subtitle))) return prev;
          return [
            {
              id: req.id,
              title,
              subtitle,
              status: 'Pending',
              tone: 'warning',
            },
            ...prev,
          ];
        });
      }
      if (route.params.userProfile) {
        setUserProfile(route.params.userProfile);
      }
    }
    // De-duplicate requests to ensure each leave/permission is displayed only once
    setRequests((prev) => {
      const seen = new Set();
      return prev.filter((r) => {
        const key = `${r.title}|${r.subtitle}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../../assets/emergere-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Dashboard</Text>
          </View>
          <View style={styles.bellWrapper}>
            <Animated.View
              style={[
                styles.bellGlowRing,
                {
                  opacity: hasNewNotification ? glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.55],
                  }) : 0,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.bellButton}
              onPress={() => {
                setHasNewNotification(false);
                // Mark notifications as read
                if (typeof global !== 'undefined' && global.NOTIFICATIONS) {
                  global.NOTIFICATIONS = global.NOTIFICATIONS.map((n) => ({ ...n, unread: false }));
                }
                go('Notifications');
              }}
            >
              <Feather name="bell" size={20} color={'#2F6BFF'} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.companyName}>IT Solutions Pvt. Ltd.</Text>

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>Hello, {userProfile.name || 'Priya Sharma'}</Text>
          <Text style={styles.roleSubtitle}>{userProfile.role || 'Senior Software Engineer'} • {userProfile.employeeId || 'EMP-2024-0156'}</Text>
          <Text style={styles.date}>Thu, Sep 03 2026</Text>
        </View>

        {/* 2x2 Action Cards from Image 2 */}
        <View style={styles.actionGrid}>
          {ACTION_CARDS.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.actionCard}
              onPress={() => go(action.screen)}
              activeOpacity={0.75}
            >
              <View style={styles.actionTop}>
                <View style={[styles.actionIconWrap, { backgroundColor: action.iconBg }]}>
                  <Feather name={action.icon} size={22} color={action.iconColor} />
                </View>
                <View style={styles.actionChevron}>
                  <Feather name="chevron-right" size={16} color="#2F6BFF" />
                </View>
              </View>
              <View style={styles.actionBody}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSub}>{action.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leave Balances Card with matching container style */}
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

        <Text style={styles.sectionLabel}>RECENT REQUESTS ({requests.length})</Text>
        {requests.map((req) => (
          <Card key={req.id} style={styles.requestCard}>
            <View style={styles.requestRow}>
              <TouchableOpacity
                style={{ flex: 1, paddingRight: 8 }}
                activeOpacity={0.7}
                onPress={() => {
                  const isPerm =
                    req.title &&
                    (req.title.includes('Going') ||
                      req.title.includes('Coming') ||
                      req.title.includes('Permission'));
                  navigation.navigate('LeaveApprovalDetail', {
                    person: {
                      id: req.id,
                      name: userProfile.name || 'Priya Sharma',
                      initials: userProfile.initials || 'PS',
                      empId: userProfile.employeeId || 'EMP-2024-0156',
                      role: userProfile.role || 'Senior Software Engineer',
                      isPermission: isPerm,
                      leaveType: req.title ? req.title.split('(')[0].trim() : 'Casual Leave',
                      permissionType: req.title ? req.title.split('(')[0].trim() : 'Early Going',
                      totalDays:
                        req.title && req.title.includes('(')
                          ? req.title.split('(')[1].replace(')', '')
                          : isPerm
                          ? '2 Hours'
                          : '1 Day',
                      duration:
                        req.title && req.title.includes('(')
                          ? req.title.split('(')[1].replace(')', '')
                          : isPerm
                          ? '2 Hours'
                          : '1 Day',
                      fromDate: req.subtitle ? req.subtitle.split('•')[0].trim() : 'Sep 07, 2026',
                      toDate: req.subtitle ? req.subtitle.split('•')[0].trim() : 'Sep 07, 2026',
                      date: req.subtitle ? req.subtitle.split('•')[0].trim() : 'Sep 07, 2026',
                      reason:
                        req.subtitle && req.subtitle.includes('•')
                          ? req.subtitle.split('•')[1].trim()
                          : 'Personal work',
                      approvingManager:
                        (typeof global !== 'undefined' &&
                          global.USER_PROFILE?.reportingManager) ||
                        'Rahul Sharma (Team Lead)',
                      emergencyContact:
                        (typeof global !== 'undefined' && global.USER_PROFILE?.phone) ||
                        '+91 98765 43210',
                      status: req.status,
                    },
                  });
                }}
              >
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.requestSubtitle}>{req.subtitle}</Text>
              </TouchableOpacity>
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
