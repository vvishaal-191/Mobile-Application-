// src/screens/LeaveHistory/LeaveHistoryScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import PillTabs from '../../components/PillTabs';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveHistoryScreen.styles';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'leaves', label: 'Leaves' },
  { key: 'permissions', label: 'Permissions' },
];

const REQUESTS = [
  {
    id: '1',
    type: 'leaves',
    requestType: 'Leave',
    category: 'Casual Leave',
    icon: 'check-circle',
    iconColor: '#1FAE6E',
    title: 'Casual Leave',
    date: 'Sep 02, 2026',
    timeSlot: 'N/A (Full Day)',
    duration: '1.0 Day',
    daysOrHours: '1.0 Day',
    appliedDate: 'Aug 30, 2026',
    reason: 'Family function in hometown.',
    status: 'Approved',
    tone: 'success',
    approverName: 'Rahul Sharma',
    approverComments: 'Approved. Coordinate handover with team.',
    supportingDocs: 'None Attached',
    remark: 'Approved by Rahul Sharma.',
  },
  {
    id: '2',
    type: 'permissions',
    requestType: 'Permission',
    category: 'Permission (Early Going)',
    icon: 'clock',
    iconColor: '#F5A623',
    title: 'Permission (Early Going)',
    date: 'Sep 08, 2026',
    timeSlot: '03:00 PM - 05:00 PM',
    duration: '2 Hours',
    daysOrHours: '2 Hours',
    appliedDate: 'Sep 07, 2026',
    reason: 'Personal medical appointment at Apollo Clinic.',
    status: 'Pending',
    tone: 'warning',
    approverName: 'Rahul Sharma',
    approverComments: 'Awaiting team lead review.',
    supportingDocs: 'doctor_appointment.pdf',
    remark: 'Sent to TL for review.',
  },
  {
    id: '3',
    type: 'leaves',
    requestType: 'Leave',
    category: 'Sick Leave',
    icon: 'x-circle',
    iconColor: '#E5484D',
    title: 'Sick Leave',
    date: 'Sep 15, 2026',
    timeSlot: 'N/A (Full Day)',
    duration: '1.0 Day',
    daysOrHours: '1.0 Day',
    appliedDate: 'Sep 14, 2026',
    reason: 'Severe fever and doctor advised rest.',
    status: 'Rejected',
    tone: 'danger',
    approverName: 'Rahul Sharma',
    approverComments: 'Rejected: Insufficient casual/sick leave balance available.',
    supportingDocs: 'medical_prescription.pdf',
    remark: "Rejected: 'Insufficient balance'.",
  },
];

export default function LeaveHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const go = (screen) => navigation && navigation.navigate(screen);
  const filtered = tab === 'all' ? REQUESTS : REQUESTS.filter((r) => r.type === tab);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>My Requests</Text>
      </View>
      <Text style={styles.subtitle}>Track your leaves & permissions</Text>

      <PillTabs tabs={TABS} active={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filtered.map((req) => {
          const isExpanded = expandedId === req.id;
          return (
            <Card key={req.id} style={styles.requestCard}>
              <View style={styles.requestRow}>
                <View style={styles.requestLeft}>
                  <Feather name={req.icon} size={22} color={req.iconColor} />
                  <View>
                    <Text style={styles.requestTitle}>{req.title}</Text>
                    <Text style={styles.requestDate}>
                      {req.type === 'permissions' ? `${req.date} • ${req.timeSlot}` : req.date}
                    </Text>
                  </View>
                </View>
                <StatusBadge label={req.status} tone={req.tone} />
              </View>

              <View style={styles.remarkDivider} />

              <View style={styles.cardFooterRow}>
                <Text style={styles.remarkText}>Remarks: {req.remark}</Text>
                <TouchableOpacity onPress={() => toggleExpand(req.id)} activeOpacity={0.7}>
                  <Text style={styles.viewDetailsLink}>
                    {isExpanded ? 'Hide Details ∧' : 'View Details ›'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isExpanded && (
                <View style={styles.expandedDetailsContainer}>
                  <View style={styles.expandedDivider} />

                  <Text style={styles.expandedHeaderTitle}>COMPLETE REQUEST DETAILS</Text>

                  <View style={styles.detailGrid}>
                    <DetailItem label="Request Type" value={req.requestType} />
                    <DetailItem label="Category" value={req.category} />
                    <DetailItem label="Date" value={req.date} />
                    {req.type === 'permissions' && (
                      <DetailItem label="Start & End Time" value={req.timeSlot} />
                    )}
                    <DetailItem label="Duration" value={req.duration} />
                    <DetailItem label="Number of Days/Hours" value={req.daysOrHours} />
                    <DetailItem label="Applied Date" value={req.appliedDate} />
                    <View style={styles.detailGridRow}>
                      <Text style={styles.detailGridLabel}>Approval Status</Text>
                      <View style={{ marginTop: 2 }}>
                        <StatusBadge label={req.status} tone={req.tone} />
                      </View>
                    </View>
                    <DetailItem label="Approver / Manager" value={req.approverName} />
                  </View>

                  <View style={styles.detailBlock}>
                    <Text style={styles.detailBlockLabel}>Reason / Comments</Text>
                    <Text style={styles.detailBlockText}>{req.reason}</Text>
                  </View>

                  <View style={styles.detailBlock}>
                    <Text style={styles.detailBlockLabel}>Approver Comments</Text>
                    <Text style={styles.detailBlockTextHighlight}>{req.approverComments}</Text>
                  </View>

                  <View style={styles.detailBlock}>
                    <Text style={styles.detailBlockLabel}>Supporting Documents</Text>
                    <View style={styles.docRow}>
                      <Feather name="paperclip" size={14} color="#2F6BFF" />
                      <Text style={styles.docText}>{req.supportingDocs}</Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>

      <BottomNavBar active="History" onNavigate={go} />
    </View>
  );
}

function DetailItem({ label, value }) {
  return (
    <View style={styles.detailGridRow}>
      <Text style={styles.detailGridLabel}>{label}</Text>
      <Text style={styles.detailGridValue}>{value}</Text>
    </View>
  );
}
