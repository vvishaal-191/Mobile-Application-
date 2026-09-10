// src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalDetailScreen.styles';

const DEFAULT_REQUEST = {
  id: '1',
  initials: 'PS',
  name: 'Priya Sharma',
  role: 'Senior Software Engineer',
  empId: 'EMP-2024-0156',
  leaveType: 'Casual Leave',
  fromDate: 'Sep 10, 2026',
  toDate: 'Sep 11, 2026',
  duration: '2 Days',
  emergencyContact: '+91 98765 43210',
  reason: "Family function - attending sister's wedding ceremony in Bangalore.",
};

export default function LeaveApprovalDetailScreen({ navigation, route }) {
  const [remarks, setRemarks] = useState('');

  const reqParam = route?.params?.request || {};
  const req = {
    id: reqParam.id || DEFAULT_REQUEST.id,
    initials: reqParam.initials || (reqParam.name ? reqParam.name.split(' ').map(n=>n[0]).join('') : DEFAULT_REQUEST.initials),
    name: reqParam.name || DEFAULT_REQUEST.name,
    role: reqParam.role || (reqParam.name === 'Sneha Gupta' ? 'UI/UX Designer' : reqParam.name === 'Amit Patel' ? 'Backend Developer' : DEFAULT_REQUEST.role),
    empId: reqParam.empId || (reqParam.name === 'Sneha Gupta' ? 'EMP-2024-0210' : reqParam.name === 'Amit Patel' ? 'EMP-2024-0089' : DEFAULT_REQUEST.empId),
    leaveType: reqParam.type || reqParam.leaveType || (reqParam.name === 'Sneha Gupta' ? 'Earned Leave' : reqParam.name === 'Amit Patel' ? 'Sick Leave' : DEFAULT_REQUEST.leaveType),
    fromDate: reqParam.fromDate || (reqParam.name === 'Sneha Gupta' ? 'Sep 15, 2026' : reqParam.name === 'Amit Patel' ? 'Sep 12, 2026' : DEFAULT_REQUEST.fromDate),
    toDate: reqParam.toDate || (reqParam.name === 'Sneha Gupta' ? 'Sep 19, 2026' : reqParam.name === 'Amit Patel' ? 'Sep 12, 2026' : DEFAULT_REQUEST.toDate),
    duration: reqParam.duration || (reqParam.name === 'Sneha Gupta' ? '5 Days' : reqParam.name === 'Amit Patel' ? '1 Day' : DEFAULT_REQUEST.duration),
    emergencyContact: reqParam.emergencyContact || (reqParam.name === 'Sneha Gupta' ? '+91 98123 45678' : reqParam.name === 'Amit Patel' ? '+91 97654 32109' : DEFAULT_REQUEST.emergencyContact),
    reason: reqParam.reason || (reqParam.name === 'Sneha Gupta' ? 'Family vacation and personal work in hometown.' : reqParam.name === 'Amit Patel' ? 'Severe fever - doctor recommended complete rest.' : DEFAULT_REQUEST.reason),
  };

  const handleDecision = (status) => {
    // Navigate back to ManagerDashboard with decision status
    if (navigation) {
      navigation.navigate('ManagerDashboard', {
        requestId: req.id,
        newStatus: status, // 'Approved' or 'Rejected'
        remarks: remarks,
      });
    }
  };

  const firstName = req.name.split(' ')[0];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Request Detail"
        subtitle={`${req.leaveType} Application`}
        onBack={() => navigation && navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.employeeCard}>
          <View style={styles.employeeRow}>
            <Avatar initials={req.initials} size={56} />
            <View>
              <Text style={styles.name}>{req.name}</Text>
              <Text style={styles.role}>{req.role}</Text>
              <Text style={styles.empId}>{req.empId}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.specsCard}>
          <Text style={styles.sectionTitle}>LEAVE SPECIFICS</Text>
          <DetailRow label="Leave Type" value={req.leaveType} link />
          <DetailRow label="From Date" value={req.fromDate} />
          <DetailRow label="To Date" value={req.toDate} />
          <DetailRow label="Total Days" value={req.duration} bold />
          <DetailRow label="Emergency Contact" value={req.emergencyContact} />

          <View style={styles.reasonBlock}>
            <Text style={styles.reasonLabel}>Reason for Leave</Text>
            <Text style={styles.reasonText}>{req.reason}</Text>
          </View>
        </Card>

        <Card style={styles.pathCard}>
          <Text style={styles.sectionTitle}>APPROVAL PATH</Text>
          <View style={styles.pathRow}>
            <Text style={styles.pathDone}>{firstName} (Applied)</Text>
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
