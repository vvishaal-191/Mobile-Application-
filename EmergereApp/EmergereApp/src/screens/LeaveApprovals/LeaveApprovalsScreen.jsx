// src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './LeaveApprovalsScreen.styles';

const HEADER_BANNER_IMG = require('../../../assets/leave-approvals-header-banner.png');
const EMPTY_ART_IMG = require('../../../assets/leave-approvals-empty.png');

// Initial leave request (Pending 0, Approved 1, Rejected 0)
const INITIAL_REQUESTS = [
  {
    id: '1',
    initials: 'PS',
    name: 'Priya Sharma',
    empId: 'EMP-2024-0156',
    type: 'Casual Leave',
    leaveType: 'Casual Leave',
    duration: '2 Days (Sep 10 – Sep 11)',
    reason: 'Family function in hometown',
    typeTone: 'info',
    status: 'approved',
    isPermission: false,
  },
];

/** Helper: detect if a request is a Permission request */
function isPermissionRequest(r) {
  if (!r) return false;
  if (r.isPermission === true || r._isPermCard === true) return true;
  if (r.isPermission === false) return false;
  if (r.permissionType) return true;
  const permTypes = ['Early Going', 'Late Coming', 'Personal Work', 'Official Work', 'Permission'];
  const t = (r.type || r.leaveType || r.permissionType || '').trim();
  return permTypes.includes(t);
}

/** Helper: detect if a request is a Leave request */
function isLeaveRequest(r) {
  if (!r) return false;
  return !isPermissionRequest(r);
}

/** Helper: get manager name from global profile for notification text */
function getManagerName() {
  const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  return profile.reportingManager || 'Your Manager';
}

