// src/screens/HolidayCalendar/HolidayCalendarScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import PillTabs from '../../components/PillTabs';
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
  { monthKey: 'jan', month: 'JANUARY 2026', date: '01', day: 'Thu', name: "New Year's Day", sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building', isHighlight: true },
  { monthKey: 'jan', month: 'JANUARY 2026', date: '15', day: 'Thu', name: 'Makar Sankranti / Pongal', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'kite' },
  { monthKey: 'jan', month: 'JANUARY 2026', date: '26', day: 'Mon', name: 'Republic Day', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },

  { monthKey: 'feb', month: 'FEBRUARY 2026', date: '15', day: 'Sun', name: 'Maha Shivratri', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'om', isSunday: true },

  { monthKey: 'mar', month: 'MARCH 2026', date: '03', day: 'Tue', name: 'Holi / Dhulandi', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'palette' },
  { monthKey: 'mar', month: 'MARCH 2026', date: '20', day: 'Fri', name: 'Id-ul-Fitr (Ramzan)', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'moon-waning-crescent' },

  { monthKey: 'apr', month: 'APRIL 2026', date: '03', day: 'Fri', name: 'Good Friday', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },
  { monthKey: 'apr', month: 'APRIL 2026', date: '14', day: 'Tue', name: 'Ambedkar Jayanti / Tamil New Year', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'party-popper' },

  { monthKey: 'may', month: 'MAY 2026', date: '01', day: 'Fri', name: 'May Day / Labour Day', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },
  { monthKey: 'may', month: 'MAY 2026', date: '27', day: 'Wed', name: 'Bakrid / Id-ul-Zuha', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'moon-waning-crescent' },

  { monthKey: 'jun', month: 'JUNE 2026', date: '26', day: 'Fri', name: 'Muharram', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'moon-waning-crescent' },

  { monthKey: 'jul', month: 'JULY 2026', date: '26', day: 'Sun', name: 'Regional Holiday', sub: 'Optional Holiday', tag: 'Optional', tone: 'purple', icon: 'star-four-points', isSunday: true },

  { monthKey: 'aug', month: 'AUGUST 2026', date: '15', day: 'Sat', name: 'Independence Day', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },
  { monthKey: 'aug', month: 'AUGUST 2026', date: '26', day: 'Wed', name: 'Milad-un-Nabi', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'moon-waning-crescent' },

  { monthKey: 'sep', month: 'SEPTEMBER 2026', date: '10', day: 'Wed', name: 'Ganesh Chaturthi', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'party-popper' },
  { monthKey: 'sep', month: 'SEPTEMBER 2026', date: '16', day: 'Wed', name: 'Onam', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'flower' },

  { monthKey: 'oct', month: 'OCTOBER 2026', date: '02', day: 'Fri', name: 'Gandhi Jayanti', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },
  { monthKey: 'oct', month: 'OCTOBER 2026', date: '24', day: 'Sat', name: 'Dussehra', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'party-popper' },

  { monthKey: 'nov', month: 'NOVEMBER 2026', date: '14', day: 'Sat', name: 'Diwali', sub: 'Optional Holiday', tag: 'Festival', tone: 'purple', icon: 'candle' },

  { monthKey: 'dec', month: 'DECEMBER 2026', date: '25', day: 'Fri', name: 'Christmas', sub: 'Company Holiday', tag: 'National', tone: 'info', icon: 'office-building' },
];

export default function HolidayCalendarScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const go = (screen) => navigation && navigation.navigate(screen);
  const handleBack = () => (navigation ? navigation.goBack() : null);

  const filtered = tab === 'all' ? HOLIDAYS : HOLIDAYS.filter(h => h.monthKey === tab);

  // Group filtered holidays by month
  const grouped = {};
  filtered.forEach(h => {
    if (!grouped[h.month]) grouped[h.month] = [];
    grouped[h.month].push(h);
  });

  return (
    <View style={styles.screen}>
      {/* Header Card Banner matching Image 2 */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Holiday Calendar</Text>
            <Text style={styles.headerSubtitle}>Company &amp; optional holidays 2026</Text>
          </View>
          <View style={styles.headerCalendarIllustration}>
            {/* Illustrated 3D Calendar with notification bell badge */}
            <View style={styles.calWrapper}>
              <View style={styles.calSpiralRings}>
                <View style={styles.calRing} />
                <View style={styles.calRing} />
                <View style={styles.calRing} />
                <View style={styles.calRing} />
              </View>
              <View style={styles.calBody}>
                <View style={styles.calHeaderBar} />
                <View style={styles.calGrid}>
                  <View style={styles.calGridCell} />
                  <View style={styles.calGridCell} />
                  <View style={styles.calGridCell} />
                  <View style={styles.calGridCell} />
                  <View style={styles.calGridCell} />
                  <View style={styles.calGridCell} />
                </View>
              </View>
              <View style={styles.bellBadge}>
                <Feather name="bell" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Pill filter tabs */}
      <View style={styles.pillBarContainer}>
        <PillTabs tabs={TABS} active={tab} onChange={setTab} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {Object.keys(grouped).map(monthName => {
          const items = grouped[monthName];
          const countText = `${items.length} ${items.length === 1 ? 'Holiday' : 'Holidays'}`;

          return (
            <View key={monthName} style={styles.monthSection}>
              {/* Blue Month Header Bar */}
              <View style={styles.monthHeaderBar}>
                <Text style={styles.monthTitleText}>{monthName}</Text>
                <View style={styles.monthCountBadge}>
                  <Text style={styles.monthCountText}>{countText}</Text>
                </View>
              </View>

              {/* Month Cards Container */}
              <View style={styles.monthCardsContainer}>
                {items.map(h => (
                  <Card key={h.date + h.name} style={[styles.holidayCard, h.isHighlight && styles.holidayCardHighlight]}>
                    <View style={styles.holidayRow}>
                      <View style={[styles.dateBlock, h.isSunday && styles.dateBlockSunday]}>
                        <Text style={styles.dateNumText}>{h.date}</Text>
                        <Text style={styles.dateDayText}>{h.day}</Text>
                      </View>

                      <View style={styles.cardDivider} />

                      <View style={styles.cardInfo}>
                        <Text style={styles.nameText} numberOfLines={1}>{h.name}</Text>
                        <Text style={styles.subText}>{h.sub}</Text>
                      </View>

                      <View style={[styles.tagBadge, h.tag === 'National' ? styles.tagBadgeNational : styles.tagBadgeFestival]}>
                        {h.icon && (
                          <MaterialCommunityIcons
                            name={h.icon}
                            size={14}
                            color={h.tag === 'National' ? '#1D4ED8' : '#7E22CE'}
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Text style={[styles.tagText, h.tag === 'National' ? styles.tagTextNational : styles.tagTextFestival]}>
                          {h.tag}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BottomNavBar onNavigate={go} />
    </View>
  );
}
