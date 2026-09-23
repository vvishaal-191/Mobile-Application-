// src/screens/ApplyLeave/ApplyLeaveScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyLeaveScreen.styles';

const LEAVE_TYPES = [
  { label: 'Casual Leave', sub: 'For personal reasons' },
  { label: 'Sick Leave', sub: 'Medical & health care' },
  { label: 'WFH (Work From Home)', sub: 'Work from home' },
  { label: 'Comp-Off (Compensatory Off)', sub: 'Compensatory day off' },
];

const HALF_DAY_TYPES = ['First Half', 'Second Half'];

const MANAGERS = [
  'Vishnu (Reporting Manager)',
  'Ram (Reporting Manager)',
  'Rahul (Reporting Manager)',
];

function getInitials(name) {
  if (!name) return 'PS';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function resolveDefaultManager() {
  const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  const managerName = profile.reportingManager || 'Vishnu (Reporting Manager)';
  const match = MANAGERS.find((m) =>
    m.toLowerCase() === managerName.toLowerCase() ||
    managerName.toLowerCase().startsWith(m.toLowerCase()) ||
    m.toLowerCase().startsWith(managerName.toLowerCase())
  );
  return match || MANAGERS[0];
}

export default function ApplyLeaveScreen({ navigation }) {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveTypeSub, setLeaveTypeSub] = useState('For personal reasons');
  const [fromDate, setFromDate] = useState('07-Sep-2026');
  const [toDate, setToDate] = useState('07-Sep-2026');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState('First Half');
  const [isHalfDayTypeOpen, setIsHalfDayTypeOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [daysCount, setDaysCount] = useState('1.0 Day (Auto-calculated)');
  const [approvingManager, setApprovingManager] = useState(resolveDefaultManager);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  const toggleFromDate = () => {
    const nextDate = fromDate === '07-Sep-2026' ? '10-Sep-2026' : '07-Sep-2026';
    setFromDate(nextDate);
  };

  const toggleToDate = () => {
    if (toDate === '07-Sep-2026') {
      setToDate('12-Sep-2026');
      if (!isHalfDay) setDaysCount('6.0 Days (Auto-calculated)');
    } else {
      setToDate('07-Sep-2026');
      if (!isHalfDay) setDaysCount('1.0 Day (Auto-calculated)');
    }
  };

  const toggleHalfDay = () => {
    const nextHalf = !isHalfDay;
    setIsHalfDay(nextHalf);
    if (nextHalf) {
      setDaysCount('0.5 Day (Half Day)');
      setLeaveTypeSub(`For personal reasons • ${halfDayType}`);
    } else {
      setDaysCount('1.0 Day (Auto-calculated)');
      const match = LEAVE_TYPES.find((lt) => lt.label === leaveType);
      setLeaveTypeSub(match ? match.sub : 'General leave');
    }
  };

  const selectHalfDayType = (type) => {
    setHalfDayType(type);
    setIsHalfDayTypeOpen(false);
    setLeaveTypeSub(`For personal reasons • ${type}`);
  };

  const handleSubmit = () => {
    const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    const employeeName = profile.name || 'Sneha Reddy';
    const employeeInitials = profile.initials || getInitials(employeeName) || 'SR';
    const employeeId = profile.employeeId || 'EMP-2024-0103';
    const employeeRole = profile.role || 'UI/UX Designer';

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const managerDisplayName = approvingManager.replace(' (Reporting Manager)', '');

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
      appliedDate: todayStr,
      approverName: managerDisplayName,
      approvingManager,
      approverComments: '',
      supportingDocs: 'None Attached',
      remark: `Sent to ${managerDisplayName} for review.`,
      typeTone: 'info',
      title: `${leaveType} (${daysCount.replace(' (Auto-calculated)', '')})`,
      subtitle: `${fromDate} • ${reason || 'Personal Work'}`,
      subtitleApp: `${leaveType} Application`,
      appliedName: `${employeeName.split(' ')[0]} (Applied)`,
    };

    if (typeof global !== 'undefined') {
      if (!global.LEAVE_REQUESTS) global.LEAVE_REQUESTS = [];
      global.LEAVE_REQUESTS.unshift(newRequest);
      global.LATEST_REQUEST = newRequest;
      global.LATEST_LEAVE_REQUEST = newRequest;
    }

    setSubmittedRequest(newRequest);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {/* Header Gradient Banner - Flush to top with no gap */}
        <View style={styles.headerBanner}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => go('Dashboard')}
            activeOpacity={0.8}
            accessibilityLabel="Back to Dashboard"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Apply Leave</Text>
              <Text style={styles.headerSubtitle}>Create new leave request</Text>
            </View>

            {/* 3D Calendar Illustration Badge */}
            <View style={styles.badgeContainer}>
              <View style={styles.calendarIllustrateBox}>
                <View style={styles.calendarHeaderBar} />
                <View style={styles.calendarRingsRow}>
                  <View style={styles.calendarRing} />
                  <View style={styles.calendarRing} />
                  <View style={styles.calendarRing} />
                </View>
                <View style={styles.calendarGrid}>
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={[styles.calendarCell, styles.calendarCellPrimary]} />
                </View>
                <View style={styles.clockBadge}>
                  <Feather name="clock" size={14} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>Plan your time</Text>
                <Text style={styles.quoteText}>for a better tomorrow</Text>
                <View style={styles.quoteLine} />
              </View>
            </View>
          </View>
        </View>

        {/* Main Form Card */}
        <View style={styles.formCard}>
          {/* Leave Type (Casual Leave icon removed per user request) */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Leave Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectCard, isLeaveTypeOpen && styles.selectCardActive]}
              onPress={() => {
                setIsLeaveTypeOpen(!isLeaveTypeOpen);
                setIsManagerOpen(false);
                setIsHalfDayTypeOpen(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.selectContent}>
                <Text style={styles.selectTitle}>{leaveType}</Text>
                <Text style={styles.selectSub}>{leaveTypeSub}</Text>
              </View>
              <Feather
                name={isLeaveTypeOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#1E293B"
              />
            </TouchableOpacity>

            {isLeaveTypeOpen && (
              <View style={styles.dropdownContainer}>
                {LEAVE_TYPES.map((lt) => {
                  const isSelected = lt.label === leaveType;
                  return (
                    <TouchableOpacity
                      key={lt.label}
                      style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                      onPress={() => {
                        setLeaveType(lt.label);
                        setLeaveTypeSub(isHalfDay ? `${lt.sub} • ${halfDayType}` : lt.sub);
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
                        {lt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* From Date & To Date */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>
                From Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity style={styles.dateCard} onPress={toggleFromDate} activeOpacity={0.7}>
                <Feather name="calendar" size={16} color="#2563EB" />
                <Text style={styles.dateText}>{fromDate}</Text>
                <Feather name="chevron-down" size={14} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>
                To Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity style={styles.dateCard} onPress={toggleToDate} activeOpacity={0.7}>
                <Feather name="calendar" size={16} color="#2563EB" />
                <Text style={styles.dateText}>{toDate}</Text>
                <Feather name="chevron-down" size={14} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Half Day Row */}
          <View style={styles.field}>
            <View style={styles.halfDayBox}>
              <View style={styles.halfDayMain}>
                <View style={styles.iconBadgeCircleBlue}>
                  <Feather name="clock" size={16} color="#2563EB" />
                </View>
                <TouchableOpacity
                  style={styles.checkboxBtn}
                  onPress={toggleHalfDay}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, isHalfDay && styles.checkboxChecked]}>
                    {isHalfDay && <Feather name="check" size={13} color="#FFFFFF" />}
                  </View>
                  <View style={styles.halfDayTextCol}>
                    <Text style={styles.halfDayTitle}>Half Day</Text>
                    <Text style={styles.halfDaySub}>Select if you are applying for half day</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Sub Leave Type card inside Half Day when active: displays selected option */}
              {isHalfDay && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.label, { marginBottom: 6 }]}>
                    Leave Type <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.selectCard, { height: 48 }, isHalfDayTypeOpen && styles.selectCardActive]}
                    onPress={() => {
                      setIsHalfDayTypeOpen(!isHalfDayTypeOpen);
                      setIsLeaveTypeOpen(false);
                      setIsManagerOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.selectContent}>
                      <Text style={styles.selectTitle}>{halfDayType}</Text>
                      <Text style={styles.selectSub}>
                        {halfDayType === 'First Half' ? 'Morning session (0.5 Day)' : 'Afternoon session (0.5 Day)'}
                      </Text>
                    </View>
                    <Feather
                      name={isHalfDayTypeOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#1E293B"
                    />
                  </TouchableOpacity>

                  {isHalfDayTypeOpen && (
                    <View style={styles.dropdownContainer}>
                      {HALF_DAY_TYPES.map((type) => {
                        const isSelected = type === halfDayType;
                        return (
                          <TouchableOpacity
                            key={type}
                            style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                            onPress={() => selectHalfDayType(type)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                isSelected && styles.dropdownOptionTextSelected,
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Number of Days */}
          <View style={styles.field}>
            <Text style={styles.label}>Number of Days</Text>
            <View style={styles.daysCard}>
              <View style={styles.daysIconBadge}>
                <Feather name="calendar" size={18} color="#2563EB" />
              </View>
              <View style={styles.daysContent}>
                <Text style={styles.daysText}>{daysCount}</Text>
                <Text style={styles.daysSub}>Based on the selected dates</Text>
              </View>
            </View>
          </View>

          {/* Approving Manager */}
          <View style={styles.field}>
            <Text style={styles.label}>Approving Manager</Text>
            <TouchableOpacity
              style={[styles.selectCard, isManagerOpen && styles.selectCardActive]}
              onPress={() => {
                setIsManagerOpen(!isManagerOpen);
                setIsLeaveTypeOpen(false);
                setIsHalfDayTypeOpen(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconBadgeCircleBlue}>
                <Feather name="user" size={16} color="#2563EB" />
              </View>
              <View style={styles.selectContent}>
                <Text style={styles.selectTitle}>{approvingManager}</Text>
              </View>
              <Feather
                name={isManagerOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#1E293B"
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

          {/* Reason */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Reason <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.textareaCard}>
              <View style={styles.textareaTop}>
                <View style={styles.iconBadgeSmBlue}>
                  <Feather name="file-text" size={15} color="#2563EB" />
                </View>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                  placeholder="Describe the reason for your leave..."
                  placeholderTextColor="#94A3B8"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
              <Text style={styles.charCounter}>{reason.length}/500</Text>
            </View>
          </View>

          {/* Validation Info Helper Pill */}
          <View style={styles.infoBanner}>
            <Feather name="info" size={16} color="#2563EB" />
            <Text style={styles.infoText}>
              Please provide a valid reason for your leave request.
            </Text>
          </View>

          {/* Submit Request Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Feather name="send" size={18} color="#FFFFFF" />
            <Text style={styles.submitText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
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
            <Text style={modalStyles.message}>Your leave request has been submitted successfully.</Text>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={() => {
                setShowSuccessModal(false);
                go('History');
              }}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.buttonText}>View My Requests →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavBar active="Apply" onNavigate={(scr) => go(scr)} />
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
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2563EB',
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
