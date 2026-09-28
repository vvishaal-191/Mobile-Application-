const fs = require('fs');
const path = require('path');

// 1. Update LeaveApprovalsScreen.jsx
const laScreenPath = path.resolve('EmergereApp/EmergereApp/src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx');
const laScreenCode = `// src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx
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
          duration: r.duration || (r.fromDate ? \`\${r.totalDays || '1 Day'} (\${r.fromDate}\${r.toDate ? ' – ' + r.toDate : ''})\` : '1 Day'),
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
      text: \`Your \${targetItem?.type || 'Leave'} request was Approved by \${managerName}.\`,
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
      text: \`Your \${targetItem?.type || 'Leave'} request was Rejected by \${managerName}.\`,
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
`;

fs.writeFileSync(laScreenPath, laScreenCode, 'utf8');
console.log('Updated LeaveApprovalsScreen.jsx');

// 2. Update PermissionApprovalsScreen.jsx
const permScreenPath = path.resolve('EmergereApp/EmergereApp/src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx');
const permScreenCode = `// src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './PermissionApprovalsScreen.styles';

const HEADER_BANNER_IMG = require('../../../assets/permission-approvals-header-banner.png');
const EMPTY_ART_IMG = require('../../../assets/permission-approvals-empty.png');

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

/** Helper: get manager name for notification text */
function getManagerName() {
  const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  return profile.reportingManager || 'Your Manager';
}

const INITIAL_REQUESTS = [];

export default function PermissionApprovalsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  React.useEffect(() => {
    const globalPerms = (typeof global !== 'undefined' && (global.PERMISSION_REQUESTS || global.PERM_STATE)) || [];
    setRequests((prev) => {
      const existingIds = new Set(prev.map((r) => String(r.id)));
      const fresh = globalPerms
        .filter((r) => r && r.id && isPermissionRequest(r) && !existingIds.has(String(r.id)))
        .map((r) => ({
          id: String(r.id),
          initials: r.employeeInitials || r.initials || 'EE',
          name: r.employeeName || r.name || 'Employee',
          type: r.permissionType || r.type || 'Early Going',
          tag: r.permissionType || r.type || 'Early Going',
          tagTone: (r.permissionType || r.type) === 'Late Coming' ? 'purple' : (r.permissionType || r.type) === 'Early Going' ? 'warning' : 'info',
          schedule: r.schedule || (r.date ? \`\${r.date} (\${r.duration || '2 Hours'})\` : 'Today'),
          duration: r.duration || '2 Hours',
          reason: r.reason || 'Personal work',
          status: (r.status || 'pending').toLowerCase(),
          isPermission: true,
        }));

      let merged = fresh.length > 0 ? [...fresh, ...prev] : prev;

      // Sync status updates for existing requests
      const globalStatusMap = {};
      globalPerms.forEach((r) => {
        if (r && r.id && isPermissionRequest(r)) {
          globalStatusMap[String(r.id)] = (r.status || 'pending').toLowerCase();
        }
      });

      merged = merged.map((r) => {
        if (globalStatusMap[String(r.id)] && globalStatusMap[String(r.id)] !== r.status) {
          return { ...r, status: globalStatusMap[String(r.id)] };
        }
        return r;
      });

      return merged.filter(isPermissionRequest);
    });

    if (route?.params?.newPermissionRequest && isPermissionRequest(route.params.newPermissionRequest)) {
      const newReq = route.params.newPermissionRequest;
      setRequests((prev) => {
        if (prev.some((r) => String(r.id) === String(newReq.id))) {
          return prev.filter(isPermissionRequest);
        }
        return [
          {
            id: String(newReq.id || Date.now().toString()),
            initials: newReq.initials || newReq.employeeInitials || 'EE',
            name: newReq.name || newReq.employeeName || 'Employee',
            type: newReq.permissionType || newReq.type || 'Early Going',
            tag: newReq.permissionType || newReq.type || 'Early Going',
            tagTone: (newReq.permissionType || newReq.type) === 'Late Coming' ? 'purple' : (newReq.permissionType || newReq.type) === 'Early Going' ? 'warning' : 'info',
            schedule: newReq.schedule || (newReq.date ? \`\${newReq.date} (\${newReq.duration || '2 Hours'})\` : 'Sep 04 (03:00 - 05:00 PM)'),
            duration: newReq.duration || '2 Hours',
            reason: newReq.reason || 'Personal work',
            status: (newReq.status || 'pending').toLowerCase(),
            isPermission: true,
          },
          ...prev.filter(isPermissionRequest),
        ];
      });
    }
  }, [route?.params?.newPermissionRequest]);

  // Strictly calculate counts for Permission requests only (NO Leave requests)
  const permOnlyRequests = requests.filter(isPermissionRequest);
  const pendingCount = permOnlyRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = permOnlyRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = permOnlyRequests.filter((r) => r.status === 'rejected').length;

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
    const notification = {
      id: Date.now().toString(),
      icon: 'check-circle',
      color: '#1FAE6E',
      text: \`Your \${targetItem?.type || 'Permission'} request for \${targetItem?.schedule || 'today'} was Approved by \${managerName}.\`,
      employeeName: targetItem?.name || 'Employee',
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);
      global.LAST_PERMISSION_DECISION = {
        id,
        status: 'Approved',
        type: targetItem?.type || 'Early Going',
        schedule: targetItem?.schedule,
        duration: targetItem?.duration,
        name: targetItem?.name || 'Employee',
        approvedAt: Date.now(),
      };
      if (global.PERMISSION_REQUESTS) {
        global.PERMISSION_REQUESTS = global.PERMISSION_REQUESTS.map((r) =>
          String(r.id) === String(id) ? { ...r, status: 'approved', approvedAt: Date.now() } : r
        );
      }
    }

    // Navigate to Request Detail (LeaveApprovalDetail) page with Approved status
    const updatedItem = {
      ...(targetItem || {}),
      id,
      name: targetItem?.name || 'Employee',
      initials: targetItem?.initials || 'EE',
      empId: targetItem?.empId || (typeof global !== 'undefined' && global.USER_PROFILE?.employeeId) || 'EMP-2024-0101',
      role: targetItem?.role || (typeof global !== 'undefined' && global.USER_PROFILE?.role) || 'Software Engineer',
      isPermission: true,
      type: targetItem?.type || 'Early Going',
      leaveType: targetItem?.type || 'Early Going',
      schedule: targetItem?.schedule || 'Today',
      duration: targetItem?.duration || '2 Hours',
      reason: targetItem?.reason || 'Personal work',
      status: 'Approved',
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Approved', isPermission: true });
  };

  const handleReject = (id) => {
    const targetItem = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );

    const managerName = getManagerName();
    const notification = {
      id: Date.now().toString(),
      icon: 'x-circle',
      color: '#E5484D',
      text: \`Your \${targetItem?.type || 'Permission'} request for \${targetItem?.schedule || 'today'} was Rejected by \${managerName}.\`,
      employeeName: targetItem?.name || 'Employee',
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);
      global.LAST_PERMISSION_DECISION = {
        id,
        status: 'Rejected',
        type: targetItem?.type || 'Early Going',
        schedule: targetItem?.schedule,
        duration: targetItem?.duration,
        name: targetItem?.name || 'Employee',
        rejectedAt: Date.now(),
      };
      if (global.PERMISSION_REQUESTS) {
        global.PERMISSION_REQUESTS = global.PERMISSION_REQUESTS.map((r) =>
          String(r.id) === String(id) ? { ...r, status: 'rejected', rejectedAt: Date.now() } : r
        );
      }
    }

    // Navigate to Request Detail (LeaveApprovalDetail) page with Rejected status
    const updatedItem = {
      ...(targetItem || {}),
      id,
      name: targetItem?.name || 'Employee',
      initials: targetItem?.initials || 'EE',
      empId: targetItem?.empId || (typeof global !== 'undefined' && global.USER_PROFILE?.employeeId) || 'EMP-2024-0101',
      role: targetItem?.role || (typeof global !== 'undefined' && global.USER_PROFILE?.role) || 'Software Engineer',
      isPermission: true,
      type: targetItem?.type || 'Early Going',
      leaveType: targetItem?.type || 'Early Going',
      schedule: targetItem?.schedule || 'Today',
      duration: targetItem?.duration || '2 Hours',
      reason: targetItem?.reason || 'Personal work',
      status: 'Rejected',
    };
    go('LeaveApprovalDetail', { person: updatedItem, decision: 'Rejected', isPermission: true });
  };

  // Only show Permission requests for the active tab (NO Leave requests)
  const filteredRequests = permOnlyRequests.filter((item) => item.status === activeTab);

  return (
    <View style={styles.screen}>
      {/* Amber/Gold Header Banner matching Permission Approvals Design */}
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
              <Text style={styles.emptyTitle}>No permission requests found</Text>
              <Text style={styles.emptySubtitle}>
                There are no permission requests in this category.
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
                      empId: item.empId || 'EMP-2024-0101',
                      leaveType: item.type,
                      type: item.type,
                      reason: item.reason,
                      duration: item.duration,
                      schedule: item.schedule,
                      isPermission: true,
                    },
                    decision: item.status === 'approved' ? 'Approved' : (item.status === 'rejected' ? 'Rejected' : 'Pending'),
                    isPermission: true,
                  })
                }
              >
                <View style={styles.requestCard}>
                  <View style={styles.topRow}>
                    <View style={styles.employeeRow}>
                      <Avatar initials={item.initials} size={46} />
                      <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.empId}>{item.schedule}</Text>
                      </View>
                    </View>
                    <StatusBadge label={item.type} tone={item.tagTone || 'warning'} />
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
`;

