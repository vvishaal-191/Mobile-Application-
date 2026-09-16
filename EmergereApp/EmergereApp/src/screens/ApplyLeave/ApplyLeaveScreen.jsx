// src/screens/ApplyLeave/ApplyLeaveScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyLeaveScreen.styles';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Privilege Leave'];

const MANAGERS = [
  'Rahul Sharma (Team Lead)',
  'Priya Verma (HR Manager)',
  'Suresh Kumar (Engineering Manager)',
];

/** Derive initials from a full name string */
function getInitials(name) {
  if (!name) return 'PS';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

/** Read the reporting manager name from global profile and match it to a MANAGERS entry.
 *  Returns the matching manager string, or the first manager if none found. */
function resolveDefaultManager() {
  const profile =
    (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  const managerName = profile.reportingManager || 'Rahul Sharma';
  // Try to find a matching entry (partial match on name before parenthesis)
  const match = MANAGERS.find((m) =>
    m.toLowerCase().startsWith(managerName.toLowerCase())
  );
  return match || MANAGERS[0];
}

export default function ApplyLeaveScreen({ navigation }) {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('07-Sep-2026');
  const [toDate, setToDate] = useState('07-Sep-2026');
  const [reason, setReason] = useState('');
  const [daysCount, setDaysCount] = useState('1.0 Day (Auto-calculated)');
  const [approvingManager, setApprovingManager] = useState(resolveDefaultManager);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  const toggleFromDate = () => {
    setFromDate(fromDate === '07-Sep-2026' ? '10-Sep-2026' : '07-Sep-2026');
  };

  const toggleToDate = () => {
    if (toDate === '07-Sep-2026') {
      setToDate('12-Sep-2026');
      setDaysCount('6.0 Days (Auto-calculated)');
    } else {
      setToDate('07-Sep-2026');
      setDaysCount('1.0 Day (Auto-calculated)');
    }
  };

  const handleSubmit = () => {
    const profile =
      (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    const employeeName = profile.name || 'Priya Sharma';
    const employeeInitials = profile.initials || getInitials(employeeName);
    const employeeId = profile.employeeId || 'EMP-2024-0156';
    const employeeRole = profile.role || 'Senior Software Engineer';

    const newRequest = {
      id: Date.now().toString(),
      initials: employeeInitials,
      name: employeeName,
      empId: employeeId,
      role: employeeRole,
      type: leaveType,
      leaveType: leaveType,
      isPermission: false,
      duration: `${daysCount.replace(' (Auto-calculated)', '')} (${fromDate} - ${toDate})`,
      fromDate,
      toDate,
      totalDays: daysCount.replace(' (Auto-calculated)', ''),
      emergencyContact: profile.phone || '+91 98765 43210',
      reason: reason || 'Personal work',
      status: 'pending',
      typeTone: 'info',
      // used in Employee Dashboard list
      title: `${leaveType} (${daysCount.replace(' (Auto-calculated)', '')})`,
      subtitle: `${fromDate} • ${reason || 'Personal Work'}`,
      approvingManager,
      subtitleApp: `${leaveType} Application`,
      appliedName: `${employeeName.split(' ')[0]} (Applied)`,
    };

    // Push to shared global store so Manager Dashboard and Request Detail can pick it up
    if (typeof global !== 'undefined') {
      if (!global.LEAVE_REQUESTS) global.LEAVE_REQUESTS = [];
      global.LEAVE_REQUESTS.unshift(newRequest);
      global.LATEST_REQUEST = newRequest;
      global.LATEST_LEAVE_REQUEST = newRequest;
    }

    // Navigate directly to Leave Approvals (Manager Approval page) upon submission
    go('LeaveApprovals', { newLeaveRequest: newRequest });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Apply Leave</Text>
        </View>
        <Text style={styles.subtitle}>Create new leave request</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Leave Type *</Text>
          <TouchableOpacity
            style={[styles.selectBox, isLeaveTypeOpen && styles.selectBoxActive]}
            onPress={() => {
              setIsLeaveTypeOpen(!isLeaveTypeOpen);
              setIsManagerOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{leaveType}</Text>
            <Feather
              name={isLeaveTypeOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#111827"
            />
          </TouchableOpacity>
          {isLeaveTypeOpen && (
            <View style={styles.dropdownContainer}>
              {LEAVE_TYPES.map((lt) => {
                const isSelected = lt === leaveType;
                return (
                  <TouchableOpacity
                    key={lt}
                    style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                    onPress={() => {
                      setLeaveType(lt);
                      setIsLeaveTypeOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {lt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>From Date *</Text>
            <TouchableOpacity style={styles.inputBoxWithIcon} onPress={toggleFromDate}>
              <Text style={styles.inputText}>{fromDate}</Text>
              <View style={styles.calIconBadge}>
                <Feather name="calendar" size={16} color="#2F6BFF" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>To Date *</Text>
            <TouchableOpacity style={styles.inputBoxWithIcon} onPress={toggleToDate}>
              <Text style={styles.inputText}>{toDate}</Text>
              <View style={styles.calIconBadge}>
                <Feather name="calendar" size={16} color="#2F6BFF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Number of Days</Text>
          <View style={styles.autoBox}>
            <Text style={styles.autoText}>{daysCount}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Approving Manager</Text>
          <TouchableOpacity
            style={[styles.selectBox, isManagerOpen && styles.selectBoxActive]}
            onPress={() => {
              setIsManagerOpen(!isManagerOpen);
              setIsLeaveTypeOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{approvingManager}</Text>
            <Feather
              name={isManagerOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#111827"
            />
          </TouchableOpacity>
          {isManagerOpen && (
            <View style={styles.dropdownContainer}>
              {MANAGERS.map((mgr) => {
                const isSelected = mgr === approvingManager;
                return (
                  <TouchableOpacity
                    key={mgr}
                    style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                    onPress={() => {
                      setApprovingManager(mgr);
                      setIsManagerOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {mgr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Describe the reason for your leave..."
            placeholderTextColor="#9AA3B2"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar active="Apply" onNavigate={(scr) => go(scr)} />
    </View>
  );
}
