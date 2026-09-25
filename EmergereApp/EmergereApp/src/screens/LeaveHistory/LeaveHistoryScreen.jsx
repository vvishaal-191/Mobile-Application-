// src/screens/LeaveHistory/LeaveHistoryScreen.jsx
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
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

/** Map a raw global request object → normalised display shape */
function normaliseRequest(r) {
  const isPermission = !!(
    r.isPermission ||
    r.permissionType ||
    r.type === 'Early Going' ||
    r.type === 'Late Coming' ||
    r.type === 'Personal Work' ||
    r.type === 'Official Work'
  );

  const rawStatus = (r.status || 'pending').toLowerCase();
  let status = 'Pending';
  let tone = 'warning';
  let iconName = 'clock';
  let iconColor = '#F5A623';

  if (rawStatus === 'approved') {
    status = 'Approved'; tone = 'success'; iconName = 'check-circle'; iconColor = '#1FAE6E';
  } else if (rawStatus === 'rejected') {
    status = 'Rejected'; tone = 'danger'; iconName = 'x-circle'; iconColor = '#E5484D';
  }

  const category = isPermission
    ? `Permission (${r.permissionType || r.type || r.leaveType || 'Early Going'})`
    : (r.leaveType || r.type || 'Casual Leave');

  const title = isPermission
    ? `Permission (${r.permissionType || r.type || r.leaveType || 'Early Going'})`
    : (r.leaveType || r.type || 'Casual Leave');

  const duration = r.totalDays || r.duration || (isPermission ? '2 Hours' : '1.0 Day');

  // Display date
  const displayDate = r.fromDate || r.date || '';

  // Start/end time for permissions
  const timeSlot =
    r.startTime && r.endTime
      ? `${r.startTime} - ${r.endTime}`
      : r.schedule
      ? r.schedule
      : 'N/A';

  // Applied date - use stored appliedDate or current date
  const appliedDate = r.appliedDate || r.submittedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  // Remark text
  let remark = r.remark || '';
  if (!remark) {
    if (status === 'Approved') remark = `Approved by ${r.approverName || r.approvingManager || 'Manager'}.`;
    else if (status === 'Rejected') remark = `Rejected: Insufficient balance.`;
    else remark = 'Sent to manager for review.';
  }

  const approverName =
    r.approverName ||
    (r.approvingManager
      ? r.approvingManager.replace(' (Reporting Manager)', '')
      : 'Manager');

  return {
    id: r.id || String(Math.random()),
    type: isPermission ? 'permissions' : 'leaves',
    requestType: isPermission ? 'Permission' : 'Leave',
    category,
    title,
    icon: iconName,
    iconColor,
    date: displayDate,
    timeSlot,
    duration,
    daysOrHours: duration,
    appliedDate,
    reason: r.reason || 'Personal work',
    status,
    tone,
    approverName,
    approverComments: r.approverComments || r.remarks || (status === 'Pending' ? 'Awaiting manager review.' : ''),
    supportingDocs: r.supportingDocs || 'None Attached',
    remark,
    isPermission,
    _raw: r,
  };
}

/** Pull the latest requests from global stores each time (no stale closure) */
function getGlobalRequests() {
  if (typeof global === 'undefined') return [];
  const leaves = (global.LEAVE_REQUESTS || []).map(normaliseRequest);
  const permissions = (global.PERMISSION_REQUESTS || []).map(normaliseRequest);
  return [...leaves, ...permissions].sort((a, b) =>
    // keep insertion order by comparing ids (larger = newer)
    Number(b._raw.id) - Number(a._raw.id)
  );
}

