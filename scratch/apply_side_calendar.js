const fs = require('fs');

// ==========================================
// 1. UPDATE ApplyPermissionScreen.jsx
// ==========================================
const jsxPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx';
const newJsx = `// src/screens/ApplyPermission/ApplyPermissionScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyPermissionScreen.styles';

const PERMISSION_TYPES = [
  'Early Going',
  'Late Coming',
  'Personal Work',
  'Official Work',
];

const DURATION_OPTIONS = [
  '1 Hour',
  '2 Hours',
  '3 Hours',
  '4 Hours',
  '5 Hours',
];

const MANAGERS = [
  'Vishnu (Reporting Manager)',
  'Ram (Reporting Manager)',
  'Rahul (Reporting Manager)',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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
  const [date, setDate] = useState('09/04/2026');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(8); // September
  const [calendarYear, setCalendarYear] = useState(2026);
  const [permissionType, setPermissionType] = useState('Early Going');
  const [startTime, setStartTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [durationText, setDurationText] = useState('2 Hours');
  const [reason, setReason] = useState('');
  const [manager, setManager] = useState(resolveDefaultManager);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  const handleSelectDate = (day, m = calendarMonth, y = calendarYear) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = y;
    setDate(\`\${mm}/\${dd}/\${yyyy}\`);
    setCalendarMonth(m);
    setCalendarYear(y);
    setIsCalendarOpen(false);
  };

  const handleClearDate = () => {
    setDate('MM/DD/YYYY');
    setIsCalendarOpen(false);
  };

  const handleTodayDate = () => {
    const todayDay = 28;
    const todayMonth = 8;
    const todayYear = 2026;
    const mm = String(todayMonth + 1).padStart(2, '0');
    const dd = String(todayDay).padStart(2, '0');
    setDate(\`\${mm}/\${dd}/\${todayYear}\`);
    setCalendarMonth(todayMonth);
    setCalendarYear(todayYear);
    setIsCalendarOpen(false);
  };

  const parsedDateParts = date && date.includes('/') ? date.split('/') : [];
  const selectedMonth = parsedDateParts.length === 3 ? parseInt(parsedDateParts[0], 10) - 1 : -1;
  const selectedDay = parsedDateParts.length === 3 ? parseInt(parsedDateParts[1], 10) : -1;
  const selectedYear = parsedDateParts.length === 3 ? parseInt(parsedDateParts[2], 10) : -1;

  const todayDay = 28;
  const todayMonth = 8;
  const todayYear = 2026;

  // Generate 42 calendar cells (6 rows x 7 cols) for exact Image 1 design
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  const calendarCells = [];
  // 1. Prev month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarCells.push({ day: d, month: calendarMonth, year: calendarYear, isCurrentMonth: true });
  }
  // 3. Next month leading days (fill up to 42)
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const m = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
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
    if (startMin === null || endMin === null) return '2 Hours';

    let diff = endMin - startMin;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let result = '';
    if (hours > 0 && mins > 0) result = \`\${hours} Hr \${mins} Mins\`;
    else if (hours > 0) result = \`\${hours} Hour\${hours > 1 ? 's' : ''}\`;
    else result = \`\${mins} Mins\`;

    return result;
  };

  const handleStartTimeChange = (text) => {
    setStartTime(text);
    setDurationText(calculateDurationText(text, endTime));
  };

  const handleEndTimeChange = (text) => {
    setEndTime(text);
    setDurationText(calculateDurationText(startTime, text));
  };

  const handleSelectDuration = (val) => {
    setDurationText(val);
    setIsDurationOpen(false);
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

    const cleanDuration = durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours';

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
      schedule: \`\${date} (\${startTime} - \${endTime})\`,
      duration: cleanDuration,
      totalDays: cleanDuration,
      reason: reason || 'Personal work / Medical checkup',
      status: 'pending',
      appliedDate: todayStr,
      approverName: managerDisplayName,
      approvingManager: manager,
      approverComments: '',
      supportingDocs: 'None Attached',
      remark: \`Sent to \${managerDisplayName} for review.\`,
      typeTone: 'purple',
      emergencyContact: manager,
      contact: manager,
      subtitle: \`\${permissionType} Application\`,
      appliedPath: \`\${employeeName.split(' ')[0]} (Applied)\`,
      title: \`\${permissionType} (\${cleanDuration})\`,
      subtitleReq: \`\${date} • \${reason || 'Personal Work'}\`,
    };

    if (typeof global !== 'undefined') {
      if (!global.PERMISSION_REQUESTS) global.PERMISSION_REQUESTS = [];
      global.PERMISSION_REQUESTS.unshift(newRequest);
      global.LATEST_REQUEST = newRequest;
      global.LATEST_PERMISSION_REQUEST = newRequest;
    }

    setSubmittedRequest(newRequest);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {/* Header Gradient Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (navigation && navigation.canGoBack ? navigation.goBack() : go('Dashboard'))}
            activeOpacity={0.8}
            accessibilityLabel="Back"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Apply Permission</Text>
              <Text style={styles.headerSubtitle}>Request short duration permission</Text>
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
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                </View>
                <View style={styles.clockBadge}>
                  <Feather name="clock" size={15} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Form Card */}
        <View style={styles.formCard}>
          {/* Date * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.inputCard, isCalendarOpen && styles.selectCardActive]}
              activeOpacity={0.8}
              onPress={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsTypeOpen(false);
                setIsDurationOpen(false);
                setIsManagerOpen(false);
              }}
            >
              <Text style={styles.cardInputText}>{date}</Text>
              <TouchableOpacity
                style={styles.calendarIconBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsTypeOpen(false);
                  setIsDurationOpen(false);
                  setIsManagerOpen(false);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="calendar" size={18} color="#111827" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Side Calendar Card (Revealed on the side of the page) */}
            {isCalendarOpen && (
              <View style={styles.sideCalendarCard}>
                {/* Header */}
                <View style={styles.calSideHeader}>
                  <View style={styles.calMonthSelector}>
                    <Text style={styles.calMonthYearText}>
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#111827" style={styles.calCaret} />
                  </View>

                  <View style={styles.calNavArrows}>
                    <TouchableOpacity
                      style={styles.calArrowBtn}
                      onPress={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear(calendarYear - 1);
                        } else {
                          setCalendarMonth(calendarMonth - 1);
                        }
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Previous month"
                    >
                      <Feather name="arrow-up" size={18} color="#111827" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.calArrowBtn}
                      onPress={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear(calendarYear + 1);
                        } else {
                          setCalendarMonth(calendarMonth + 1);
                        }
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Next month"
                    >
                      <Feather name="arrow-down" size={18} color="#111827" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Weekday headers */}
                <View style={styles.calWeekRow}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd, i) => (
                    <Text key={i} style={styles.calWeekDayText}>{wd}</Text>
                  ))}
                </View>

                {/* 42-Cell Days Grid */}
                <View style={styles.calDaysGrid}>
                  {calendarCells.map((cell, idx) => {
                    const isSelected =
                      cell.month === selectedMonth &&
                      cell.year === selectedYear &&
                      cell.day === selectedDay;

                    const isToday =
                      cell.month === todayMonth &&
                      cell.year === todayYear &&
                      cell.day === todayDay;

                    return (
                      <TouchableOpacity
                        key={\`cell-\${idx}\`}
                        style={[
                          styles.calDayCell,
                          isSelected && styles.calDayCellSelected,
                          !isSelected && isToday && styles.calDayCellToday,
                        ]}
                        onPress={() => handleSelectDate(cell.day, cell.month, cell.year)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            !cell.isCurrentMonth && styles.calDayTextMuted,
                            isSelected && styles.calDayTextSelected,
                            !isSelected && isToday && styles.calDayTextToday,
                          ]}
                        >
                          {cell.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Footer with Clear and Today */}
                <View style={styles.calSideFooter}>
                  <TouchableOpacity onPress={handleClearDate} activeOpacity={0.7}>
                    <Text style={styles.calFooterLink}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleTodayDate} activeOpacity={0.7}>
                    <Text style={styles.calFooterLink}>Today</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Permission Type * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Permission Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectCard, isTypeOpen && styles.selectCardActive]}
              onPress={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsCalendarOpen(false);
                setIsDurationOpen(false);
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

          {/* Duration * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Duration <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectCard, isDurationOpen && styles.selectCardActive]}
              onPress={() => {
                setIsDurationOpen(!isDurationOpen);
                setIsCalendarOpen(false);
                setIsTypeOpen(false);
                setIsManagerOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{durationText}</Text>
              <Feather name={isDurationOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
            </TouchableOpacity>
            {isDurationOpen && (
              <View style={styles.dropdownContainer}>
                {DURATION_OPTIONS.map((d) => {
                  const isSelected = d === durationText;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                      onPress={() => handleSelectDuration(d)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Reason * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Reason <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.textareaCard}>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                maxLength={500}
                placeholder="E.g., Medical checkup, personal work..."
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
              />
              <Text style={styles.charCounter}>{reason.length}/500</Text>
            </View>
          </View>

          {/* Approving Manager */}
          <View style={styles.field}>
            <Text style={styles.label}>Approving Manager</Text>
            <TouchableOpacity
              style={[styles.selectCard, isManagerOpen && styles.selectCardActive]}
              onPress={() => {
                setIsManagerOpen(!isManagerOpen);
                setIsCalendarOpen(false);
                setIsTypeOpen(false);
                setIsDurationOpen(false);
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

          {/* Submit Request Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Feather name="send" size={18} color="#FFFFFF" style={styles.submitIcon} />
            <Text style={styles.submitText}>Submit Request</Text>
          </TouchableOpacity>
        </View>

        {/* Extra scrollable bottom space */}
        <View style={{ height: 80 }} />
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
    backgroundColor: '#0066FF',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0066FF',
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
`;

