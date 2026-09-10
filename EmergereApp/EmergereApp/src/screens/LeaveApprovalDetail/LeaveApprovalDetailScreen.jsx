// src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalDetailScreen.styles';

export default function LeaveApprovalDetailScreen({ navigation, route }) {
  const requestParam = route?.params?.request;
  const reqId = requestParam?.id || '1';
  const empName = requestParam?.name || 'Priya Sharma';
  const initials = empName === 'Sneha Gupta' ? 'SG' : 'PS';
  const role = empName === 'Sneha Gupta' ? 'UI/UX Designer' : 'Senior Software Engineer';
  const empCode = empName === 'Sneha Gupta' ? 'EMP-2024-0284' : 'EMP-2024-0156';
  const leaveType = empName === 'Sneha Gupta' ? 'Earned Leave' : 'Casual Leave';
  const fromDate = empName === 'Sneha Gupta' ? 'Sep 15, 2026' : 'Sep 10, 2026';
  const toDate = empName === 'Sneha Gupta' ? 'Sep 19, 2026' : 'Sep 11, 2026';
  const totalDays = empName === 'Sneha Gupta' ? '5 Days' : '2 Days';
  const reason = empName === 'Sneha Gupta'
    ? 'Annual family vacation trip to Himachal Pradesh.'
    : "Family function - attending sister's wedding ceremony in Bangalore.";

  const [remarks, setRemarks] = useState('');

  const handleDecision = (status) => {
    // Navigate back to ManagerDashboard with decision status
    if (navigation) {
      navigation.navigate('ManagerDashboard', {
        requestId: reqId,
        newStatus: status, // 'Approved' or 'Rejected'
        remarks: remarks,
      });
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Request Detail"
        subtitle={`${leaveType} Application`}
        onBack={() => navigation && navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.employeeCard}>
          <View style={styles.employeeRow}>
            <Avatar initials={initials} size={56} />
            <View>
              <Text style={styles.name}>{empName}</Text>
              <Text style={styles.role}>{role}</Text>
              <Text style={styles.empId}>{empCode}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.specsCard}>
          <Text style={styles.sectionTitle}>LEAVE SPECIFICS</Text>
          <DetailRow label="Leave Type" value={leaveType} link />
          <DetailRow label="From Date" value={fromDate} />
          <DetailRow label="To Date" value={toDate} />
          <DetailRow label="Total Days" value={totalDays} bold />
          <DetailRow label="Emergency Contact" value="+91 98765 43210" />

          <View style={styles.reasonBlock}>
            <Text style={styles.reasonLabel}>Reason for Leave</Text>
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        </Card>

        <Card style={styles.pathCard}>
          <Text style={styles.sectionTitle}>APPROVAL PATH</Text>
          <View style={styles.pathRow}>
            <Text style={styles.pathDone}>{empName.split(' ')[0]} (Applied)</Text>
            <Text style={styles.pathArrow}>›</Text>
            <Text style={styles.pathPending}>Manager (Pending)</Text>
            <Text style={styles.pathArrow}>›</Text>
            <Text style={styles.pathFuture}>HR Desk</Text>
          </View>
        </Card>

        <Text style={styles.remarksLabel}>Manager Remarks (Optional)</Text>
        <TextInput
          style={styles.remarksInput}
          placeholder="Write any comments here..."
          placeholderTextColor="#9AA3B2"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => handleDecision('Rejected')}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={() => handleDecision('Approved')}>
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={(screen) => navigation && navigation.navigate(screen)} />
    </View>
  );
}

function DetailRow({ label, value, link, bold }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          link && styles.detailValueLink,
          bold && styles.detailValueBold,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