/** Derive tracking stages for a request */
function getTrackingStages(req) {
  const stages = [
    {
      key: 'applied',
      label: 'Applied',
      sublabel: req.appliedDate,
      done: true,
      active: false,
    },
    {
      key: 'pending',
      label: 'Pending with Manager',
      sublabel: req.approverName,
      done: req.status === 'Approved' || req.status === 'Rejected',
      active: req.status === 'Pending',
    },
    {
      key: 'decision',
      label: req.status === 'Rejected' ? 'Rejected' : 'Approved',
      sublabel:
        req.status === 'Approved'
          ? `By ${req.approverName}`
          : req.status === 'Rejected'
          ? `By ${req.approverName}`
          : 'Awaiting decision',
      done: req.status === 'Approved' || req.status === 'Rejected',
      active: false,
      isDecision: true,
      isApproved: req.status === 'Approved',
      isRejected: req.status === 'Rejected',
      isPending: req.status === 'Pending',
    },
  ];
  return stages;
}

export default function LeaveHistoryScreen({ navigation }) {
  const [tab, setTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const go = (screen) => navigation && navigation.navigate(screen);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setRefreshing(false);
    }, 400);
  }, []);

  // Merge dynamic global requests on every render (refreshKey forces re-read)
  const dynamicRequests = getGlobalRequests();

  // Filter by active tab
  const filtered =
    tab === 'all' ? dynamicRequests : dynamicRequests.filter((r) => r.type === tab);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const isEmpty = filtered.length === 0;

  return (
    <View style={styles.screen}>
      {/* Royal Blue Gradient Header Banner matching Image 2 */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (navigation && navigation.canGoBack ? navigation.goBack() : go('Dashboard'))}
              activeOpacity={0.7}
              accessibilityLabel="Go Back"
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>My Requests</Text>
              <Text style={styles.headerSubtitle}>Track your leaves & permissions</Text>
            </View>
          </View>
          <View style={styles.headerIllustration}>
            <Image
              source={require('../../../assets/requests-header-art.png')}
              style={styles.headerArtImg}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Filter Segment Bar matching Image 2 */}
      <View style={styles.filterBar}>
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066FF" />
        }
      >
        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../assets/empty-requests-art.png')}
              style={styles.emptyArtImg}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'permissions'
                ? 'Apply for a permission to see it here.'
                : tab === 'leaves'
                ? 'Apply for leave to see it here.'
                : 'Submit a leave or permission request\nto see it here.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => go(tab === 'permissions' ? 'ApplyPermission' : 'ApplyLeave')}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyActionBtnText}>
                {tab === 'permissions' ? 'Apply Permission' : 'Apply Leave'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((req) => {
            const isExpanded = expandedId === req.id;
            const stages = getTrackingStages(req);

            return (
              <Card key={req.id} style={styles.requestCard}>
                {/* ── Header row ── */}
                <View style={styles.requestRow}>
                  <View style={styles.requestLeft}>
                    <Feather name={req.icon} size={22} color={req.iconColor} />
                    <View>
                      <Text style={styles.requestTitle}>{req.title}</Text>
                      <Text style={styles.requestDate}>
                        {req.type === 'permissions'
                          ? `${req.date} • ${req.timeSlot}`
                          : req.date}
                      </Text>
                    </View>
                  </View>
                  <StatusBadge label={req.status} tone={req.tone} />
                </View>

                <View style={styles.remarkDivider} />

                {/* ── Footer row ── */}
                <View style={styles.cardFooterRow}>
                  <Text style={styles.remarkText}>Remarks: {req.remark}</Text>
                  <TouchableOpacity onPress={() => toggleExpand(req.id)} activeOpacity={0.7}>
                    <Text style={styles.viewDetailsLink}>
                      {isExpanded ? 'Hide Details ∧' : 'View Details ›'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── Expanded section ── */}
                {isExpanded && (
                  <View style={styles.expandedDetailsContainer}>
                    <View style={styles.expandedDivider} />

                    {/* ─ Tracking Timeline ─ */}
                    <Text style={styles.expandedHeaderTitle}>REQUEST TRACKING</Text>
                    <View style={styles.trackingContainer}>
                      {stages.map((stage, idx) => {
                        const isLast = idx === stages.length - 1;
                        let dotColor = '#C6CCD6';
                        let dotBorder = '#C6CCD6';
                        let lineColor = '#E7EAF0';

                        if (stage.done) {
                          dotColor = stage.isRejected ? '#E5484D' : '#1FAE6E';
                          dotBorder = stage.isRejected ? '#E5484D' : '#1FAE6E';
                          lineColor = stage.isRejected ? '#FBCECE' : '#BBEDD6';
                        } else if (stage.active) {
                          dotColor = '#FFFFFF';
                          dotBorder = '#2F6BFF';
                          lineColor = '#E7EAF0';
                        }

                        const labelColor = stage.done
                          ? (stage.isRejected ? '#E5484D' : '#111827')
                          : stage.active
                          ? '#2F6BFF'
                          : '#9AA3B2';

                        const sublabelColor = stage.done
                          ? (stage.isRejected ? '#E5484D' : '#1FAE6E')
                          : stage.active
                          ? '#6B7280'
                          : '#C6CCD6';

                        return (
                          <View key={stage.key} style={styles.trackingStep}>
                            {/* Dot + vertical line */}
                            <View style={styles.trackingDotCol}>
                              <View
                                style={[
                                  styles.trackingDot,
                                  { borderColor: dotBorder },
                                  stage.done && { backgroundColor: dotColor },
                                  stage.active && { backgroundColor: '#EEF4FF', borderWidth: 2.5 },
                                ]}
                              >
                                {stage.done && (
                                  <Feather
                                    name={stage.isRejected ? 'x' : 'check'}
                                    size={10}
                                    color="#FFFFFF"
                                  />
                                )}
                                {stage.active && (
                                  <View style={styles.trackingDotInner} />
                                )}
                              </View>
                              {!isLast && (
                                <View style={[styles.trackingLine, { backgroundColor: lineColor }]} />
                              )}
                            </View>

                            {/* Label */}
                            <View style={styles.trackingLabelCol}>
                              <Text style={[styles.trackingLabel, { color: labelColor }]}>
                                {stage.label}
                              </Text>
                              <Text style={[styles.trackingSubLabel, { color: sublabelColor }]}>
                                {stage.sublabel}
                              </Text>
                            </View>

                            {/* Status chip on the right for last stage */}
                            {stage.isDecision && (
                              <View style={styles.trackingBadgeWrap}>
                                {stage.isPending ? (
                                  <View style={styles.trackingChipPending}>
                                    <Text style={styles.trackingChipPendingText}>Awaiting</Text>
                                  </View>
                                ) : stage.isApproved ? (
                                  <View style={styles.trackingChipApproved}>
                                    <Text style={styles.trackingChipApprovedText}>✓ Approved</Text>
                                  </View>
                                ) : (
                                  <View style={styles.trackingChipRejected}>
                                    <Text style={styles.trackingChipRejectedText}>✕ Rejected</Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    <View style={styles.expandedDivider} />

                    {/* ─ Complete Request Details ─ */}
                    <Text style={styles.expandedHeaderTitle}>COMPLETE REQUEST DETAILS</Text>

                    <View style={styles.detailGrid}>
                      <DetailItem label="Request Type" value={req.requestType} />
                      <DetailItem label="Category" value={req.category} />
                      <DetailItem label="Date / Duration" value={req.date} />
                      {req.type === 'permissions' && (
                        <DetailItem label="Start & End Time" value={req.timeSlot} />
                      )}
                      <DetailItem
                        label={req.type === 'permissions' ? 'Duration' : 'Number of Days'}
                        value={req.daysOrHours}
                      />
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

                    {req.approverComments ? (
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailBlockLabel}>Approver Comments</Text>
                        <Text style={styles.detailBlockTextHighlight}>{req.approverComments}</Text>
                      </View>
                    ) : null}

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
          })
        )}
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