fs.writeFileSync(jsxPath, newJsx, 'utf8');
console.log('Updated ApplyPermissionScreen.jsx');

// ==========================================
// 2. UPDATE ApplyPermissionScreen.styles.js
// ==========================================
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const sideCalStyles = `
  /* Side Calendar Card (Revealed on the side of the page) */
  sideCalendarCard: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: 232,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 1000,
  },
  calSideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  calMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  calMonthYearText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  calCaret: {
    marginTop: 1,
    marginLeft: 1,
  },
  calNavArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calArrowBtn: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calWeekDayText: {
    width: 26,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#111827',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 2,
  },
  calDayCell: {
    width: 26,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginVertical: 1,
  },
  calDayCellSelected: {
    backgroundColor: '#0066FF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 2,
  },
  calDayCellToday: {
    borderWidth: 1,
    borderColor: '#71717A',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  calDayText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  calDayTextMuted: {
    color: '#94A3B8',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calDayTextToday: {
    color: '#111827',
    fontWeight: '600',
  },
  calSideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 2,
    paddingHorizontal: 2,
  },
  calFooterLink: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#0070F3',
  },
});`;

stylesContent = stylesContent.replace(/submitText:\s*\{[^}]+\},?\s*\}\);?/, `submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },` + sideCalStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');

