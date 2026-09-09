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
    categoryLabel: 'Leave Request',
    icon: 'check-circle',
    iconColor: '#1FAE6E',
    title: 'Casual Leave',
    date: 'Sep 02, 2026',
    duration: '1.0 Day',
    appliedOn: 'Aug 30, 2026',
    reason: 'Family function in hometown.',
    status: 'Approved',
    tone: 'success',
    remark: 'Approved by Rahul Sharma.',
  },
  {
    id: '2',
    type: 'permissions',
    categoryLabel: 'Permission Request',
    icon: 'clock',
    iconColor: '#F5A623',
    title: 'Permission (Early Going)',
    date: 'Sep 08, 2026',
    timeSlot: '03:00 PM - 05:00 PM',
    duration: '2 Hours',
    appliedOn: 'Sep 07, 2026',
    reason: 'Personal medical appointment.',
    status: 'Pending',
    tone: 'warning',
    remark: 'Sent to TL for review.',
  },
  {
    id: '3',
    type: 'leaves',
    categoryLabel: 'Leave Request',
    icon: 'x-circle',
    iconColor: '#E5484D',
    title: 'Sick Leave',
    date: 'Sep 15, 2026',
    duration: '1.0 Day',
    appliedOn: 'Sep 14, 2026',
    reason: 'Severe fever and doctor advised rest.',
    status: 'Rejected',
    tone: 'danger',
    remark: "Rejected: 'Insufficient balance'.",
  },
];

export default function LeaveHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleExpand(req.id)}
              >
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
              </TouchableOpacity>

              <View style={styles.remarkDivider} />

              <TouchableOpacity
                style={styles.cardFooterRow}
                activeOpacity={0.7}
                onPress={() => toggleExpand(req.id)}
              >
                <Text style={styles.remarkText}>Remarks: {req.remark}</Text>
                <Text style={styles.viewDetailsLink}>
                  {isExpanded ? 'Hide Details ˅' : 'View Details ›'}
                </Text>
              </TouchableOpacity>

              {/* EXPANDABLE DROP-DOWN DETAILS */}
              {isExpanded && (
                <View style={styles.dropdownContainer}>
                  <View style={styles.dropdownDivider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>
                      {req.type === 'leaves' ? 'Leave Request' : 'Permission Request'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{req.date}</Text>
                  </View>

                  {req.type === 'permissions' && req.timeSlot ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Time Slot</Text>
                      <Text style={styles.detailValue}>{req.timeSlot}</Text>
                    </View>
                  ) : null}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{req.duration}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Applied On</Text>
                    <Text style={styles.detailValue}>{req.appliedOn}</Text>
                  </View>

                  <View style={styles.detailRowVertical}>
                    <Text style={styles.detailLabel}>Reason</Text>
                    <Text style={styles.detailValueBox}>{req.reason}</Text>
                  </View>

                  <View style={styles.detailRowVertical}>
                    <Text style={styles.detailLabel}>Approver Remarks</Text>
                    <Text style={styles.detailRemarkBox}>{req.remark}</Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>

      {/* Details Popup Modal */}
      <Modal
        visible={!!selectedReq}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReq(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedReq(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            {selectedReq && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <Feather name={selectedReq.icon} size={24} color={selectedReq.iconColor} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalCategory}>{selectedReq.categoryLabel}</Text>
                      <Text style={styles.modalTitle}>{selectedReq.title}</Text>
                    </View>
                  </View>
                  <StatusBadge label={selectedReq.status} tone={selectedReq.tone} />
                </View>

                <View style={styles.modalDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{selectedReq.type === 'leaves' ? 'Leave' : 'Permission'}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{selectedReq.date}</Text>
                </View>

                {selectedReq.type === 'permissions' && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time Slot</Text>
                    <Text style={styles.detailValue}>{selectedReq.timeSlot}</Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{selectedReq.duration}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Applied On</Text>
                  <Text style={styles.detailValue}>{selectedReq.appliedOn}</Text>
                </View>

                <View style={styles.detailRowVertical}>
                  <Text style={styles.detailLabel}>Reason</Text>
                  <Text style={styles.detailValueBox}>{selectedReq.reason}</Text>
                </View>

                <View style={styles.detailRowVertical}>
                  <Text style={styles.detailLabel}>Approver Remarks</Text>
                  <Text style={styles.detailRemarkBox}>{selectedReq.remark}</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedReq(null)}
                >
                  <Text style={styles.closeBtnText}>Close Details</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <BottomNavBar active="History" onNavigate={go} />
    </View>
  );
}
