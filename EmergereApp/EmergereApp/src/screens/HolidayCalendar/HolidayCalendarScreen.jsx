// src/screens/HolidayCalendar/HolidayCalendarScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import PillTabs from '../../components/PillTabs';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './HolidayCalendarScreen.styles';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'jan', label: 'Jan' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Aug' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dec' },
];

const HOLIDAYS = [
  { monthKey: 'jan', month: 'JANUARY 2026', date: 'Jan 01', day: 'Thu', name: "New Year's Day", tag: 'National', tone: 'info' },
  { monthKey: 'jan', month: 'JANUARY 2026', date: 'Jan 15', day: 'Thu', name: 'Makar Sankranti / Pongal', tag: 'Festival', tone: 'purple' },
  { monthKey: 'jan', month: 'JANUARY 2026', date: 'Jan 26', day: 'Mon', name: 'Republic Day', tag: 'National', tone: 'info' },

  { monthKey: 'feb', month: 'FEBRUARY 2026', date: 'Feb 15', day: 'Sun', name: 'Maha Shivratri', tag: 'Festival', tone: 'purple' },

  { monthKey: 'mar', month: 'MARCH 2026', date: 'Mar 03', day: 'Tue', name: 'Holi / Dhulandi', tag: 'Festival', tone: 'purple' },
  { monthKey: 'mar', month: 'MARCH 2026', date: 'Mar 20', day: 'Fri', name: 'Id-ul-Fitr (Ramzan)', tag: 'Festival', tone: 'purple' },

  { monthKey: 'apr', month: 'APRIL 2026', date: 'Apr 03', day: 'Fri', name: 'Good Friday', tag: 'National', tone: 'info' },
  { monthKey: 'apr', month: 'APRIL 2026', date: 'Apr 14', day: 'Tue', name: 'Ambedkar Jayanti / Tamil New Year', tag: 'Festival', tone: 'purple' },

  { monthKey: 'may', month: 'MAY 2026', date: 'May 01', day: 'Fri', name: 'May Day / Labour Day', tag: 'National', tone: 'info' },
  { monthKey: 'may', month: 'MAY 2026', date: 'May 27', day: 'Wed', name: 'Bakrid / Id-ul-Zuha', tag: 'Festival', tone: 'purple' },

  { monthKey: 'jun', month: 'JUNE 2026', date: 'Jun 26', day: 'Fri', name: 'Muharram', tag: 'Festival', tone: 'purple' },

  { monthKey: 'jul', month: 'JULY 2026', date: 'Jul 26', day: 'Sun', name: 'Regional Holiday', tag: 'Optional', tone: 'purple' },

  { monthKey: 'aug', month: 'AUGUST 2026', date: 'Aug 15', day: 'Sat', name: 'Independence Day', tag: 'National', tone: 'info' },
  { monthKey: 'aug', month: 'AUGUST 2026', date: 'Aug 26', day: 'Wed', name: 'Milad-un-Nabi', tag: 'Festival', tone: 'purple' },

  { monthKey: 'sep', month: 'SEPTEMBER 2026', date: 'Sep 10', day: 'Wed', name: 'Ganesh Chaturthi', tag: 'Festival', tone: 'purple' },
  { monthKey: 'sep', month: 'SEPTEMBER 2026', date: 'Sep 16', day: 'Wed', name: 'Onam', tag: 'Festival', tone: 'purple' },

  { monthKey: 'oct', month: 'OCTOBER 2026', date: 'Oct 02', day: 'Fri', name: 'Gandhi Jayanti', tag: 'National', tone: 'info' },
  { monthKey: 'oct', month: 'OCTOBER 2026', date: 'Oct 24', day: 'Sat', name: 'Dussehra', tag: 'Festival', tone: 'purple' },

  { monthKey: 'nov', month: 'NOVEMBER 2026', date: 'Nov 14', day: 'Sat', name: 'Diwali', tag: 'Festival', tone: 'purple' },

  { monthKey: 'dec', month: 'DECEMBER 2026', date: 'Dec 25', day: 'Fri', name: 'Christmas', tag: 'National', tone: 'info' },
];

export default function HolidayCalendarScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const go = (screen) => navigation && navigation.navigate(screen);

  const filtered = tab === 'all' ? HOLIDAYS : HOLIDAYS.filter(h => h.monthKey === tab);

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
            <View key={h.date + h.name}>
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