// ==========================================
// 3. HTML & CSS for Web (Revealed on side of page)
// ==========================================
const sideCalCss = `
        /* Side Calendar (Revealed on the side of the page - Exact Image 1 Design) */
        .perm-side-calendar {
          display: none;
          position: absolute;
          top: 60px;
          right: 0;
          width: 232px;
          background: #FFFFFF;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          padding: 12px 12px 10px 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.08);
          box-sizing: border-box;
          user-select: none;
          z-index: 1000;
          animation: permSideReveal 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .perm-side-calendar.open {
          display: block;
        }

        @keyframes permSideReveal {
          from {
            opacity: 0;
            transform: translateX(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .cal-side-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 0 2px;
        }

        .cal-month-selector {
          display: flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;
        }

        .cal-month-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #000000;
          letter-spacing: -0.2px;
        }

        .cal-caret-svg {
          color: #111827;
          margin-top: 1px;
          width: 10px;
          height: 10px;
        }

        .cal-nav-arrows {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cal-arrow-btn {
          background: transparent;
          border: none;
          color: #111827;
          padding: 1px 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .cal-arrow-btn svg {
          width: 15px;
          height: 15px;
        }

        .cal-arrow-btn:hover {
          background: #F1F5F9;
          color: #0066FF;
        }

        .cal-weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 6px;
        }

        .cal-weekdays-row span {
          font-size: 11.5px;
          font-weight: 600;
          color: #111827;
          padding: 1px 0;
        }

        .cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 2px;
          column-gap: 2px;
        }

        .cal-day-cell {
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11.5px;
          font-weight: 500;
          color: #111827;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.12s ease;
          box-sizing: border-box;
        }

        .cal-day-cell.muted {
          color: #94A3B8;
        }

        .cal-day-cell:hover:not(.selected) {
          background: #F1F5F9;
        }

        .cal-day-cell.today:not(.selected) {
          border: 1px solid #71717A;
          background: #FFFFFF;
          color: #111827;
          font-weight: 600;
        }

        .cal-day-cell.selected {
          background: #0066FF !important;
          border: 2px solid #000000 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }

        .cal-side-footer {
          margin-top: 10px;
          padding-top: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 2px;
          padding-right: 2px;
        }

        .cal-footer-link {
          background: transparent;
          border: none;
          color: #0070F3;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .cal-footer-link:hover {
          color: #0051B3;
          background: #EFF6FF;
        }
`;

