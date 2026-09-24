// src/components/BottomNavBar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';

// Bottom tab bar matching the 5-tab layout from Image 2:
// Dashboard | Attendance | Apply (Elevated center) | History | Profile
const TABS = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'Attendance', label: 'Attendance', icon: 'calendar' },
  { key: 'Apply', label: 'Apply', icon: 'plus', isElevated: true },
  { key: 'History', label: 'History', icon: 'clock' },
  { key: 'Profile', label: 'Profile', icon: 'user' },
];

export default function BottomNavBar({ active, onNavigate }) {
  const handlePress = (tabKey) => {
    if (!onNavigate) return;
    const isManager = typeof global !== 'undefined' && global.USER_ROLE === 'manager';
    if (tabKey === 'Dashboard') {
      onNavigate(isManager ? 'ManagerDashboard' : 'EmployeeDashboard');
    } else if (tabKey === 'Attendance') {
      onNavigate(isManager ? 'TeamAttendance' : 'MyAttendance');
    } else if (tabKey === 'Apply') {
      onNavigate('ApplyLeave');
    } else if (tabKey === 'History') {
      if (isManager) {
        alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
        return;
      }
      onNavigate('LeaveHistory');
    } else if (tabKey === 'Profile') {
      onNavigate('MyProfile');
    } else {
      onNavigate(tabKey);
    }
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key || (tab.key === 'Profile' && (active === 'Profile' || active === 'More'));

        if (tab.isElevated) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.elevatedTab}
              activeOpacity={0.8}
              onPress={() => handlePress(tab.key)}
            >
              <View style={styles.elevatedCircle}>
                <Feather name="plus" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.elevatedLabel, isActive && { color: '#2563EB' }]}>{tab.label}</Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => handlePress(tab.key)}
          >
            {isActive ? (
              <View style={styles.activePillWrap}>
                <Feather name={tab.icon} size={20} color="#2563EB" />
              </View>
            ) : (
              <Feather
                name={tab.icon}
                size={22}
                color="#64748B"
              />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEFF5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePillWrap: {
    backgroundColor: '#EEF4FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  labelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginTop: 2,
  },
  elevatedTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  elevatedCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2F6BFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  elevatedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 3,
  },
});
