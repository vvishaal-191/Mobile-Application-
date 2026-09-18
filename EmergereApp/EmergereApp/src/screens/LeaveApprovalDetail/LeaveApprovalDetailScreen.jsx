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

  // Retrieve employee profile as displayed on the Employee Dashboard
  const profile = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  const dashboardEmpName = profile.name || 'Priya Sharma';

  // Fallback to latest submitted request if route param is absent
  const rawPerson =
    route?.params?.person ||
    (typeof global !== 'undefined' && global.LATEST_REQUEST) ||
    DEFAULT_PERSON;

  const userRole = typeof global !== 'undefined' ? global.USER_ROLE : null;
  const isDashboardUser =
    userRole === 'employee' && (rawPerson.isSelf || !rawPerson.name);

  const person = {
    ...rawPerson,
    name: isDashboardUser ? dashboardEmpName : rawPerson.name,
    role: isDashboardUser
      ? profile.role || rawPerson.role || 'Senior Software Engineer'
      : rawPerson.role || 'Senior Software Engineer',
    empId: isDashboardUser
      ? profile.employeeId || rawPerson.empId || 'EMP-2024-0156'
      : rawPerson.empId || 'EMP-2024-0156',
    initials: isDashboardUser
      ? profile.initials ||
        dashboardEmpName
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) ||
        'PS'
      : rawPerson.initials || 'PS',
  };

  const isPermission = !!(
    person.isPermission ||
    person.duration ||
    person.schedule ||
    person.type === 'Early Going' ||
    person.type === 'Late Coming' ||
    person.leaveType === 'Early Going' ||
    person.leaveType === 'Late Coming' ||
    person.permissionType
  );

  const initialDecision = route?.params?.decision || person.status || 'Pending';
  const [decision, setDecision] = useState(initialDecision);

  const isApproved = (decision || '').toLowerCase() === 'approved';
  const isRejected = (decision || '').toLowerCase() === 'rejected';
  const isDecided = isApproved || isRejected;

  const handleDone = () => {
    const finalDecision = isDecided ? (isApproved ? 'Approved' : 'Rejected') : 'Approved';
    const managerName =
      (typeof global !== 'undefined' && global.USER_PROFILE?.reportingManager) ||
      'Rahul Sharma';
    const employeeName = person.name || 'Employee';
    const reqType = person.leaveType || person.type || (isPermission ? 'Permission' : 'Leave');

    // Build notification
    const notification = {
      id: Date.now().toString(),
      icon: finalDecision === 'Approved' ? 'check-circle' : 'x-circle',
      color: finalDecision === 'Approved' ? '#1FAE6E' : '#E5484D',
      text: `Your ${reqType} request was ${finalDecision} by ${managerName}.`,
      employeeName,
      time: 'Just now',
      unread: true,
    };

    // Push to global stores
    if (typeof global !== 'undefined') {
      if (!global.NOTIFICATIONS) global.NOTIFICATIONS = [];
      global.NOTIFICATIONS.unshift(notification);

      if (isPermission) {
        global.LAST_PERMISSION_DECISION = {
          id: person.id || '1',
          status: finalDecision,
          type: reqType,
          name: employeeName,
          schedule: person.schedule,
          duration: person.duration,
        };
        if (global.PERMISSION_REQUESTS) {
          global.PERMISSION_REQUESTS = global.PERMISSION_REQUESTS.map((r) =>
            r.id === person.id ? { ...r, status: finalDecision.toLowerCase() } : r
          );
        }
      } else {
        global.LAST_LEAVE_DECISION = {
          id: person.id || '1',
          status: finalDecision,
          name: employeeName,
          type: reqType,
        };
        if (global.LEAVE_REQUESTS) {
          global.LEAVE_REQUESTS = global.LEAVE_REQUESTS.map((r) =>
            r.id === person.id ? { ...r, status: finalDecision.toLowerCase() } : r
          );
        }
      }
    }

    if (navigation) {
      // Navigate back to Manager Dashboard
      navigation.navigate('ManagerDashboard', {
        requestId: person.id || '1',
        newStatus: finalDecision,
        remarks: remarks,
        isPermission,
        permissionType: reqType,
        person: {
          ...person,
          status: finalDecision,
        },
      });
    }
  };

  const firstName = person.name ? person.name.split(' ')[0] : 'Employee';

  const subHeader = isPermission
    ? `${person.leaveType || person.type || person.permissionType || 'Permission'} Application`
    : `${person.leaveType || 'Casual Leave'} Application`;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Request Detail"
        subtitle={subHeader}
        onBack={() => {
          if (isDecided) {
            handleDone();
          } else if (navigation) {
            navigation.goBack();
          }
        }}
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

        {isPermission ? (
          <Card style={styles.specsCard}>
            <Text style={styles.sectionTitle}>PERMISSION SPECIFICS</Text>
            <DetailRow
              label="Permission Type"
              value={person.leaveType || person.type || person.permissionType || 'Early Going'}
              link
            />
            <DetailRow
              label="Schedule"
              value={
                person.schedule ||
                (person.fromDate ? `${person.fromDate} (${person.duration || '30 Mins'})` : 'Sep 04 (10:00 - 10:30 AM)')
              }
            />
            <DetailRow
              label="Duration"
              value={person.totalDays || person.duration || '30 Mins'}
              bold
            />
            <DetailRow
              label="Emergency Contact"
              value={
                person.emergencyContact ||
                person.approvingManager ||
                '+91 98765 22003'
              }
            />

            <View style={styles.reasonBlock}>
              <Text style={styles.reasonLabel}>Reason for Permission</Text>
              <Text style={styles.reasonText}>
                {person.reason || 'Doctor appointment checkup'}
              </Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.specsCard}>
            <Text style={styles.sectionTitle}>LEAVE SPECIFICS</Text>
            <DetailRow label="Leave Type" value={person.leaveType || 'Casual Leave'} link />
            <DetailRow label="From Date" value={person.fromDate || 'Sep 10, 2026'} />
            <DetailRow label="To Date" value={person.toDate || 'Sep 11, 2026'} />
            <DetailRow label="Total Days" value={person.totalDays || '2 Days'} bold />
            <DetailRow
              label="Emergency Contact"
              value={
                person.emergencyContact ||
                person.contact ||
                profile.phone ||
                '+91 98765 43210'
              }
            />

            <View style={styles.reasonBlock}>
              <Text style={styles.reasonLabel}>Reason for Leave</Text>
              <Text style={styles.reasonText}>
                {person.reason ||
                  "Family function - attending sister's wedding ceremony in Bangalore."}
              </Text>
            </View>
          </Card>
        )}

        <Card style={styles.pathCard}>
          <Text style={styles.sectionTitle}>APPROVAL PATH</Text>
          <View style={styles.pathRow}>
            <Text style={styles.pathDone}>{`${firstName} (Applied)`}</Text>
            <Text style={styles.pathArrow}>›</Text>
            {isApproved ? (
              <Text style={[styles.pathDone, { color: '#1FAE6E', fontWeight: '700' }]}>
                Manager (Approved)
              </Text>
            ) : isRejected ? (
              <Text style={[styles.pathPending, { color: '#E5484D', fontWeight: '700' }]}>
                Manager (Rejected)
              </Text>
            ) : (
              <Text style={styles.pathPending}>Manager (Pending)</Text>
            )}
            <Text style={styles.pathArrow}>›</Text>
            <Text style={styles.pathFuture}>HR Desk</Text>
          </View>
        </Card>

        {isDecided ? (
          <View
            style={[
              styles.decisionBanner,
              isApproved ? styles.decisionBannerApproved : styles.decisionBannerRejected,
            ]}
          >
            <Text
              style={[
                styles.decisionBannerIcon,
                { color: isApproved ? '#1FAE6E' : '#E5484D' },
              ]}
            >
              {isApproved ? '✓' : '✕'}
            </Text>
            <Text
              style={[
                styles.decisionBannerText,
                { color: isApproved ? '#0E6245' : '#8A1F1D' },
              ]}
            >
              {isApproved ? 'Approved by Manager' : 'Rejected by Manager'}
            </Text>
          </View>
        ) : null}

        <Text style={styles.remarksLabel}>Manager Remarks (Optional)</Text>
        <TextInput
          style={styles.remarksInput}
          placeholder="Write any comments here..."
          placeholderTextColor="#9AA3B2"
          multiline
          value={remarks}
          onChangeText={setRemarks}
        />

        {isDecided ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => {
                const toggled = isApproved ? 'Rejected' : 'Approved';
                setDecision(toggled);
              }}
            >
              <Text style={styles.changeBtnText}>
                {isApproved ? 'Change to Reject' : 'Change to Approve'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleDone}
            >
              <Text style={styles.doneBtnText}>Done →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => setDecision('Rejected')}
            >
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => setDecision('Approved')}
            >
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BottomNavBar
        active="Dashboard"
        onNavigate={(screen) =>
          navigation && navigation.navigate(screen === 'Dashboard' ? 'ManagerDashboard' : screen)
        }
      />
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