export default function LeaveApprovalsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  // Sync leave requests from global store and navigation route params
  useEffect(() => {
    const globalLeaves = (typeof global !== 'undefined' && global.LEAVE_REQUESTS) || [];
    setRequests((prev) => {
      const existingIds = new Set(prev.map((r) => String(r.id)));
      const fresh = globalLeaves
        .filter((r) => r && r.id && isLeaveRequest(r) && !existingIds.has(String(r.id)))
        .map((r) => ({
          id: String(r.id),
          initials: r.initials || 'EE',
          name: r.name || 'Employee',
          empId: r.empId || '',
          type: r.leaveType || r.type || 'Casual Leave',
          leaveType: r.leaveType || r.type || 'Casual Leave',
          duration: r.duration || (r.fromDate ? `${r.totalDays || '1 Day'} (${r.fromDate}${r.toDate ? ' – ' + r.toDate : ''})` : '1 Day'),
          reason: r.reason || '',
          typeTone: r.typeTone || 'info',
          status: (r.status || 'pending').toLowerCase(),
          isPermission: false,
        }));

      let merged = fresh.length > 0 ? [...fresh, ...prev] : prev;

      // Sync status updates for existing requests
      const globalStatusMap = {};
      globalLeaves.forEach((r) => {
        if (r && r.id && isLeaveRequest(r)) {
          globalStatusMap[String(r.id)] = (r.status || 'pending').toLowerCase();
        }
      });

      merged = merged.map((r) => {
        if (globalStatusMap[String(r.id)] && globalStatusMap[String(r.id)] !== r.status) {
          return { ...r, status: globalStatusMap[String(r.id)] };
        }
        return r;
      });

      return merged.filter(isLeaveRequest);
    });

    if (route?.params?.newLeaveRequest && isLeaveRequest(route.params.newLeaveRequest)) {
      const newReq = route.params.newLeaveRequest;
      setRequests((prev) => {
        if (prev.some((r) => String(r.id) === String(newReq.id))) {
          return prev.filter(isLeaveRequest);
        }
        return [
          {
            id: String(newReq.id),
            initials: newReq.initials || 'PS',
            name: newReq.name || 'Employee',
            empId: newReq.empId || '',
            type: newReq.leaveType || newReq.type || 'Casual Leave',
            leaveType: newReq.leaveType || newReq.type || 'Casual Leave',
            duration: newReq.duration || '1 Day',
            reason: newReq.reason || '',
            typeTone: newReq.typeTone || 'info',
            status: (newReq.status || 'pending').toLowerCase(),
            isPermission: false,
          },
          ...prev.filter(isLeaveRequest),
        ];
      });
    }
  }, [route?.params?.newLeaveRequest]);

  // Strictly calculate counts for Leave requests only
  const leaveOnlyRequests = requests.filter(isLeaveRequest);
  const pendingCount = leaveOnlyRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveOnlyRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveOnlyRequests.filter((r) => r.status === 'rejected').length;

  const tabs = [
    {
      key: 'pending',
      label: 'Pending',
      count: pendingCount,
      icon: 'clock',
      iconColor: '#0066FF',
      badgeStyle: styles.badgePending,
    },
    {
      key: 'approved',
      label: 'Approved',
      count: approvedCount,
      icon: 'check',
      iconColor: '#10B981',
      badgeStyle: styles.badgeApproved,
    },
    {
      key: 'rejected',
      label: 'Rejected',
      count: rejectedCount,
      icon: 'x',
      iconColor: '#EF4444',
      badgeStyle: styles.badgeRejected,
    },
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
        approvedAt: Date.now(),
      };
      if (global.LEAVE_REQUESTS) {
        global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
          String(r.id) === String(id) ? { ...r, status: 'approved', approvedAt: Date.now() } : r
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
      isPermission: false,
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Approved', isPermission: false });
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
        rejectedAt: Date.now(),
      };
      if (global.LEAVE_REQUESTS) {
        global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
          String(r.id) === String(id) ? { ...r, status: 'rejected', rejectedAt: Date.now() } : r
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
      isPermission: false,
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Rejected', isPermission: false });
  };

  // Only show Leave requests for the active tab (NO Permission requests)
  const filteredRequests = leaveOnlyRequests.filter((item) => item.status === activeTab);

  return (
    <View style={styles.screen}>
      {/* Royal Blue Header Banner */}
      <View style={styles.headerBannerWrap}>
        <Image
          source={HEADER_BANNER_IMG}
          style={styles.headerBannerImg}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backBtnHitbox}
          activeOpacity={0.7}
          onPress={() => navigation && navigation.goBack()}
          accessibilityLabel="Go back"
        />
      </View>

      {/* Floating Segmented Tab Bar */}
      <View style={styles.tabBarCard}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.key)}
            >
              <View style={styles.tabTopRow}>
                <View style={[styles.tabBadge, tab.badgeStyle]}>
                  <Feather
                    name={tab.icon}
                    size={12}
                    color={tab.iconColor}
                  />
                </View>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label} ({tab.count})
                </Text>
              </View>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.approvalsCardContainer}>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyCardWrapper}>
              <View style={styles.emptyArtWrap}>
                <Image
                  source={EMPTY_ART_IMG}
                  style={styles.emptyArtImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.emptyTitle}>No leave requests found</Text>
              <Text style={styles.emptySubtitle}>
                There are no leave requests in this category.
              </Text>
            </View>
          ) : (
            filteredRequests.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() =>
                  go('LeaveApprovalDetail', {
                    person: {
                      id: item.id,
                      name: item.name,
                      initials: item.initials,
                      empId: item.empId,
                      leaveType: item.type,
                      reason: item.reason,
                      totalDays: item.duration,
                      fromDate: item.duration.includes('(')
                        ? item.duration.split('(')[1].replace(')', '')
                        : item.duration,
                      toDate: item.duration.includes('(')
                        ? item.duration.split('(')[1].replace(')', '')
                        : item.duration,
                      isPermission: false,
                    },
                    decision: item.status === 'approved' ? 'Approved' : (item.status === 'rejected' ? 'Rejected' : 'Pending'),
                    isPermission: false,
                  })
                }
              >
                <View style={styles.requestCard}>
                  <View style={styles.topRow}>
                    <View style={styles.employeeRow}>
                      <Avatar initials={item.initials} size={46} />
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
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        activeOpacity={0.8}
                        onPress={() => handleReject(item.id)}
                      >
                        <Text style={styles.rejectText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        activeOpacity={0.8}
                        onPress={() => handleApprove(item.id)}
                      >
                        <Text style={styles.approveText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  ) : item.status === 'approved' ? (
                    <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                      <StatusBadge label="Approved" tone="success" />
                    </View>
                  ) : (
                    <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                      <StatusBadge label="Rejected" tone="danger" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar active="" onNavigate={go} />
    </View>
  );
}