const sideCalHtml = `<!-- Date * -->
            <div class="perm-field" style="position: relative; z-index: 100;">
              <label class="perm-label">Date <span class="perm-required">*</span></label>
              <div class="perm-input-card" id="perm-date-card" onclick="togglePermCalendar(event)">
                <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
                <div class="perm-card-icon" id="perm-calendar-icon-btn" onclick="togglePermCalendar(event)" title="Choose date">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <input type="hidden" id="perm-date-input" value="09/04/2026" />
              </div>

              <!-- Side Calendar Card (Revealed on the side of the page) -->
              <div class="perm-side-calendar" id="perm-side-calendar" style="display: none;" onclick="event.stopPropagation()">
                <!-- Header -->
                <div class="cal-side-header">
                  <div class="cal-month-selector">
                    <span class="cal-month-title" id="perm-cal-month-title">September 2026</span>
                    <svg class="cal-caret-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"></path>
                    </svg>
                  </div>
                  <div class="cal-nav-arrows">
                    <button type="button" class="cal-arrow-btn" onclick="changePermCalMonth(-1)" aria-label="Previous month" title="Previous month">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                    </button>
                    <button type="button" class="cal-arrow-btn" onclick="changePermCalMonth(1)" aria-label="Next month" title="Next month">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Weekday headers -->
                <div class="cal-weekdays-row">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                <!-- 42-Cell Days Grid -->
                <div class="cal-days-grid" id="perm-cal-days-grid">
                  <!-- Dynamically populated -->
                </div>

                <!-- Footer with Clear and Today links -->
                <div class="cal-side-footer">
                  <button type="button" class="cal-footer-link" onclick="clearPermDate()">Clear</button>
                  <button type="button" class="cal-footer-link" onclick="selectTodayPermDate()">Today</button>
                </div>
              </div>
            </div>`;

