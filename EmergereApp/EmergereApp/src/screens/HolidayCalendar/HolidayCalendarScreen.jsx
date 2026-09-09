// src/screens/HolidayCalendar/HolidayCalendarScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import PillTabs from '../../components/PillTabs';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './HolidayCalendarScreen.styles';

const TABS = [
  { key: 'all', label: 'Holidays' },
];

const HOLIDAYS = [
  { month: 'SEPTEMBER 2026', date: 'Sep 10', day: 'Wed', name: 'Ganesh Chaturthi', tag: 'Festival', tone: 'purple' },
  { month: 'OCTOBER 2026', date: 'Oct 02', day: 'Fri', name: 'Gandhi Jayanti', tag: 'National', tone: 'info' },
  { month: 'OCTOBER 2026', date: 'Oct 24', day: 'Sat', name: 'Dussehra', tag: 'Festival', tone: 'purple' },
  { month: 'NOVEMBER 2026', date: 'Nov 14', day: 'Sat', name: 'Diwali', tag: 'Festival', tone: 'purple' },
  { month: 'DECEMBER 2026', date: 'Dec 25', day: 'Fri', name: 'Christmas', tag: 'National', tone: 'info' },
];

export default function HolidayCalendarScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const go = (screen) => navigation && navigation.navigate(screen);

  const filtered = HOLIDAYS;

  let lastMonth = null;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Holiday Calendar</Text>
      </View>
      <Text style={styles.subtitle}>Company & optional holidays 2026</Text>

      <PillTabs tabs={TABS} active={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filtered.map((h) => {
          const showMonth = h.month !== lastMonth;
          lastMonth = h.month;
          return (
            <View key={h.date}>
              {showMonth && <Text style={styles.monthLabel}>{h.month}</Text>}
              <Card style={styles.holidayCard}>
                <View style={styles.holidayRow}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateText}>{h.date}</Text>
                    <Text style={styles.dayText}>{h.day}</Text>
                  </View>
                  <Text style={styles.nameText}>{h.name}</Text>
                  <StatusBadge label={h.tag} tone={h.tone} />
                </View>
              </Card>
            </View>
          );
        })}
      </ScrollView>

      <BottomNavBar active="Profile" onNavigate={go} />
    </View>
  );
}
