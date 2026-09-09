// src/screens/ApplyLeave/ApplyLeaveScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyLeaveScreen.styles';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Privilege Leave'];

export default function ApplyLeaveScreen({ navigation }) {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('07-Sep-2026');
  const [toDate, setToDate] = useState('07-Sep-2026');
  const [reason, setReason] = useState('');
  const [daysCount, setDaysCount] = useState('1.0 Day (Auto-calculated)');

  const go = (screen) => navigation && navigation.navigate(screen);

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
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>{leaveType}</Text>
            <Feather name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
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

        <TouchableOpacity style={styles.submitBtn} onPress={() => go('LeaveHistory')}>
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar active="Apply" onNavigate={go} />
    </View>
  );
}
