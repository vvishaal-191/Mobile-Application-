// src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './EmployeeDashboardScreen.styles';

const LEAVE_BALANCES = [
  { label: 'Casual Leave', sublabel: 'For personal time', used: 8, total: 12, icon: 'briefcase', iconColor: '#2563EB', iconBg: '#EBF3FF' },
  { label: 'Sick Leave', sublabel: 'For your well-being', used: 5, total: 7, icon: 'heart', iconColor: '#EF4444', iconBg: '#FEE2E2' },
  { label: 'WFH', sublabel: 'Work from home', used: 10, total: 15, icon: 'home', iconColor: '#10B981', iconBg: '#DCFCE7' },
];

const ACTION_CARDS = [
  {
    key: 'applyLeave',
    title: 'Apply Leave',
    subtitle: 'Plan your time off',
    icon: 'calendar',
    iconColor: '#FFFFFF',
    iconBg: '#1C6AFD',
    chevronBg: '#EDF3FF',
    chevronColor: '#1D4ED8',
    screen: 'ApplyLeave',
  },
  {
    key: 'applyPermission',
    title: 'Apply Permission',
    subtitle: 'Request short leave',
    icon: 'file-text',
    iconColor: '#FFFFFF',
    iconBg: '#097717',
    chevronBg: '#EDF3FF',
    chevronColor: '#1D4ED8',
    screen: 'ApplyPermission',
  },
  {
    key: 'myRequests',
    title: 'My Requests',
    subtitle: 'Track your leaves & permissions',
    icon: 'layers',
    iconColor: '#FFFFFF',
    iconBg: '#8B5CF6',
    chevronBg: '#ECE6FE',
    chevronColor: '#7C3AED',
    screen: 'LeaveHistory',
  },
  {
    key: 'holidayCalendar',
    title: 'Holiday Calendar',
    subtitle: 'View upcoming holidays',
    icon: 'calendar',
    iconColor: '#FFFFFF',
    iconBg: '#FA6400',
    chevronBg: '#FEEBD7',
    chevronColor: '#C2410C',
    screen: 'HolidayCalendar',
  },
];

// Default initial requests - Empty by default (Requirement 5: Only displayed when approved/rejected by manager)
const INITIAL_REQUESTS = [];

