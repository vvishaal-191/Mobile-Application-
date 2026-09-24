// src/screens/LeaveBalance/LeaveBalanceScreen.jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveBalanceScreen.styles';

const BALANCES = [
  {
    type: 'casual',
    label: 'Casual Leave',
    subtitle: 'For personal reasons',
    iconName: 'briefcase',
    IconComponent: Feather,
    allocated: 12,
    used: 4,
    pending: 0,
    available: 8,
    color: '#0066FF',
    tint: '#EDF4FE',
    pillBg: '#EBF3FE',
    fillPercent: '66.7%',
  },
  {
    type: 'sick',
    label: 'Sick Leave',
    subtitle: 'For medical reasons',
    iconName: 'plus-square',
    IconComponent: Feather,
    allocated: 7,
    used: 2,
    pending: 0,
    available: 5,
    color: '#10B981',
    tint: '#E8F8F0',
    pillBg: '#E8F8F0',
    fillPercent: '71.4%',
  },
  {
    type: 'earned',
    label: 'Earned Leave',
    subtitle: 'Annual earned leaves',
    iconName: 'layers',
    IconComponent: Feather,
    allocated: 15,
    used: 5,
    pending: 2,
    available: 8,
    color: '#F59E0B',
    tint: '#FEF3C7',
    pillBg: '#FEF3C7',
    fillPercent: '53.3%',
  },
  {
    type: 'privilege',
    label: 'Privilege Leave',
    subtitle: 'Special privilege leaves',
    iconName: 'crown',
    IconComponent: FontAwesome5,
    allocated: 3,
    used: 0,
    pending: 0,
    available: 3,
    color: '#8B5CF6',
    tint: '#F3E8FF',
    pillBg: '#F3E8FF',
    fillPercent: '100%',
  },
  {
    type: 'emergency',
    label: 'Emergency Leave',
    subtitle: 'For urgent situations',
    iconName: 'alert-circle',
    IconComponent: Feather,
    allocated: 5,
    used: 3,
    pending: 0,
    available: 2,
    color: '#EF4444',
    tint: '#FEE2E2',
    pillBg: '#FEE2E2',
    fillPercent: '40%',
  },
];

export default function LeaveBalanceScreen({ navigation }) {
  const go = (screen) => navigation && navigation.navigate(screen);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {/* Royal Blue Curved Banner Header matching Image 2 */}
        <View style={styles.headerBanner}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => go('Dashboard')}
                activeOpacity={0.8}
              >
                <Feather name="arrow-left" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Leave Balances</Text>
                <Text style={styles.headerSubtitle}>Employee Balance Summary for 2026</Text>
              </View>
            </View>

            {/* 3D Calendar Illustration */}
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
                <View style={[styles.calendarCell, { backgroundColor: '#3B82F6' }]} />
              </View>
              <View style={styles.calendarClockBadge}>
                <Feather name="clock" size={14} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Bottom Row inside Banner */}
          <View style={styles.headerBottomRow}>
            <View style={styles.periodPill}>
              <View style={styles.periodIconBox}>
                <Feather name="calendar" size={16} color="#0066FF" />
              </View>
              <View>
                <Text style={styles.periodLabel}>Current Period</Text>
                <Text style={styles.periodVal}>Jan - Dec 2026</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.yearPill} activeOpacity={0.85}>
              <Text style={styles.yearText}>2026</Text>
              <Feather name="chevron-down" size={14} color="#0066FF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Leave Balance Cards matching Image 2 */}
        <View style={styles.cardsContainer}>
          {BALANCES.map((b) => {
            const Icon = b.IconComponent;
            return (
              <View key={b.label} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <View style={[styles.iconCircle, { backgroundColor: b.color }]}>
                      <Icon name={b.iconName} size={20} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{b.label}</Text>
                      <Text style={styles.cardSubtitle}>{b.subtitle}</Text>
                    </View>
                  </View>
                  <View style={[styles.availablePill, { backgroundColor: b.pillBg }]}>
                    <Text style={[styles.availableText, { color: b.color }]}>
                      {b.available} Available
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: b.fillPercent,
                        backgroundColor: b.color,
                      },
                    ]}
                  />
                </View>

                {/* Stat Boxes Row */}
                <View style={styles.statsRow}>
                  <View style={[styles.statBox, { backgroundColor: b.tint }]}>
                    <Text style={styles.statLabel}>Allocated</Text>
                    <Text style={[styles.statValue, b.type === 'emergency' ? { color: b.color } : null]}>
                      {b.allocated}
                    </Text>
                  </View>
                  <View style={[styles.statBox, styles.statBoxNeutral]}>
                    <Text style={styles.statLabel}>Used</Text>
                    <Text style={styles.statValue}>{b.used}</Text>
                  </View>
                  {b.pending > 0 && (
                    <View style={[styles.statBox, { backgroundColor: b.tint }]}>
                      <Text style={styles.statLabel}>Pending</Text>
                      <Text style={[styles.statValue, { color: b.color }]}>{b.pending}</Text>
                    </View>
                  )}
                  <View style={[styles.statBox, { backgroundColor: b.tint }]}>
                    <Text style={styles.statLabel}>Available</Text>
                    <Text style={[styles.statValue, { color: b.color }]}>{b.available}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomNavBar onNavigate={go} />
    </View>
  );
}