fs.writeFileSync(permScreenPath, permScreenCode, 'utf8');
console.log('Updated PermissionApprovalsScreen.jsx');

// 3. Update ManagerDashboardScreen.jsx
const mgrScreenPath = path.resolve('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx');
const mgrScreenCode = `// src/screens/ManagerDashboard/ManagerDashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ManagerDashboardScreen.styles';

const STATS = [
  { key: 'pending', value: '18', label: 'Pending\\nRequests', icon: 'file-text', color: '#0066FF', haloBg: '#DBEAFE', cardBg: '#F0F6FF', numColor: '#0066FF', borderColor: '#D6E6FE', target: 'LeaveApprovals' },
  { key: 'approved', value: '24', label: 'Approved\\nThis Month', icon: 'check-circle', color: '#00A859', haloBg: '#DCFCE7', cardBg: '#F0FDF4', numColor: '#00A859', borderColor: '#CEF3D8', target: 'LeaveApprovals' },
  { key: 'rejected', value: '3', label: 'Rejected\\nThis Month', icon: 'x-circle', color: '#EF4444', haloBg: '#FEE2E2', cardBg: '#FEF2F2', numColor: '#EF4444', borderColor: '#FCD4D4', target: 'LeaveApprovals' },
  { key: 'requestDetail', value: '12', label: 'Request\\nDetail', icon: 'file-text', color: '#7C3AED', haloBg: '#EDE9FE', cardBg: '#FAF5FF', numColor: '#7C3AED', borderColor: '#E9D8FE', target: 'LeaveApprovalDetail' },
];

const QUICK_ACTIONS_CONFIG = [
  {
    key: 'TeamAttendance',
    title: 'Team Attendance',
    desc: 'View and manage team attendance',
    icon: 'users',
    target: 'TeamAttendance',
    bg: '#2563EB',
    iconBg: 'rgba(255,255,255,0.2)',
    textColor: '#FFFFFF',
    descColor: 'rgba(255,255,255,0.85)',
    chevronBg: 'rgba(255,255,255,0.2)',
    chevronColor: '#FFFFFF',
  },
  {
    key: 'LeaveApprovals',
    title: 'Leave Approvals',
    desc: 'Review and approve leave requests',
    icon: 'file-text',
    target: 'LeaveApprovals',
    bg: '#EFF6FF',
    iconBg: '#2563EB',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#2563EB',
    badge: 0,
  },
  {
    key: 'PermissionApprovals',
    title: 'Permission Approvals',
    desc: 'Review permission requests',
    icon: 'clock',
    target: 'PermissionApprovals',
    bg: '#FFFBEB',
    iconBg: '#F59E0B',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#D97706',
    badge: 0,
  },
  {
    key: 'HolidayCalendar',
    title: 'Holiday Calendar',
    desc: 'View leaves, holidays and team schedule',
    icon: 'calendar',
    target: 'HolidayCalendar',
    bg: '#FAF5FF',
    iconBg: '#8B5CF6',
    textColor: '#0F172A',
    descColor: '#64748B',
    chevronBg: '#FFFFFF',
    chevronColor: '#8B5CF6',
  },
];

const SIDEBAR_ITEMS = [
  { key: 'ManagerDashboard', label: 'Manager Dashboard', icon: 'home', target: 'ManagerDashboard', active: true },
  { key: 'TeamAttendance', label: 'Team Attendance', icon: 'users', target: 'TeamAttendance' },
  { key: 'LeaveApprovals', label: 'Leave Approvals', icon: 'file-text', target: 'LeaveApprovals' },
  { key: 'PermissionApprovals', label: 'Permission Approvals', icon: 'check-square', target: 'PermissionApprovals' },
  { key: 'HolidayCalendar', label: 'Holiday Calendar', icon: 'calendar', target: 'HolidayCalendar' },
  { key: 'Notifications', label: 'Notifications', icon: 'bell', target: 'Notifications' },
  { key: 'MyProfile', label: 'My Profile', icon: 'user', target: 'MyProfile' },
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

export default function ManagerDashboardScreen({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const [quickActions, setQuickActions] = useState(QUICK_ACTIONS_CONFIG);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const go = (screen, params) => {
    setSidebarVisible(false);
    if (navigation && navigation.navigate) {
      navigation.navigate(screen, params);
    }
  };

  useEffect(() => {
    const leaveReqs = (typeof global !== 'undefined' && global.LEAVE_REQUESTS) || [];
    const permReqs = (typeof global !== 'undefined' && (global.PERMISSION_REQUESTS || global.PERM_STATE)) || [];

    // Calculate pending badges for Quick Actions separately
    const pendingLeavesCount = leaveReqs.filter((r) => !isPermissionRequest(r) && (r.status || 'pending').toLowerCase() === 'pending').length;
    const pendingPermsCount = permReqs.filter((r) => isPermissionRequest(r) && (r.status || 'pending').toLowerCase() === 'pending').length;

    setQuickActions((qa) =>
      qa.map((action) => {
        if (action.key === 'LeaveApprovals') {
          return { ...action, badge: pendingLeavesCount };
        }
        if (action.key === 'PermissionApprovals') {
          return { ...action, badge: pendingPermsCount };
        }
        return action;
      })
    );

    // Build Recent Requests: ONLY approved or rejected requests appear in Recent Requests
    // Both Leave and Permission requests are kept completely independent and separate
    const decidedLeaves = leaveReqs
      .filter((r) => {
        const s = (r.status || '').toLowerCase();
        return !isPermissionRequest(r) && (s === 'approved' || s === 'rejected');
      })
      .map((r) => ({
        id: String(r.id),
        name: r.name || r.employeeName || 'Employee',
        role: r.role || r.employeeRole || 'Senior Software Engineer',
        empId: r.empId || r.employeeId || 'EMP-2024-0156',
        initials: r.initials || r.employeeInitials || 'EE',
        leaveType: r.leaveType || r.type || 'Casual Leave',
        type: r.leaveType || r.type || 'Casual Leave',
        fromDate: r.fromDate || '',
        toDate: r.toDate || '',
        totalDays: r.totalDays || r.duration || '1 Day',
        emergencyContact: r.emergencyContact || '',
        reason: r.reason || 'Personal work',
        subtitle: \`\${r.leaveType || r.type || 'Leave'} • \${r.fromDate ? \`\${r.fromDate}\${r.toDate ? ' – ' + r.toDate : ''}\` : (r.duration || 'Recent')}\`,
        status: (r.status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected',
        tone: (r.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: false,
        timestamp: r.approvedAt || r.rejectedAt || r.createdAt || Date.now(),
      }));

    const decidedPerms = permReqs
      .filter((r) => {
        const s = (r.status || '').toLowerCase();
        return isPermissionRequest(r) && (s === 'approved' || s === 'rejected');
      })
      .map((r) => ({
        id: String(r.id),
        name: r.name || r.employeeName || 'Employee',
        role: r.role || r.employeeRole || 'UI/UX Designer',
        empId: r.empId || r.employeeId || 'EMP-2024-0101',
        initials: r.initials || r.employeeInitials || 'EE',
        leaveType: r.permissionType || r.type || 'Early Going',
        type: r.permissionType || r.type || 'Early Going',
        permissionType: r.permissionType || r.type || 'Early Going',
        schedule: r.schedule || (r.date ? \`\${r.date} (\${r.duration || '2 Hours'})\` : 'Today'),
        fromDate: r.date || r.fromDate || '',
        totalDays: r.duration || '2 Hours',
        reason: r.reason || 'Personal work',
        subtitle: \`\${r.permissionType || r.type || 'Early Going'} • \${r.schedule || r.date || 'Today'}\`,
        status: (r.status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected',
        tone: (r.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: true,
        timestamp: r.approvedAt || r.rejectedAt || r.createdAt || Date.now(),
      }));

    const leaveDec = typeof global !== 'undefined' ? global.LAST_LEAVE_DECISION : null;
    const permDec = typeof global !== 'undefined' ? global.LAST_PERMISSION_DECISION : null;

    const combined = [...decidedLeaves, ...decidedPerms];

    if (leaveDec && !combined.some((c) => !c.isPermission && (String(c.id) === String(leaveDec.id) || c.name === leaveDec.name))) {
      combined.unshift({
        id: String(leaveDec.id || Date.now()),
        name: leaveDec.name || 'Priya Sharma',
        role: 'Senior Software Engineer',
        empId: 'EMP-2024-0156',
        initials: 'PS',
        leaveType: leaveDec.type || 'Casual Leave',
        type: leaveDec.type || 'Casual Leave',
        subtitle: \`\${leaveDec.type || 'Casual Leave'} • Sep 10 – Sep 11\`,
        status: leaveDec.status || 'Approved',
        tone: (leaveDec.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: false,
        reason: 'Family function in hometown',
        timestamp: leaveDec.approvedAt || leaveDec.rejectedAt || Date.now(),
      });
    }

    if (permDec && !combined.some((c) => c.isPermission && (String(c.id) === String(permDec.id) || c.name === permDec.name))) {
      combined.unshift({
        id: String(permDec.id || Date.now()),
        name: permDec.name || 'Employee',
        role: 'UI/UX Designer',
        empId: 'EMP-2024-0101',
        initials: 'EE',
        leaveType: permDec.type || 'Early Going',
        type: permDec.type || 'Early Going',
        permissionType: permDec.type || 'Early Going',
        subtitle: \`\${permDec.type || 'Early Going'} • \${permDec.schedule || 'Today'}\`,
        status: permDec.status || 'Approved',
        tone: (permDec.status || '').toLowerCase() === 'approved' ? 'success' : 'danger',
        isPermission: true,
        reason: 'Personal work',
        timestamp: permDec.approvedAt || permDec.rejectedAt || Date.now(),
      });
    }

    // Sort by latest timestamp
    combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Deduplicate by key
    const seen = new Set();
    const finalRecent = combined.filter((item) => {
      const key = \`\${item.isPermission ? 'perm' : 'leave'}_\${item.id}_\${item.name}_\${item.type}\`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setRequests(finalRecent);
  }, [route?.params]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerWrap}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.hamburgerBtn}
                activeOpacity={0.8}
                onPress={() => setSidebarVisible(true)}
              >
                <Feather name="menu" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Manager Dashboard</Text>
                <Text style={styles.headerSubtitle}>IT Solutions</Text>
              </View>
            </View>
          </View>

          {/* Greeting Row */}
          <View style={styles.greetingRow}>
            <View style={styles.greetingLeft}>
              <Text style={styles.greetingTitle}>Welcome back, Rahul 👋</Text>
              <Text style={styles.greetingSub}>Manage your team leave and permission requests</Text>
            </View>
            <View style={styles.mgrAvatarWrap}>
              <Text style={styles.mgrAvatarText}>RS</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.statCard, { backgroundColor: s.cardBg, borderColor: s.borderColor }]}
              activeOpacity={0.8}
              onPress={() => go(s.target)}
            >
              <View style={[styles.statHalo, { backgroundColor: s.haloBg }]}>
                <Feather name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.numColor }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSub}>Manage your team activities</Text>
        </View>

        <View style={styles.qaGrid}>
          {quickActions.map((qa) => (
            <TouchableOpacity
              key={qa.key}
              style={[styles.qaCard, { backgroundColor: qa.bg }]}
              activeOpacity={0.85}
              onPress={() => go(qa.target)}
            >
              <View style={styles.qaTop}>
                <View style={[styles.qaIconWrap, { backgroundColor: qa.iconBg }]}>
                  <Feather name={qa.icon} size={18} color="#FFFFFF" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {qa.badge !== undefined && qa.badge > 0 && (
                    <View style={styles.qaBadge}>
                      <Text style={styles.qaBadgeText}>{qa.badge}</Text>
                    </View>
                  )}
                  <View style={[styles.qaChevron, { backgroundColor: qa.chevronBg }]}>
                    <Feather name="chevron-right" size={14} color={qa.chevronColor} />
                  </View>
                </View>
              </View>
              <Text style={[styles.qaTitle, { color: qa.textColor }]}>{qa.title}</Text>
              <Text style={[styles.qaDesc, { color: qa.descColor }]}>{qa.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Requests Section (Approved/Rejected Leave and Permission Requests) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests ({requests.length})</Text>
          <Text style={styles.sectionSub}>Processed leave and permission requests</Text>
        </View>

        <View style={styles.recentList}>
          {requests.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="file-text" size={42} color="#BFDBFE" />
              <Text style={styles.emptyTitle}>No recent requests</Text>
              <Text style={styles.emptyDesc}>New leave or permission requests from your team will appear here.</Text>
            </View>
          ) : (
            requests.map((r) => (
              <TouchableOpacity
                key={\`\${r.isPermission ? 'perm' : 'leave'}_\${r.id}\`}
                activeOpacity={0.7}
                onPress={() => go('LeaveApprovalDetail', { person: r, decision: r.status, isPermission: r.isPermission })}
              >
                <Card style={{ marginBottom: 10, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{r.name}</Text>
                      <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{r.subtitle}</Text>
                    </View>
                    <StatusBadge label={r.status} tone={r.tone || (r.status === 'Approved' ? 'success' : 'danger')} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sidebar Drawer Modal */}
      <Modal
        visible={sidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebarDrawer} onStartShouldSetResponder={() => true}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarBrand}>
                <Image
                  source={require('../../../assets/tech-circuit-logo.png')}
                  style={styles.sidebarLogo}
                  resizeMode="contain"
                />
                <Text style={styles.sidebarTitle}>Mobile Application</Text>
              </View>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <Feather name="x" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.sidebarProfileCard}>
              <View style={styles.sidebarProfileTop}>
                <View style={styles.sidebarAvatar}>
                  <Text style={styles.sidebarAvatarText}>RS</Text>
                </View>
                <View>
                  <Text style={styles.sidebarProfileName}>Rahul Sharma</Text>
                  <View style={styles.sidebarRoleBadge}>
                    <Text style={styles.sidebarRoleBadgeText}>MANAGER</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.sidebarLogoutBtn}
                onPress={() => go('Login')}
              >
                <Feather name="log-out" size={15} color="#F87171" />
                <Text style={styles.sidebarLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation List */}
            <View style={styles.sidebarNavList}>
              {SIDEBAR_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.sidebarNavItem, item.active && styles.sidebarNavItemActive]}
                  onPress={() => go(item.target)}
                >
                  <View style={[styles.sidebarNavIconBox, item.active && styles.sidebarNavIconBoxActive]}>
                    <Feather name={item.icon} size={18} color={item.active ? '#FFFFFF' : '#FFFFFF'} />
                  </View>
                  <Text style={[styles.sidebarNavLabel, item.active && styles.sidebarNavLabelActive]}>
                    {item.label}
                  </Text>
                  <Feather name="chevron-right" size={16} color={item.active ? '#2563EB' : 'rgba(147, 197, 253, 0.65)'} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
`;

fs.writeFileSync(mgrScreenPath, mgrScreenCode, 'utf8');
console.log('Updated ManagerDashboardScreen.jsx');
