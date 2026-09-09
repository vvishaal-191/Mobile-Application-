// src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import PillTabs from '../../components/PillTabs';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './PermissionApprovalsScreen.styles';

const INITIAL_REQUESTS = [
  {
    id: '1',
    initials: 'PS',
    name: 'Priya Sharma',
    type: 'Late Coming',
    tag: 'Late Coming',
    tagTone: 'purple',
    schedule: 'Sep 04 (10:00 - 10:30 AM)',
    duration: '30 Mins',
    reason: 'Doctor appointment checkup',
    status: 'pending',
  },
  {
    id: '2',
    initials: 'DK',
    name: 'Deepak Kumar',
    type: 'Early Going',
    tag: 'Early Going',
    tagTone: 'warning',
    schedule: 'Sep 05 (04:00 - 05:30 PM)',
    duration: '1.5 Hrs',
    reason: 'Personal family errand...',
    status: 'pending',
  },
  {
    id: '3',
    initials: 'RV',
    name: 'Rahul Verma',
    type: 'Official Work',
    tag: 'Official Work',
    tagTone: 'info',
    schedule: 'Sep 03 (02:00 - 04:00 PM)',
    duration: '2 Hrs',
    reason: 'Client meeting visit',
    status: 'approved',
  },
  {
    id: '4',
    initials: 'NG',
    name: 'Neha Gupta',
    type: 'Late Coming',
    tag: 'Late Coming',
    tagTone: 'purple',
    schedule: 'Sep 01 (10:30 - 11:30 AM)',
    duration: '1 Hr',
    reason: 'Car breakdown',
    status: 'rejected',
  },
];

export default function PermissionApprovalsScreen({ navigation }) {
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
        title="Permission Approvals"
        subtitle="Short-duration Passes"
        onBack={() => navigation && navigation.goBack()}
      />

      <PillTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredRequests.length === 0 ? (
          <Card style={styles.requestCard}>
            <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 20, fontWeight: '600' }}>
              No {activeTab} permission requests found.
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
                    <Text style={styles.subLabel}>{item.type}</Text>
                  </View>
                </View>
                <StatusBadge label={item.tag} tone={item.tagTone} />
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Schedule</Text>
                <Text style={styles.detailValue}>{item.schedule}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValueBold}>{item.duration}</Text>
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
