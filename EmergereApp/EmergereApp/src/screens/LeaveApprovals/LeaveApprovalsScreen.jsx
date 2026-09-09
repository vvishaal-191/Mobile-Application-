// src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import PillTabs from '../../components/PillTabs';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalsScreen.styles';

const INITIAL_REQUESTS = [
  {
    id: '1',
    initials: 'PS',
    name: 'Priya Sharma',
    empId: 'EMP-2024-0156',
    type: 'Casual Leave',
    duration: '2 Days (Sep 10 - Sep 11)',
    reason: "Sister's wedding ceremony...",
    typeTone: 'info',
    status: 'pending',
  },
  {
    id: '2',
    initials: 'AP',
    name: 'Amit Patel',
    empId: 'EMP-2024-0089',
    type: 'Sick Leave',
    duration: '1 Day (Sep 12)',
    reason: 'Doctor appointment...',
    typeTone: 'warning',
    status: 'pending',
  },
  {
    id: '3',
    initials: 'SG',
    name: 'Sneha Gupta',
    empId: 'EMP-2024-0210',
    type: 'Earned Leave',
    duration: '3 Days (Sep 15 - Sep 17)',
    reason: 'Family vacation...',
    typeTone: 'purple',
    status: 'pending',
  },
  {
    id: '4',
    initials: 'VS',
    name: 'Vikram Singh',
    empId: 'EMP-2024-0112',
    type: 'Casual Leave',
    duration: '1 Day (Sep 05)',
    reason: 'Personal work',
    typeTone: 'info',
    status: 'approved',
  },
  {
    id: '5',
    initials: 'RV',
    name: 'Ritu Verma',
    empId: 'EMP-2024-0199',
    type: 'Sick Leave',
    duration: '2 Days (Sep 01 - Sep 02)',
    reason: 'Severe flu',
    typeTone: 'warning',
    status: 'rejected',
  },
];

export default function LeaveApprovalsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const go = (screen) => navigation && navigation.navigate(screen);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const tabs = [
    { key: 'pending', label: `Pending (${pendingCount})` },
    { key: 'approved', label: `Approved (${approvedCount})` },
    { key: 'rejected', label: `Rejected (${rejectedCount})` },
  ];

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const filteredRequests = requests.filter((item) => item.status === activeTab);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Leave Approvals"
        subtitle="Manage Team Requests"
        onBack={() => navigation && navigation.goBack()}
      />

      <PillTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredRequests.length === 0 ? (
          <Card style={styles.requestCard}>
            <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 20, fontWeight: '600' }}>
              No {activeTab} leave requests found.
            </Text>
          </Card>
        ) : (
          filteredRequests.map((item) => (
            <Card key={item.id} style={styles.requestCard}>
              <View style={styles.topRow}>
                <View style={styles.employeeRow}>
                  <Avatar initials={item.initials} size={48} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.empId}>{item.empId}</Text>
                  </View>
                </View>
                <StatusBadge label={item.type} tone={item.typeTone || 'info'} />
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{item.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reason</Text>
                <Text style={styles.detailValue}>{item.reason}</Text>
              </View>

              {item.status === 'pending' ? (
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              ) : item.status === 'approved' ? (
                <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
                  <StatusBadge label="Approved" tone="success" />
                </View>
              ) : (
                <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
                  <StatusBadge label="Rejected" tone="danger" />
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
