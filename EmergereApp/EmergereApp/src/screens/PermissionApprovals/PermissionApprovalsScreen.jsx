// src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx
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
          schedule: r.schedule || (r.date ? `${r.date} (${r.duration || '2 Hours'})` : 'Today'),
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
            schedule: newReq.schedule || (newReq.date ? `${newReq.date} (${newReq.duration || '2 Hours'})` : 'Sep 04 (03:00 - 05:00 PM)'),
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
      text: `Your ${targetItem?.type || 'Permission'} request for ${targetItem?.schedule || 'today'} was Approved by ${managerName}.`,
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
      text: `Your ${targetItem?.type || 'Permission'} request for ${targetItem?.schedule || 'today'} was Rejected by ${managerName}.`,
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
