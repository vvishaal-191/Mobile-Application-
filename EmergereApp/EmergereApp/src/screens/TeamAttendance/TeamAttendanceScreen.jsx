// src/screens/TeamAttendance/TeamAttendanceScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './TeamAttendanceScreen.styles';

const MEMBERS = [
  { id: '1', initials: 'PS', name: 'Priya Sharma', detail: 'Check-In: 09:15 AM', status: 'Present', tone: 'success' },
  { id: '2', initials: 'AP', name: 'Amit Patel', detail: 'Check-In: 09:30 AM', status: 'Present', tone: 'success' },
  { id: '3', initials: 'SG', name: 'Sneha Gupta', detail: 'Not Checked In', status: 'Leave', tone: 'info' },
  { id: '4', initials: 'VS', name: 'Vikram Singh', detail: 'Check-In: 10:00 AM', status: 'WFH', tone: 'purple' },
  { id: '5', initials: 'RV', name: 'Ritu Verma', detail: 'No Record Found', status: 'Absent', tone: 'danger' },
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const YEARS = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function TeamAttendanceScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 3)); // Sep 3, 2026
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // 0-indexed (8 = Sep)
  const [pickerMode, setPickerMode] = useState('calendar'); // 'calendar' | 'month' | 'year'

  const go = (screen) => navigation && navigation.navigate(screen);

  const formatDateText = (d) => {
    const month = MONTHS_SHORT[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleOpenCalendar = () => {
    setViewYear(currentDate.getFullYear());
    setViewMonth(currentDate.getMonth());
    setPickerMode('calendar');
    setShowCalendarModal(true);
  };

  const handleCalPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleCalNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    setCurrentDate(newDate);
    setShowCalendarModal(false);
  };

  const handleSelectMonth = (mIdx) => {
    setViewMonth(mIdx);
    setPickerMode('calendar');
  };

  const handleSelectYear = (yr) => {
    setViewYear(yr);
    setPickerMode('calendar');
  };

  const handleToday = () => {
    const today = new Date(2026, 8, 3);
    setCurrentDate(today);
    setShowCalendarModal(false);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Team Attendance"
        subtitle="Real-time Status"
        onBack={() => navigation && navigation.goBack()}
      />

      <View style={styles.dateNav}>
        <TouchableOpacity onPress={handlePrevDay} style={styles.arrowBtn}>
          <Feather name="chevron-left" size={20} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenCalendar}
          style={styles.dateBtn}
        >
          <Text style={styles.dateText}>{formatDateText(currentDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextDay} style={styles.arrowBtn}>
          <Feather name="chevron-right" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryText, { color: '#1FAE6E' }]}>9 Present</Text>
        <Text style={[styles.summaryText, { color: '#2F6BFF' }]}>2 Leave</Text>
        <Text style={[styles.summaryText, { color: '#8B5CF6' }]}>1 WFH</Text>
        <Text style={[styles.summaryText, { color: '#E5484D' }]}>0 Absent</Text>
      </View>

      <Text style={styles.sectionLabel}>TEAM MEMBERS ({MEMBERS.length})</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {MEMBERS.map((m) => (
          <Card key={m.id} style={styles.memberCard}>
            <View style={styles.memberRow}>
              <Avatar initials={m.initials} size={48} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberDetail}>{m.detail}</Text>
              </View>
              <StatusBadge label={m.status} tone={m.tone} />
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Calendar Date Picker Modal */}
      <Modal
        visible={showCalendarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendarModal(false)}
        >
          <TouchableOpacity
            style={styles.pickerCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header: Month / Year Navigation */}
            <View style={styles.calHeader}>
              <TouchableOpacity
                style={styles.calNavBtn}
                onPress={handleCalPrevMonth}
              >
                <Feather name="chevron-left" size={20} color="#111827" />
              </TouchableOpacity>

              <View style={styles.calSelectors}>
                <TouchableOpacity
                  style={[
                    styles.selectorPill,
                    pickerMode === 'month' && styles.selectorPillActive,
                  ]}
                  onPress={() =>
                    setPickerMode(pickerMode === 'month' ? 'calendar' : 'month')
                  }
                >
                  <Text
                    style={[
                      styles.selectorPillText,
                      pickerMode === 'month' && styles.selectorPillTextActive,
                    ]}
                  >
                    {MONTHS_SHORT[viewMonth]}
                  </Text>
                  <Feather
                    name={pickerMode === 'month' ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={pickerMode === 'month' ? '#FFFFFF' : '#2F6BFF'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.selectorPill,
                    pickerMode === 'year' && styles.selectorPillActive,
                  ]}
                  onPress={() =>
                    setPickerMode(pickerMode === 'year' ? 'calendar' : 'year')
                  }
                >
                  <Text
                    style={[
                      styles.selectorPillText,
                      pickerMode === 'year' && styles.selectorPillTextActive,
                    ]}
                  >
                    {viewYear}
                  </Text>
                  <Feather
                    name={pickerMode === 'year' ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={pickerMode === 'year' ? '#FFFFFF' : '#2F6BFF'}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.calNavBtn}
                onPress={handleCalNextMonth}
              >
                <Feather name="chevron-right" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* View Mode: Month Selector */}
            {pickerMode === 'month' && (
              <View style={styles.selectionGrid}>
                {MONTHS_SHORT.map((m, idx) => {
                  const isSelected = idx === viewMonth;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.gridOption,
                        isSelected && styles.gridOptionSelected,
                      ]}
                      onPress={() => handleSelectMonth(idx)}
                    >
                      <Text
                        style={[
                          styles.gridOptionText,
                          isSelected && styles.gridOptionTextSelected,
                        ]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* View Mode: Year Selector */}
            {pickerMode === 'year' && (
              <View style={styles.selectionGrid}>
                {YEARS.map((yr) => {
                  const isSelected = yr === viewYear;
                  return (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.gridOption,
                        isSelected && styles.gridOptionSelected,
                      ]}
                      onPress={() => handleSelectYear(yr)}
                    >
                      <Text
                        style={[
                          styles.gridOptionText,
                          isSelected && styles.gridOptionTextSelected,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* View Mode: Calendar Days Grid */}
            {pickerMode === 'calendar' && (
              <View>
                {/* Weekday headers */}
                <View style={styles.weekdaysRow}>
                  {WEEKDAYS.map((w) => (
                    <Text key={w} style={styles.weekdayText}>
                      {w}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <View key={`empty-${i}`} style={styles.dayCell} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected =
                      day === currentDate.getDate() &&
                      viewMonth === currentDate.getMonth() &&
                      viewYear === currentDate.getFullYear();
                    const isToday =
                      day === 3 && viewMonth === 8 && viewYear === 2026;

                    return (
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.dayCell,
                          isSelected && styles.dayCellSelected,
                          isToday && !isSelected && styles.dayCellToday,
                        ]}
                        onPress={() => handleSelectDay(day)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isToday && !isSelected && styles.dayTextToday,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.todayBtn}
                onPress={handleToday}
              >
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowCalendarModal(false)}
              >
                <Text style={styles.closePickerText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <BottomNavBar active="Attendance" onNavigate={go} />
    </View>
  );
}