const sideCalJs = `
        var permCalState = {
          isOpen: false,
          currentMonth: 8, // September (0-indexed)
          currentYear: 2026,
          selectedDay: 4,
          selectedMonth: 8,
          selectedYear: 2026,
          todayDay: 28,
          todayMonth: 8,
          todayYear: 2026
        };

        var PERM_MONTH_NAMES = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        function togglePermCalendar(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (permCalState.isOpen) {
            closePermCalendar();
          } else {
            openPermCalendar();
          }
        }
        window.togglePermCalendar = togglePermCalendar;

        function openPermCalendar(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          var sideCal = document.getElementById('perm-side-calendar');
          if (!sideCal) return;
          
          var displayEl = document.getElementById('perm-date-display');
          if (displayEl && displayEl.textContent && displayEl.textContent.includes('/')) {
            var parts = displayEl.textContent.trim().split('/');
            if (parts.length === 3) {
              permCalState.selectedMonth = parseInt(parts[0], 10) - 1;
              permCalState.selectedDay = parseInt(parts[1], 10);
              permCalState.selectedYear = parseInt(parts[2], 10);
              permCalState.currentMonth = permCalState.selectedMonth;
              permCalState.currentYear = permCalState.selectedYear;
            }
          }
          
          renderPermCalendar();
          sideCal.style.display = 'block';
          sideCal.classList.add('open');
          permCalState.isOpen = true;
        }
        window.openPermCalendar = openPermCalendar;

        function closePermCalendar() {
          var sideCal = document.getElementById('perm-side-calendar');
          if (!sideCal) return;
          sideCal.style.display = 'none';
          sideCal.classList.remove('open');
          permCalState.isOpen = false;
        }
        window.closePermCalendar = closePermCalendar;

        function changePermCalMonth(delta) {
          permCalState.currentMonth += delta;
          if (permCalState.currentMonth < 0) {
            permCalState.currentMonth = 11;
            permCalState.currentYear--;
          } else if (permCalState.currentMonth > 11) {
            permCalState.currentMonth = 0;
            permCalState.currentYear++;
          }
          renderPermCalendar();
        }
        window.changePermCalMonth = changePermCalMonth;

        function renderPermCalendar() {
          var titleEl = document.getElementById('perm-cal-month-title');
          var gridEl = document.getElementById('perm-cal-days-grid');
          if (!titleEl || !gridEl) return;

          titleEl.textContent = PERM_MONTH_NAMES[permCalState.currentMonth] + ' ' + permCalState.currentYear;
          gridEl.innerHTML = '';

          var year = permCalState.currentYear;
          var month = permCalState.currentMonth;

          var firstDayOfWeek = new Date(year, month, 1).getDay();
          var daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
          var daysInPrevMonth = new Date(year, month, 0).getDate();

          var cells = [];

          // 1. Prev month trailing days
          for (var i = firstDayOfWeek - 1; i >= 0; i--) {
            var dPrev = daysInPrevMonth - i;
            var mPrev = month === 0 ? 11 : month - 1;
            var yPrev = month === 0 ? year - 1 : year;
            cells.push({ day: dPrev, month: mPrev, year: yPrev, isCurrent: false });
          }

          // 2. Current month days
          for (var d = 1; d <= daysInCurrentMonth; d++) {
            cells.push({ day: d, month: month, year: year, isCurrent: true });
          }

          // 3. Next month leading days (fill up to 42 cells total)
          var remaining = 42 - cells.length;
          for (var dNext = 1; dNext <= remaining; dNext++) {
            var mNext = month === 11 ? 0 : month + 1;
            var yNext = month === 11 ? year + 1 : year;
            cells.push({ day: dNext, month: mNext, year: yNext, isCurrent: false });
          }

          // Render all 42 cells
          cells.forEach(function(c) {
            var cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            cell.textContent = c.day;

            if (!c.isCurrent) {
              cell.classList.add('muted');
            }

            var isSelected = (
              c.month === permCalState.selectedMonth &&
              c.year === permCalState.selectedYear &&
              c.day === permCalState.selectedDay
            );

            var isToday = (
              c.month === permCalState.todayMonth &&
              c.year === permCalState.todayYear &&
              c.day === permCalState.todayDay
            );

            if (isSelected) {
              cell.classList.add('selected');
            } else if (isToday) {
              cell.classList.add('today');
            }

            cell.onclick = function(ev) {
              ev.stopPropagation();
              selectPermDate(c.day, c.month, c.year);
            };

            gridEl.appendChild(cell);
          });
        }
        window.renderPermCalendar = renderPermCalendar;

        function selectPermDate(day, month, year) {
          if (month === undefined) month = permCalState.currentMonth;
          if (year === undefined) year = permCalState.currentYear;

          permCalState.selectedDay = day;
          permCalState.selectedMonth = month;
          permCalState.selectedYear = year;
          permCalState.currentMonth = month;
          permCalState.currentYear = year;

          var mm = String(month + 1).padStart(2, '0');
          var dd = String(day).padStart(2, '0');
          var yyyy = year;
          var formatted = mm + '/' + dd + '/' + yyyy;

          var displayEl = document.getElementById('perm-date-display');
          if (displayEl) {
            if (displayEl.tagName === 'INPUT') displayEl.value = formatted;
            else displayEl.textContent = formatted;
          }

          var inputEl = document.getElementById('perm-date-input');
          if (inputEl) inputEl.value = formatted;

          closePermCalendar();
        }
        window.selectPermDate = selectPermDate;

        function clearPermDate() {
          var displayEl = document.getElementById('perm-date-display');
          if (displayEl) {
            if (displayEl.tagName === 'INPUT') displayEl.value = 'MM/DD/YYYY';
            else displayEl.textContent = 'MM/DD/YYYY';
          }

          var inputEl = document.getElementById('perm-date-input');
          if (inputEl) inputEl.value = '';

          permCalState.selectedDay = null;
          permCalState.selectedMonth = null;
          permCalState.selectedYear = null;

          closePermCalendar();
        }
        window.clearPermDate = clearPermDate;

        function selectTodayPermDate() {
          selectPermDate(permCalState.todayDay, permCalState.todayMonth, permCalState.todayYear);
        }
        window.selectTodayPermDate = selectTodayPermDate;
`;

