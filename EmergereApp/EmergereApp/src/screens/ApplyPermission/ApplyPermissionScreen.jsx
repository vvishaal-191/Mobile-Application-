// src/screens/ApplyPermission/ApplyPermissionScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyPermissionScreen.styles';

export default function ApplyPermissionScreen({ navigation }) {
  const [date, setDate] = useState('04-Sep-2026');
  const [permissionType, setPermissionType] = useState('Early Going');
  const [startTime, setStartTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [durationText, setDurationText] = useState('2 Hours');
  const [reason, setReason] = useState('');
  const [manager, setManager] = useState('Rahul Sharma (Team Lead)');

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
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
    if (startMin === null || endMin === null) return '2 Hours (Auto-calculated)';

    let diff = endMin - startMin;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let result = '';
    if (hours > 0 && mins > 0) result = `${hours} Hr ${mins} Mins`;
    else if (hours > 0) result = `${hours} Hour${hours > 1 ? 's' : ''}`;
    else result = `${mins} Mins`;

    return `${result} (Auto-calculated)`;
  };

  const handleStartTimeChange = (text) => {
    setStartTime(text);
    setDurationText(calculateDurationText(text, endTime));
  };

  const handleEndTimeChange = (text) => {
    setEndTime(text);
    setDurationText(calculateDurationText(startTime, text));
  };

  const handleSubmit = () => {
    const newRequest = {
      id: Date.now().toString(),
      initials: 'PS',
      name: 'Priya Sharma',
      type: permissionType,
      schedule: `${date} (${startTime} - ${endTime})`,
      duration: durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours',
      reason: reason || 'Personal work / Medical checkup',
      status: 'pending',
      typeTone: 'purple',
    };

    if (navigation) {
      navigation.navigate('PermissionApprovals', { newPermissionRequest: newRequest });
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Apply Permission</Text>
        </View>
        <Text style={styles.subtitle}>Request short duration permission</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Date *</Text>
          <View style={styles.dateInputRow}>
            <TextInput
              style={styles.flexInput}
              value={date}
              onChangeText={setDate}
              placeholder="DD-MMM-YYYY"
              placeholderTextColor="#9AA3B2"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Permission Type *</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>{permissionType}</Text>
            <Feather name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Start Time *</Text>
            <View style={styles.dateInputRow}>
              <TextInput
                style={styles.flexInput}
                value={startTime}
                onChangeText={handleStartTimeChange}
                placeholder="03:00 PM"
                placeholderTextColor="#9AA3B2"
              />
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>End Time *</Text>
            <View style={styles.dateInputRow}>
              <TextInput
                style={styles.flexInput}
                value={endTime}
                onChangeText={handleEndTimeChange}
                placeholder="05:00 PM"
                placeholderTextColor="#9AA3B2"
              />
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Duration *</Text>
          <View style={styles.dateInputRow}>
            <TextInput
              style={styles.flexInput}
              value={durationText}
              onChangeText={setDurationText}
              placeholder="E.g., 2 Hours"
              placeholderTextColor="#9AA3B2"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="E.g., Medical checkup, personal work..."
            placeholderTextColor="#9AA3B2"
            value={reason}
            onChangeText={setReason}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Approving Manager</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>{manager}</Text>
            <Feather name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar active="Apply" onNavigate={(scr) => navigation && navigation.navigate(scr)} />
    </View>
  );
}
