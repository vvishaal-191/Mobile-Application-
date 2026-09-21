// src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import PillTabs from '../../components/PillTabs';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalsScreen.styles';

const INITIAL_REQUESTS = [];

/** Helper: get manager name from global profile for notification text */
function getManagerName() {
  const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  return profile.reportingManager || 'Your Manager';
}

export default function LeaveApprovalsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  // Accept new leave submission from ApplyLeaveScreen
  useEffect(() => {
    if (route?.params?.newLeaveRequest) {
      const newReq = route.params.newLeaveRequest;
      setRequests((prev) => {
        if (prev.some((r) => r.id === newReq.id)) return prev;
        return [
          {
            id: newReq.id,
            initials: newReq.initials || 'PS',
            name: newReq.name || 'Employee',
            empId: newReq.empId || '',
            type: newReq.leaveType || newReq.type || 'Leave',
            duration: newReq.duration || '1 Day',
            reason: newReq.reason || '',
            typeTone: newReq.typeTone || 'info',
            status: 'pending',
          },
          ...prev,
        ];
      });
    }
  }, [route?.params?.newLeaveRequest]);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const tabs = [
    { key: 'pending', label: `Pending (${pendingCount})` },
    { key: 'approved', label: `Approved (${approvedCount})` },
    { key: 'rejected', label: `Rejected (${rejectedCount})` },
  ];

  const handleApprove = (id) => {
    const targetItem = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );

    const managerName = getManagerName();
    const employeeName = targetItem?.name || 'Employee';
    const notification = {
      id: Date.now().toString(),
      icon: 'check-circle',
      color: '#1FAE6E',
      text: `Your ${targetItem?.type || 'Leave'} request was Approved by ${managerName}.`,
      employeeName,
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);
      global.LAST_LEAVE_DECISION = {
        id,
        status: 'Approved',
        name: employeeName,
        type: targetItem?.type || 'Casual Leave',
      };
      if (global.LEAVE_REQUESTS) {
        global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
          r.id === id ? { ...r, status: 'approved' } : r
        );
      }
    }

    // Navigate to Request Detail page with Approved status
    const updatedItem = {
      ...(targetItem || {}),
      id,
      name: targetItem?.name || 'Priya Sharma',
      initials: targetItem?.initials || 'PS',
      empId: targetItem?.empId || 'EMP-2024-0156',
      leaveType: targetItem?.type || 'Casual Leave',
      reason: targetItem?.reason || '',
      totalDays: targetItem?.duration || '2 Days',
      status: 'Approved',
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Approved' });
  };

  const handleReject = (id) => {
    const targetItem = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );

    const managerName = getManagerName();
    const employeeName = targetItem?.name || 'Employee';
    const notification = {
      id: Date.now().toString(),
      icon: 'x-circle',
      color: '#E5484D',
      text: `Your ${targetItem?.type || 'Leave'} request was Rejected by ${managerName}.`,
      employeeName,
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);
      global.LAST_LEAVE_DECISION = {
        id,
        status: 'Rejected',
        name: employeeName,
        type: targetItem?.type || 'Casual Leave',
      };
      if (global.LEAVE_REQUESTS) {
        global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
          r.id === id ? { ...r, status: 'rejected' } : r
        );
      }
    }

    // Navigate to Request Detail page with Rejected status
    const updatedItem = {
      ...(targetItem || {}),
      id,
      name: targetItem?.name || 'Priya Sharma',
      initials: targetItem?.initials || 'PS',
      empId: targetItem?.empId || 'EMP-2024-0156',
      leaveType: targetItem?.type || 'Casual Leave',
      reason: targetItem?.reason || '',
      totalDays: targetItem?.duration || '2 Days',
      status: 'Rejected',
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Rejected' });
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {filteredRequests.length === 0 ? (
          <Card style={styles.requestCard}>
            <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 20, fontWeight: '600' }}>
              No {activeTab} leave requests found.
            </Text>
          </Card>
        ) : (
          filteredRequests.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => go('LeaveApprovalDetail', {
                person: {
                  id: item.id,
                  name: item.name,
                  initials: item.initials,
                  empId: item.empId,
                  leaveType: item.type,
                  reason: item.reason,
                  totalDays: item.duration,
                  fromDate: item.duration.includes('(') ? item.duration.split('(')[1].replace(')', '') : item.duration,
                  toDate: item.duration.includes('(') ? item.duration.split('(')[1].replace(')', '') : item.duration,
                }
              })}
            >
              <Card style={styles.requestCard}>
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
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