function updateHtmlBundle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ApplyPermission">');
  if (tplStart === -1) {
    console.error('tpl-ApplyPermission not found in ' + filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  let tpl = content.substring(tplStart, tplEnd + 11);

  // 1. Replace CSS
  if (tpl.includes('.perm-hidden-picker-label')) {
    tpl = tpl.replace(/\/\* Hidden Date Picker Overlay[\s\S]*?\.perm-hidden-picker-label input\[type="date"\]\s*\{[^}]*\}/, sideCalCss.trim());
  } else if (!tpl.includes('.perm-side-calendar')) {
    tpl = tpl.replace('</style>', sideCalCss + '\n      </style>');
  }

  // 2. Replace Date Field HTML
  const oldDateFieldRegex = /<!-- Date \* -->[\s\S]*?<!-- Permission Type/m;
  tpl = tpl.replace(oldDateFieldRegex, sideCalHtml + '\n\n            <!-- Permission Type');

  // 3. Replace JS functions
  if (tpl.includes('function openCalPicker')) {
    tpl = tpl.replace(/function openCalPicker[\s\S]*?window\.onPermDateChange = onPermDateChange;/, sideCalJs.trim());
  }

  content = content.substring(0, tplStart) + tpl + content.substring(tplEnd + 11);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

// Update the 4 html bundles
updateHtmlBundle('preview_app.html');
updateHtmlBundle('index.html');
updateHtmlBundle('EmergereApp/EmergereApp/preview_app.html');
updateHtmlBundle('EmergereApp/EmergereApp/index.html');

// Update standalone preview.css and preview.html
const standaloneCssPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css';
let standCss = fs.readFileSync(standaloneCssPath, 'utf8');
if (standCss.includes('.perm-hidden-picker-label')) {
  standCss = standCss.replace(/\/\* Hidden Date Picker Overlay[\s\S]*?\.perm-hidden-picker-label input\[type="date"\]\s*\{[^}]*\}/, sideCalCss.trim());
} else if (!standCss.includes('.perm-side-calendar')) {
  standCss += '\n' + sideCalCss;
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);

const standaloneHtmlPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html';
let standHtml = fs.readFileSync(standaloneHtmlPath, 'utf8');

const oldStandDateFieldRegex = /<!-- Date \* -->[\s\S]*?<!-- Permission Type/m;
standHtml = standHtml.replace(oldStandDateFieldRegex, sideCalHtml + '\n\n      <!-- Permission Type');

if (standHtml.includes('function openCalPicker')) {
  standHtml = standHtml.replace(/function openCalPicker[\s\S]*?window\.onPermDateChange = onPermDateChange;/, sideCalJs.trim());
}
fs.writeFileSync(standaloneHtmlPath, standHtml, 'utf8');
console.log('Updated ' + standaloneHtmlPath);
