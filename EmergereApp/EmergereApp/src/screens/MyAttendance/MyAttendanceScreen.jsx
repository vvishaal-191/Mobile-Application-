// src/screens/MyAttendance/MyAttendanceScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './MyAttendanceScreen.styles';

const LEGEND = [
  { label: 'Present', color: '#1FAE6E' },
  { label: 'Absent', color: '#E5484D' },
  { label: 'Leave', color: '#2F6BFF' },
  { label: 'Permission', color: '#F5A623' },
  { label: 'WFH', color: '#8B5CF6' },
  { label: 'Week-Off', color: '#8C93A3' },
];

const MONTHS_LIST = [
  'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026',
  'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'
];

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const DAY_STATUS = {
  1: '#1FAE6E', 2: '#8B5CF6', 3: '#1FAE6E', 4: '#1FAE6E', 5: '#8C93A3', 6: '#8C93A3',
  7: '#2F6BFF', 8: '#1FAE6E', 9: '#1FAE6E', 10: '#F5A623', 11: '#1FAE6E', 12: '#8C93A3', 13: '#8C93A3',
  14: '#1FAE6E', 15: '#E5484D', 16: '#1FAE6E', 17: '#1FAE6E', 18: '#1FAE6E', 19: '#8C93A3', 20: '#8C93A3',
  21: '#1FAE6E', 22: '#1FAE6E', 23: '#1FAE6E', 24: '#1FAE6E', 25: '#1FAE6E', 26: '#8C93A3', 27: '#8C93A3',
};

const DAY_DETAILS_MAP = {
  '#1FAE6E': { status: 'Present', color: '#1FAE6E', checkin: '09:15 AM', checkout: '06:15 PM', hours: '8h 30m' },
  '#E5484D': { status: 'Absent', color: '#E5484D', checkin: '--:--', checkout: '--:--', hours: '0h 0m' },
  '#2F6BFF': { status: 'On Leave', color: '#2F6BFF', checkin: '--:--', checkout: '--:--', hours: '0h 0m' },
  '#F5A623': { status: 'Permission (Early Exit)', color: '#F5A623', checkin: '09:15 AM', checkout: '04:15 PM', hours: '6h 30m' },
  '#8B5CF6': { status: 'Work From Home', color: '#8B5CF6', checkin: '09:00 AM', checkout: '06:00 PM', hours: '8h 30m' },
  '#8C93A3': { status: 'Week-Off / Holiday', color: '#8C93A3', checkin: '--:--', checkout: '--:--', hours: '0h 0m' }
};

export default function MyAttendanceScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState(3);
  const [monthLabel, setMonthLabel] = useState('September 2026');
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const go = (screen) => navigation && navigation.navigate(screen);

  const color = DAY_STATUS[selectedDay] || '#1FAE6E';
  const info = DAY_DETAILS_MAP[color] || DAY_DETAILS_MAP['#1FAE6E'];
  const dayFormatted = String(selectedDay).padStart(2, '0');
  const monthShort = monthLabel.split(' ')[0].substring(0, 3);
  const yearStr = monthLabel.split(' ')[1] || '2026';

  const selectMonth = (m) => {
    setMonthLabel(m);
    setShowMonthPicker(false);
    setSelectedDay(1);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../../assets/emergere-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>My Attendance</Text>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterPillActive}
            onPress={() => setShowMonthPicker(true)}
          >
            <Feather name="calendar" size={14} color="#2F6BFF" style={{ marginRight: 6 }} />
            <Text style={styles.filterActiveText}>{monthLabel}</Text>
            <Feather name="chevron-down" size={14} color="#2F6BFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>All Statuses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.legendRow}>
          {LEGEND.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((d, i) => (
              <Text key={`${d}-${i}`} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>
          <View style={styles.datesGrid}>
            <View style={styles.dateCellEmpty}><Text style={styles.dateNumMuted}>31</Text></View>
            {Array.from({ length: 27 }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dateCell, day === selectedDay && styles.dateCellSelected]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={styles.dateNum}>{day}</Text>
                <View
                  style={[styles.dateDot, { backgroundColor: DAY_STATUS[day] }]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>SELECTED DATE DETAILS</Text>
          <DetailRow label="Date" value={`${monthShort} ${dayFormatted}, ${yearStr}`} />
          <DetailRow label="Check-In Time" value={info.checkin} />
          <DetailRow label="Check-Out Time" value={info.checkout} />
          <DetailRow label="Working Hours" value={info.hours} />
          <DetailRow label="Status" value={info.status} color={info.color} bold />
        </Card>
      </ScrollView>

      {/* Month/Year Selection Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.monthPickerCard}>
            <Text style={styles.monthPickerTitle}>Select Month & Year</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {MONTHS_LIST.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthOption, m === monthLabel && styles.monthOptionSelected]}
                  onPress={() => selectMonth(m)}
                >
                  <Text style={[styles.monthOptionText, m === monthLabel && styles.monthOptionTextSelected]}>
                    {m}
                  </Text>
                  {m === monthLabel && <Feather name="check" size={16} color="#2F6BFF" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closePickerBtn}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.closePickerText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNavBar active="Attendance" onNavigate={go} />
    </View>
  );
}

function DetailRow({ label, value, color, bold }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, bold && styles.detailValueBold, color && { color }]}>{value}</Text>
    </View>
  );
}