export default function EmployeeDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [userProfile, setUserProfile] = useState(
    (typeof global !== 'undefined' && global.USER_PROFILE) || {
      name: 'Sneha Reddy',
      role: 'UI/UX Designer',
      employeeId: 'EMP-2024-0103',
      email: 'sneha@gmail.com',
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
      glowAnim.setValue(0);
    }
  }, [hasNewNotification]);

  // Synchronize state with route params
  useEffect(() => {
    if (route?.params?.employmentStatus && typeof global !== 'undefined') {
      global.EMPLOYMENT_STATUS = route.params.employmentStatus;
    }
    if (route?.params?.roleProfile && typeof global !== 'undefined') {
      global.USER_PROFILE = {
        name: route.params.roleProfile.name || (global.USER_PROFILE && global.USER_PROFILE.name) || 'Sneha Reddy',
        role: route.params.roleProfile.role || (global.USER_PROFILE && global.USER_PROFILE.role) || 'UI/UX Designer',
        employeeId: route.params.roleProfile.employeeId || (global.USER_PROFILE && global.USER_PROFILE.employeeId) || 'EMP-2024-0103',
        email: route.params.roleProfile.email || (global.USER_PROFILE && global.USER_PROFILE.email) || 'sneha@gmail.com',
      };
      setUserProfile(global.USER_PROFILE);
    }
    if (typeof global !== 'undefined' && global.USER_PROFILE) {
      setUserProfile(global.USER_PROFILE);
    }
    if (typeof global !== 'undefined' && global.NOTIFICATIONS) {
      setHasNewNotification(global.NOTIFICATIONS.some((n) => n.unread));
    }
    if (route?.params) {
      if (route.params.newNotification) {
        setHasNewNotification(true);
      }
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
              empMeta: `${userProfile.name || 'Sneha Reddy'} • ${userProfile.employeeId || 'EMP-2024-0103'}`,
              status: 'Pending',
              tone: 'warning',
            },
            ...prev,
          ];
        });
      }
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
              empMeta: `${userProfile.name || 'Sneha Reddy'} • ${userProfile.employeeId || 'EMP-2024-0103'}`,
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
        {/* Header matching Image 2, aligned upward */}
        <View style={styles.dashHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setSidebarVisible(true)}
                accessibilityLabel="Open Menu"
              >
                <Feather name="menu" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerDashboardTitleWrap}>
                <Text style={styles.headerDashboardTitle}>Dashboard</Text>
              </View>
            </View>

            <View style={styles.bellWrapper}>
              <Animated.View
                style={[
                  styles.bellGlowRing,
                  {
                    opacity: hasNewNotification ? glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6],
                    }) : 0,
                  },
                ]}
              />
              <TouchableOpacity
                style={styles.bellButton}
                onPress={() => {
                  setHasNewNotification(false);
                  if (typeof global !== 'undefined' && global.NOTIFICATIONS) {
                    global.NOTIFICATIONS = global.NOTIFICATIONS.map((n) => ({ ...n, unread: false }));
                  }
                  go('Notifications');
                }}
              >
                <Feather name="bell" size={18} color="#FFFFFF" />
                <View style={styles.bellDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile & Greeting Row (No duplicate Hello) */}
          <View style={styles.headerProfileRow}>
            <View style={styles.profileGreetingCol}>
              <Text style={styles.greetingHello}>Hello,</Text>
              <Text style={styles.greetingName}>
                {userProfile.name ? userProfile.name.replace(/\s*👋\s*$/, '') : 'Sneha Reddy'}
              </Text>
              <Text style={styles.roleMeta}>
                {userProfile.role || 'UI/UX Designer'} • {userProfile.employeeId || 'EMP-2024-0103'}
              </Text>
              <View style={styles.dateRow}>
                <Feather name="calendar" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.dateText}>Thu, Sep 03 2026</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.avatarBlock}
              activeOpacity={0.8}
              onPress={() => go('MyProfile')}
            >
              <View style={styles.avatarCircle}>
                <Feather name="user" size={38} color="#3B82F6" />
              </View>
              <Text style={styles.avatarCaption}>Have a great day!</Text>
              <View style={styles.avatarUnderline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 4 Action Cards (2x2 Grid) */}
        <View style={styles.actionGrid}>
          {ACTION_CARDS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => go(item.screen)}
            >
              <View style={styles.actionTopRow}>
                <View style={[styles.actionIconBox, { backgroundColor: item.iconBg }]}>
                  <Feather name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={[styles.actionChevron, { backgroundColor: item.chevronBg }]}>
                  <Feather name="chevron-right" size={13} color={item.chevronColor} />
                </View>
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leave Balances Card */}
        <View style={styles.balancesCard}>
          <View style={styles.balancesHeader}>
            <Feather name="pie-chart" size={20} color="#2563EB" />
            <Text style={styles.balancesTitle}>Leave Balances</Text>
          </View>
          {LEAVE_BALANCES.map((item) => (
            <View key={item.label} style={styles.balanceRow}>
              <View style={[styles.balanceIcon, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View style={styles.balanceCol}>
                <View style={styles.balanceTopLine}>
                  <Text style={styles.balanceLabel}>{item.label}</Text>
                  <Text style={styles.balanceValue}>
                    {item.used} / {item.total} Days
                  </Text>
                </View>
                <Text style={styles.balanceSubLabel}>{item.sublabel}</Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(item.used / item.total) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Requests Section matching Image 4 (Displayed ONLY when manager approves or rejects request) */}
        {(() => {
          const approvedOrRejected = requests.filter((r) => {
            const st = (r.status || '').toLowerCase();
            return st === 'approved' || st === 'rejected';
          });
          if (approvedOrRejected.length === 0) return null;
          return (
            <View style={styles.recentRequestsSection}>
              <Text style={styles.sectionLabel}>RECENT REQUESTS ({approvedOrRejected.length})</Text>
              {approvedOrRejected.map((req) => (
                <TouchableOpacity
                  key={req.id}
                  style={styles.recentRequestCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    const isPerm =
                      req.title &&
                      (req.title.includes('Going') ||
                        req.title.includes('Coming') ||
                        req.title.includes('Permission'));
                    navigation.navigate('LeaveApprovalDetail', {
                      person: {
                        id: req.id,
                        name: userProfile.name || 'Sneha Reddy',
                        initials: userProfile.initials || 'SR',
                        empId: userProfile.employeeId || 'EMP-2024-0103',
                        role: userProfile.role || 'UI/UX Designer',
                        isPermission: isPerm,
                        leaveType: req.title ? req.title.split('(')[0].trim() : 'Casual Leave',
                        permissionType: req.title ? req.title.split('(')[0].trim() : 'Early Going',
                        totalDays: req.title && req.title.includes('(') ? req.title.split('(')[1].replace(')', '') : '1.0 Day',
                        duration: req.title && req.title.includes('(') ? req.title.split('(')[1].replace(')', '') : '1.0 Day',
                        fromDate: req.subtitle ? req.subtitle.split('•')[0].trim() : '07-Sep-2026',
                        toDate: req.subtitle ? req.subtitle.split('•')[0].trim() : '07-Sep-2026',
                        approvingManager: 'Rahul Sharma',
                        reason: req.subtitle && req.subtitle.includes('•') ? req.subtitle.split('•')[1].trim() : 'Personal Work',
                        status: req.status ? req.status.toLowerCase() : 'approved',
                      },
                    });
                  }}
                >
                  <View style={styles.recentRequestLeft}>
                    <Text style={styles.recentRequestTitle}>{req.title || 'Casual Leave (1.0 Day)'}</Text>
                    <Text style={styles.recentRequestSub}>{req.subtitle || '07-Sep-2026 • Personal Work'}</Text>
                    <Text style={styles.recentRequestMeta}>{req.empMeta || `${userProfile.name || 'Sneha Reddy'} • ${userProfile.employeeId || 'EMP-2024-0103'}`}</Text>
                  </View>
                  <View style={styles.recentRequestRight}>
                    <View style={[
                      styles.recentRequestBadge,
                      (req.status || '').toLowerCase() === 'approved' ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FCE4E4' }
                    ]}>
                      <Text style={[
                        styles.recentRequestBadgeText,
                        (req.status || '').toLowerCase() === 'approved' ? { color: '#16A34A' } : { color: '#E5484D' }
                      ]}>
                        {req.status || 'Approved'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.recentRequestDismissBtn}
                      onPress={() => handleDeleteRequest(req.id)}
                      accessibilityLabel="Dismiss Request"
                    >
                      <Feather name="x-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })()}
      </ScrollView>

      {/* Sidebar Drawer Modal matching Image 4 */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.sidebarModalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.sidebarDrawer}>
                {/* Header */}
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarBrand}>
                    <Image
                      source={require('../../../assets/tech-circuit-logo.png')}
                      style={styles.sidebarLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.sidebarTitle}>Mobile Application</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.sidebarCloseBtn}
                    onPress={() => setSidebarVisible(false)}
                    accessibilityLabel="Close Menu"
                  >
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View style={styles.sidebarProfileCard}>
                  <View style={styles.sidebarProfileTop}>
                    <View style={styles.sidebarAvatarCircle}>
                      <Text style={styles.sidebarInitials}>
                        {userProfile.initials || 'SR'}
                      </Text>
                    </View>
                    <View style={styles.sidebarProfileInfo}>
                      <Text style={styles.sidebarProfileName}>
                        {userProfile.name ? userProfile.name.replace(/\s*👋\s*$/, '') : 'Sneha Reddy'}
                      </Text>
                      <View style={styles.sidebarRoleBadge}>
                        <Text style={styles.sidebarRoleText}>EMPLOYEE</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.sidebarLogoutBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSidebarVisible(false);
                      navigation && navigation.navigate('Login');
                    }}
                  >
                    <Feather name="log-out" size={16} color="#F87171" />
                    <Text style={styles.sidebarLogoutText}>Log Out</Text>
                  </TouchableOpacity>
                </View>

                {/* Navigation Links Matching Image 4 */}
                <View style={styles.sidebarNav}>
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, styles.sidebarNavItemHighlight]}
                    onPress={() => setSidebarVisible(false)}
                  >
                    <Text style={styles.sidebarNavItemHighlightText}>Employee Dashboard</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('MyAttendance');
                    }}
                  >
                    <Text style={styles.sidebarNavItemActiveText}>My Attendance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('ApplyLeave');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>Apply Leave</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('ApplyPermission');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>Apply Permission</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('LeaveBalance');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>Leave Balance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('LeaveHistory');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>My Requests (History)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('HolidayCalendar');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>Holiday Calendar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('Notifications');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>Notifications</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => {
                      setSidebarVisible(false);
                      go('MyProfile');
                    }}
                  >
                    <Text style={styles.sidebarNavItemText}>My Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BottomNavBar navigation={navigation} active="Dashboard" />
    </View>
  );
}
