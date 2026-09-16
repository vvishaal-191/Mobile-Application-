// src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalDetailScreen.styles';

const DEFAULT_PERSON = {
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
  appliedName: 'Priya (Applied)',
};

export default function LeaveApprovalDetailScreen({ navigation, route }) {
  const [remarks, setRemarks] = useState('');
  const person = route?.params?.person || DEFAULT_PERSON;
  const initialDecision = route?.params?.decision || person.status || 'Pending';
  const [decision, setDecision] = useState(initialDecision);

  const handleDecision = (status) => {
    setDecision(status);
    const managerName =
      (typeof global !== 'undefined' && global.USER_PROFILE?.reportingManager) ||
      'Your Manager';
    const employeeName = person.name || 'Employee';
    const leaveType = person.leaveType || 'Leave';

    // Build notification
    const notification = {
      id: Date.now().toString(),
      icon: status === 'Approved' ? 'check-circle' : 'x-circle',
      color: status === 'Approved' ? '#1FAE6E' : '#E5484D',
      text: `Your ${leaveType} request was ${status} by ${managerName}.`,
      employeeName,
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);
      global.LAST_LEAVE_DECISION = {
        id: person.id || '1',
        status,
        name: employeeName,
        type: leaveType,
      };
      if (global.LEAVE_REQUESTS) {
        global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
          r.id === person.id ? { ...r, status: status.toLowerCase() } : r
        );
      }
    }

    if (navigation) {
      // Navigate to Employee Dashboard with updated status
      navigation.navigate('EmployeeDashboard', {
        requestId: person.id || '1',
        newStatus: status,
        remarks: remarks,
      });
    }
  };

  const firstName = person.name ? person.name.split(' ')[0] : 'Employee';
  const isApproved = decision.toLowerCase() === 'approved';
  const isRejected = decision.toLowerCase() === 'rejected';

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Request Detail"
        subtitle={`${person.leaveType || 'Leave'} Application`}
        onBack={() => navigation && navigation.navigate('EmployeeDashboard', {
          requestId: person.id || '1',
          newStatus: decision,
        })}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.employeeCard}>
          <View style={styles.employeeRow}>
            <Avatar initials={person.initials || 'PS'} size={56} />
            <View>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.role}>{person.role || 'Senior Software Engineer'}</Text>
              <Text style={styles.empId}>{person.empId || 'EMP-2024-0156'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.specsCard}>
          <Text style={styles.sectionTitle}>LEAVE SPECIFICS</Text>
          <DetailRow label="Leave Type" value={person.leaveType || 'Casual Leave'} link />
          <DetailRow label="From Date" value={person.fromDate || 'Sep 10, 2026'} />
          <DetailRow label="To Date" value={person.toDate || 'Sep 11, 2026'} />
          <DetailRow label="Total Days" value={person.totalDays || '2 Days'} bold />
          <DetailRow label="Emergency Contact" value={person.emergencyContact || '+91 98765 43210'} />

          <View style={styles.reasonBlock}>
            <Text style={styles.reasonLabel}>Reason for Leave</Text>
            <Text style={styles.reasonText}>
              {person.reason || "Family function - attending sister's wedding ceremony in Bangalore."}
            </Text>
          </View>
        </Card>

        <Card style={styles.pathCard}>
          <Text style={styles.sectionTitle}>APPROVAL PATH</Text>
          <View style={styles.pathRow}>
            <Text style={styles.pathDone}>{`${firstName} (Applied)`}</Text>
            <Text style={styles.pathArrow}>›</Text>
            {isApproved ? (
              <Text style={[styles.pathDone, { color: '#1FAE6E', fontWeight: '700' }]}>Manager (Approved)</Text>
            ) : isRejected ? (
              <Text style={[styles.pathPending, { color: '#E5484D', fontWeight: '700' }]}>Manager (Rejected)</Text>
            ) : (
              <Text style={styles.pathPending}>Manager (Pending)</Text>
            )}
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
          <TouchableOpacity
            style={[styles.rejectBtn, isRejected && { backgroundColor: '#E5484D' }]}
            onPress={() => handleDecision('Rejected')}
          >
            <Text style={[styles.rejectText, isRejected && { color: '#FFFFFF' }]}>
              {isRejected ? 'Rejected' : 'Reject'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.approveBtn, isApproved && { backgroundColor: '#1FAE6E' }]}
            onPress={() => handleDecision('Approved')}
          >
            <Text style={[styles.approveText, isApproved && { color: '#FFFFFF' }]}>
              {isApproved ? 'Approved' : 'Approve'}
            </Text>
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
