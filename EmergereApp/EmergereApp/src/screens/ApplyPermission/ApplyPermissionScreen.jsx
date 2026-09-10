// src/screens/ApplyPermission/ApplyPermissionScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyPermissionScreen.styles';

export default function ApplyPermissionScreen({ navigation }) {
  const [date] = useState('04-Sep-2026');
  const [permissionType] = useState('Early Going');
  const [startTime] = useState('03:00 PM');
  const [endTime] = useState('05:00 PM');
  const [reason, setReason] = useState('');
  const [manager] = useState('Rahul Sharma (Team Lead)');

  const handleSubmit = () => {
    const newRequest = {
      id: Date.now().toString(),
      initials: 'PS',
      name: 'Priya Sharma',
      type: permissionType,
      schedule: `${date} (${startTime} - ${endTime})`,
      duration: '2 Hours',
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
          <View style={styles.inputBox}><Text style={styles.inputText}>{date}</Text></View>
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
            <View style={styles.inputBox}><Text style={styles.inputText}>{startTime}</Text></View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>End Time *</Text>
            <View style={styles.inputBox}><Text style={styles.inputText}>{endTime}</Text></View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.autoBox}>
            <Text style={styles.autoText}>2 Hours (Auto-calculated)</Text>
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

      <BottomNavBar active="Apply" onNavigate={go} />
    </View>
  );
}
