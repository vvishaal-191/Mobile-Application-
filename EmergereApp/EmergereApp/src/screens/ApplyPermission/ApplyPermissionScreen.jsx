import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyPermissionScreen.styles';

const PERMISSION_TYPES = [
  'Early Going',
  'Late Coming',
  'Personal Work',
  'Official Work',
];

const MANAGERS = [
  'Vishnu (Reporting Manager)',
  'Ram (Reporting Manager)',
  'Rahul (Reporting Manager)',
];

/** Derive initials from a full name string */
function getInitials(name) {
  if (!name) return 'PS';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

/** Read the reporting manager from global profile and match to a MANAGERS entry */
function resolveDefaultManager() {
  const profile =
    (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  const managerName = profile.reportingManager || 'Vishnu (Reporting Manager)';
  const match = MANAGERS.find((m) =>
    m.toLowerCase() === managerName.toLowerCase() ||
    managerName.toLowerCase().startsWith(m.toLowerCase()) ||
    m.toLowerCase().startsWith(managerName.toLowerCase())
  );
  return match || MANAGERS[0];
}

export default function ApplyPermissionScreen({ navigation }) {
  const [date, setDate] = useState('04-Sep-2026');
  const [permissionType, setPermissionType] = useState('Early Going');
  const [startTime, setStartTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [durationText, setDurationText] = useState('2 Hours');
  const [reason, setReason] = useState('');
  const [manager, setManager] = useState(resolveDefaultManager);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm) {
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const calculateDurationText = (startStr, endStr) => {
    const startMin = parseTimeToMinutes(startStr);
    const endMin = parseTimeToMinutes(endStr);
    if (startMin === null || endMin === null) return '2 Hours (Auto-calculated)';

    let diff = endMin - startMin;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let result = '';
    if (hours > 0 && mins > 0) result = `${hours} Hr ${mins} Mins`;
    else if (hours > 0) result = `${hours} Hour${hours > 1 ? 's' : ''}`;
    else result = `${mins} Mins`;

    return `${result} (Auto-calculated)`;
  };

  const handleStartTimeChange = (text) => {
    setStartTime(text);
    setDurationText(calculateDurationText(text, endTime));
  };

  const handleEndTimeChange = (text) => {
    setEndTime(text);
    setDurationText(calculateDurationText(startTime, text));
  };

  const handleSubmit = () => {
    const profile =
      (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    const employeeName = profile.name || 'Sneha Reddy';
    const employeeInitials = profile.initials || getInitials(employeeName) || 'SR';
    const employeeId = profile.employeeId || 'EMP-2024-0103';
    const employeeRole = profile.role || 'UI/UX Designer';

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const managerDisplayName = manager.replace(' (Reporting Manager)', '');

    const newRequest = {
      id: Date.now().toString(),
      initials: employeeInitials,
      name: employeeName,
      empId: employeeId,
      role: employeeRole,
      isPermission: true,
      type: permissionType,
      leaveType: permissionType,
      permissionType: permissionType,
      tag: permissionType,
      tagTone: 'purple',
      date: date,
      fromDate: date,
      toDate: date,
      startTime,
      endTime,
      schedule: `${date} (${startTime} - ${endTime})`,
      duration: durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours',
      totalDays: durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours',
      reason: reason || 'Personal work / Medical checkup',
      status: 'pending',
      appliedDate: todayStr,
      approverName: managerDisplayName,
      approvingManager: manager,
      approverComments: '',
      supportingDocs: 'None Attached',
      remark: `Sent to ${managerDisplayName} for review.`,
      typeTone: 'purple',
      emergencyContact: manager,
      contact: manager,
      subtitle: `${permissionType} Application`,
      appliedPath: `${employeeName.split(' ')[0]} (Applied)`,
      // for Employee Dashboard recent list
      title: `${permissionType} (${durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours'})`,
      subtitleReq: `${date} • ${reason || 'Personal Work'}`,
    };

    // Push to shared global store so Manager Dashboard and Request Detail can pick it up
    if (typeof global !== 'undefined') {
      if (!global.PERMISSION_REQUESTS) global.PERMISSION_REQUESTS = [];
      global.PERMISSION_REQUESTS.unshift(newRequest);
      global.LATEST_REQUEST = newRequest;
      global.LATEST_PERMISSION_REQUEST = newRequest;
    }

    // Show success confirmation popup
    setSubmittedRequest(newRequest);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Apply Permission</Text>
        </View>
        <Text style={styles.subtitle}>Request short duration permission</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Date *</Text>
          <View style={styles.dateInputRow}>
            <TextInput
              style={styles.flexInput}
              value={date}
              onChangeText={setDate}
              placeholder="DD-MMM-YYYY"
              placeholderTextColor="#9AA3B2"
            />
            <Feather name="calendar" size={18} color="#111827" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Permission Type *</Text>
          <TouchableOpacity
            style={[styles.selectBox, isTypeOpen && styles.selectBoxActive]}
            onPress={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsManagerOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{permissionType}</Text>
            <Feather name={isTypeOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
          </TouchableOpacity>
          {isTypeOpen && (
            <View style={styles.dropdownContainer}>
              {PERMISSION_TYPES.map((t) => {
                const isSelected = t === permissionType;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                    onPress={() => {
                      setPermissionType(t);
                      setIsTypeOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Start Time *</Text>
            <View style={styles.dateInputRow}>
              <TextInput
                style={styles.flexInput}
                value={startTime}
                onChangeText={handleStartTimeChange}
                placeholder="03:00 PM"
                placeholderTextColor="#9AA3B2"
              />
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>End Time *</Text>
            <View style={styles.dateInputRow}>
              <TextInput
                style={styles.flexInput}
                value={endTime}
                onChangeText={handleEndTimeChange}
                placeholder="05:00 PM"
                placeholderTextColor="#9AA3B2"
              />
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Duration *</Text>
          <View style={styles.dateInputRow}>
            <TextInput
              style={styles.flexInput}
              value={durationText}
              onChangeText={setDurationText}
              placeholder="E.g., 2 Hours"
              placeholderTextColor="#9AA3B2"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="E.g., Medical checkup, personal work..."
            placeholderTextColor="#9AA3B2"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Approving Manager</Text>
          <TouchableOpacity
            style={[styles.selectBox, isManagerOpen && styles.selectBoxActive]}
            onPress={() => {
              setIsManagerOpen(!isManagerOpen);
              setIsTypeOpen(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>{manager}</Text>
            <Feather name={isManagerOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
          </TouchableOpacity>
          {isManagerOpen && (
            <View style={styles.dropdownContainer}>
              {MANAGERS.map((m) => {
                const isSelected = m === manager;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                    onPress={() => {
                      setManager(m);
                      setIsManagerOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Popup Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <View style={modalStyles.iconWrap}>
              <Feather name="check" size={32} color="#1FAE6E" />
            </View>
            <Text style={modalStyles.title}>Request Submitted!</Text>
            <Text style={modalStyles.message}>Your permission request has been submitted successfully.</Text>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={() => {
                setShowSuccessModal(false);
                if (navigation) {
                  navigation.navigate('History');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.buttonText}>View My Requests →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavBar active="Apply" onNavigate={(scr) => navigation && navigation.navigate(scr)} />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 6,
    borderColor: '#F0FDF4',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2F6BFF',
    borderRadius: 12,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
