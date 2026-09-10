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
  name: 'Priya Sharma',
  role: 'Senior Software Engineer',
  empId: 'EMP-2024-0156',
  initials: 'PS',
  leaveType: 'Casual Leave',
  fromDate: 'Sep 10, 2026',
  toDate: 'Sep 11, 2026',
  totalDays: '2 Days',
  emergencyContact: '+91 98765 43210',
  reason: "Family function - attending sister's wedding ceremony in Bangalore.",
};

export default function LeaveApprovalDetailScreen({ navigation, route }) {
  const [remarks, setRemarks] = useState('');
  const req = (route && route.params && route.params.request) || DEFAULT_REQUEST;
  const firstName = req.name ? req.name.split(' ')[0] : 'Employee';

  const handleDecision = (status) => {
    // Navigate back to ManagerDashboard with decision status
    if (navigation) {
      navigation.navigate('ManagerDashboard', {
        requestId: req.id || '1',
        newStatus: status, // 'Approved' or 'Rejected'
        remarks: remarks,
      });
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Request Detail"
        subtitle={`${req.leaveType || 'Leave'} Application`}
        onBack={() => navigation && navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.employeeCard}>
          <View style={styles.employeeRow}>
            <Avatar initials={req.initials || 'PS'} size={56} />
            <View>
              <Text style={styles.name}>{req.name}</Text>
              <Text style={styles.role}>{req.role || 'Team Member'}</Text>
              <Text style={styles.empId}>{req.empId || 'EMP-2024-0156'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.specsCard}>
          <Text style={styles.sectionTitle}>LEAVE SPECIFICS</Text>
          <DetailRow label="Leave Type" value={req.leaveType || 'Casual Leave'} link />
          <DetailRow label="From Date" value={req.fromDate || 'Sep 10, 2026'} />
          <DetailRow label="To Date" value={req.toDate || 'Sep 11, 2026'} />
          <DetailRow label="Total Days" value={req.totalDays || '2 Days'} bold />
          <DetailRow label="Emergency Contact" value={req.emergencyContact || '+91 98765 43210'} />

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
