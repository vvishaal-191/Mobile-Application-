// src/screens/TeamAttendance/TeamAttendanceScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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

export default function TeamAttendanceScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 3)); // Sep 3, 2026

  const go = (screen) => navigation && navigation.navigate(screen);

  const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatDateText = (d) => {
    const month = monthsArr[d.getMonth()];
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

        <View style={styles.dateBtn}>
          <Text style={styles.dateText}>{formatDateText(currentDate)}</Text>
        </View>

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
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

      <BottomNavBar active="Attendance" onNavigate={go} />
    </View>
  );
}
