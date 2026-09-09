// App.js
// Lightweight custom navigator (no external nav library required) so this
// project runs standalone. Swap this for React Navigation in a real app by
// replacing `navigate`/`goBack` calls with `navigation.navigate` from
// @react-navigation/native - the screens already call navigation that way.
import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/Login';
import EmployeeDashboardScreen from './src/screens/EmployeeDashboard';
import MyAttendanceScreen from './src/screens/MyAttendance';
import ApplyLeaveScreen from './src/screens/ApplyLeave';
import ApplyPermissionScreen from './src/screens/ApplyPermission';
import LeaveBalanceScreen from './src/screens/LeaveBalance';
import LeaveHistoryScreen from './src/screens/LeaveHistory';
import HolidayCalendarScreen from './src/screens/HolidayCalendar';
import NotificationsScreen from './src/screens/Notifications';
import MyProfileScreen from './src/screens/MyProfile';
import ManagerDashboardScreen from './src/screens/ManagerDashboard';
import TeamAttendanceScreen from './src/screens/TeamAttendance';
import LeaveApprovalsScreen from './src/screens/LeaveApprovals';
import LeaveApprovalDetailScreen from './src/screens/LeaveApprovalDetail';
import PermissionApprovalsScreen from './src/screens/PermissionApprovals';

// Maps quick-action / tab keys used inside the screens to the actual
// registered screen name, so screens can call navigation.navigate('applyLeave')
// or navigation.navigate('ApplyLeave') interchangeably.
const SCREENS = {
  Login: LoginScreen,
  Dashboard: EmployeeDashboardScreen,
  EmployeeDashboard: EmployeeDashboardScreen,
  Attendance: MyAttendanceScreen,
  MyAttendance: MyAttendanceScreen,
  viewAttendance: MyAttendanceScreen,
  Apply: ApplyLeaveScreen,
  ApplyLeave: ApplyLeaveScreen,
  applyLeave: ApplyLeaveScreen,
  ApplyPermission: ApplyPermissionScreen,
  applyPermission: ApplyPermissionScreen,
  History: LeaveHistoryScreen,
  LeaveHistory: LeaveHistoryScreen,
  LeaveBalance: LeaveBalanceScreen,
  HolidayCalendar: HolidayCalendarScreen,
  viewHolidays: HolidayCalendarScreen,
  Notifications: NotificationsScreen,
  More: MyProfileScreen,
  MyProfile: MyProfileScreen,
  ManagerDashboard: ManagerDashboardScreen,
  TeamAttendance: TeamAttendanceScreen,
  LeaveApprovals: LeaveApprovalsScreen,
  LeaveApprovalDetail: LeaveApprovalDetailScreen,
  PermissionApprovals: PermissionApprovalsScreen,
};

export default function App() {
  const [stack, setStack] = useState(['Login']);
  const current = stack[stack.length - 1];

  const navigate = useCallback((screenKey) => {
    if (SCREENS[screenKey]) {
      setStack((prev) => [...prev, screenKey]);
    }
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const Screen = SCREENS[current] || LoginScreen;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Screen navigation={{ navigate, goBack }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
});
