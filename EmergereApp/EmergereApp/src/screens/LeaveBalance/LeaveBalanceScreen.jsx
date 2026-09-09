// src/screens/LeaveBalance/LeaveBalanceScreen.jsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveBalanceScreen.styles';

const BALANCES = [
  { label: 'Casual Leave', allocated: 12, used: 4, pending: 0, available: 8, color: '#2F6BFF' },
  { label: 'Sick Leave', allocated: 7, used: 2, pending: 0, available: 5, color: '#1FAE6E' },
  { label: 'Earned Leave', allocated: 15, used: 5, pending: 2, available: 8, color: '#F5A623' },
  { label: 'Privilege Leave', allocated: 3, used: 0, pending: 0, available: 3, color: '#8B5CF6' },
  { label: 'Emergency Leave', allocated: 2, used: 0, pending: 0, available: 2, color: '#E5484D' },
];

export default function LeaveBalanceScreen({ navigation }) {
  const go = (screen) => navigation && navigation.navigate(screen);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Leave Balances</Text>
        </View>
        <Text style={styles.subtitle}>Employee Balance Summary for 2026</Text>

        <View style={styles.periodRow}>
          <Text style={styles.periodText}>Current Period: Jan - Dec 2026</Text>
          <TouchableOpacity style={styles.yearPill}>
            <Text style={styles.yearText}>2026</Text>
            <Feather name="chevron-down" size={16} color="#2F6BFF" />
          </TouchableOpacity>
        </View>

        {BALANCES.map((b) => (
          <Card key={b.label} style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>{b.label}</Text>
              <Text style={[styles.availableText, { color: b.color }]}>
                {b.available} Available
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(b.available / b.allocated) * 100}%`,
                    backgroundColor: b.color,
                  },
                ]}
              />
            </View>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Allocated</Text>
                <Text style={styles.statValue}>{b.allocated}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Used</Text>
                <Text style={styles.statValue}>{b.used}</Text>
              </View>
              {b.pending > 0 && (
                <View>
                  <Text style={styles.statLabel}>Pending</Text>
                  <Text style={[styles.statValue, { color: '#F5A623' }]}>{b.pending}</Text>
                </View>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      <BottomNavBar active="Profile" onNavigate={go} />
    </View>
  );
}
