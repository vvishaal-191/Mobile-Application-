// src/screens/MyProfile/MyProfileScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './MyProfileScreen.styles';

/**
 * Parses a date string like "Sep 10, 2026" into a Date object (midnight local).
 */
function parseLeaveDateString(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}

/**
 * Returns the next working day (Mon–Fri) after the given date.
 */
function nextWorkingDay(date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

/**
 * Computes the employment status based on the global leave schedule.
 */
function computeEmploymentStatus() {
  if (typeof global === 'undefined') return 'Active';

  const schedule = global.LEAVE_STATUS_SCHEDULE;
  if (!schedule) return global.EMPLOYMENT_STATUS || 'Active';

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const from = parseLeaveDateString(schedule.fromDate);
  const to = parseLeaveDateString(schedule.toDate);

  if (!from) return global.EMPLOYMENT_STATUS || 'Active';

  // End of leave period = next working day after toDate (or fromDate if no toDate)
  const leaveEnd = to ? to : from;
  const resumeDay = nextWorkingDay(leaveEnd);

  if (todayMidnight >= from && todayMidnight < resumeDay) {
    global.EMPLOYMENT_STATUS = 'Inactive';
    return 'Inactive';
  } else if (todayMidnight >= resumeDay) {
    global.EMPLOYMENT_STATUS = 'Active';
    global.LEAVE_STATUS_SCHEDULE = null;
    return 'Active';
  }

  return global.EMPLOYMENT_STATUS || 'Active';
}

export default function MyProfileScreen({ navigation, route }) {
  const [isEditing, setIsEditing] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState(
    route?.params?.employmentStatus ||
      computeEmploymentStatus() ||
      'Active'
  );

  const refreshStatus = useCallback(() => {
    const computed = computeEmploymentStatus();
    setEmploymentStatus(computed);
  }, []);

  useEffect(() => {
    refreshStatus();

    if (route?.params?.employmentStatus) {
      setEmploymentStatus(route.params.employmentStatus);
    }
    if (typeof global !== 'undefined' && global.USER_PROFILE) {
      const p = global.USER_PROFILE;
      setProfileHeader({
        name: p.name || 'John Doe',
        role: p.role || 'Senior Software Engineer',
        employeeId: p.employeeId || 'EMP-2024-0101',
      });
      setJobInfo({
        department: p.department || 'Engineering',
        team: p.team || 'Mobile Development',
        reportingManager: p.reportingManager || 'Vishnu Kumar',
        workLocation: p.workLocation || 'Bangalore - Tech Park',
        joiningDate: p.joiningDate || '15-Jan-2024',
      });
      setContactInfo({
        email: p.email || 'john@gmail.com',
        phone: p.phone || '+91 98765 11001',
      });
    }
  }, [route?.params?.employmentStatus, refreshStatus]);

  const [profileHeader, setProfileHeader] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      name: p.name || 'John Doe',
      role: p.role || 'Senior Software Engineer',
      employeeId: p.employeeId || 'EMP-2024-0101',
    };
  });

  const [jobInfo, setJobInfo] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      department: p.department || 'Engineering',
      team: p.team || 'Mobile Development',
      reportingManager: p.reportingManager || 'Vishnu Kumar',
      workLocation: p.workLocation || 'Bangalore - Tech Park',
      joiningDate: p.joiningDate || '15-Jan-2024',
    };
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      email: p.email || 'john@gmail.com',
      phone: p.phone || '+91 98765 11001',
    };
  });

  const [editProfileHeaderForm, setEditProfileHeaderForm] = useState({ ...profileHeader });
  const [editJobForm, setEditJobForm] = useState({ ...jobInfo });
  const [editContactForm, setEditContactForm] = useState({ ...contactInfo });

  const getInitials = (nameStr) => {
    if (!nameStr) return 'JD';
    const parts = nameStr.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const go = (screen) => navigation && navigation.navigate(screen);

  const handleEditPress = () => {
    setEditProfileHeaderForm({ ...profileHeader });
    setEditJobForm({ ...jobInfo });
    setEditContactForm({ ...contactInfo });
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setProfileHeader({ ...editProfileHeaderForm });
    setJobInfo({ ...editJobForm });
    setContactInfo({ ...editContactForm });
    setIsEditing(false);

    const updatedProfile = {
      name: editProfileHeaderForm.name,
      role: editProfileHeaderForm.role,
      employeeId: editProfileHeaderForm.employeeId,
      initials: getInitials(editProfileHeaderForm.name),
      department: editJobForm.department,
      team: editJobForm.team,
      reportingManager: editJobForm.reportingManager,
      workLocation: editJobForm.workLocation,
      joiningDate: editJobForm.joiningDate,
      email: editContactForm.email,
      phone: editContactForm.phone,
    };

    if (typeof global !== 'undefined') {
      global.USER_PROFILE = updatedProfile;
    }
  };

  const handleCancelPress = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {/* Header Gradient Banner - Flush to top with vibrant blue gradient */}
        <View style={styles.headerBanner}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (navigation && navigation.canGoBack ? navigation.goBack() : go('Dashboard'))}
            activeOpacity={0.8}
            accessibilityLabel="Back"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Employee Details</Text>
        </View>

        {/* MAIN PROFILE HERO CARD */}
        <View style={styles.profileHeroCard}>
          {/* Decorative Flowing Wave Elements matching Image 2 */}
          <View style={styles.cardWaveLeft1} pointerEvents="none" />
          <View style={styles.cardWaveLeft2} pointerEvents="none" />
          <View style={styles.cardWaveRight1} pointerEvents="none" />
          <View style={styles.cardWaveRight2} pointerEvents="none" />

          {/* Top Right Edit Buttons */}
          <View style={styles.editBtnWrap}>
            {!isEditing ? (
              <TouchableOpacity style={styles.editBtn} onPress={handleEditPress} activeOpacity={0.8}>
                <Feather name="edit-2" size={13} color="#0066FF" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.saveCancelGroup}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelPress} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSavePress} activeOpacity={0.8}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!isEditing ? (
            <>
              {/* Avatar with Camera Badge */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{getInitials(profileHeader.name)}</Text>
                </View>
                <View style={styles.cameraBadge}>
                  <Feather name="camera" size={12} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.name}>{profileHeader.name}</Text>
              <Text style={styles.role}>{profileHeader.role}</Text>
              <View style={styles.idChip}>
                <Text style={styles.idText}>{profileHeader.employeeId}</Text>
              </View>
            </>
          ) : (
            <View style={styles.editFormContainer}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfileHeaderForm.name}
                  onChangeText={(val) => setEditProfileHeaderForm({ ...editProfileHeaderForm, name: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Designation / Role</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfileHeaderForm.role}
                  onChangeText={(val) => setEditProfileHeaderForm({ ...editProfileHeaderForm, role: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Employee ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={editProfileHeaderForm.employeeId}
                  onChangeText={(val) => setEditProfileHeaderForm({ ...editProfileHeaderForm, employeeId: val })}
                />
              </View>
            </View>
          )}
        </View>

        {/* EMPLOYMENT STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={styles.iconBadge42}>
              <Feather name="briefcase" size={20} color="#0066FF" />
            </View>
            <View>
              <Text style={styles.statusTitle}>Employment Status</Text>
              <Text style={styles.statusSub}>Current working status</Text>
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{employmentStatus}</Text>
          </View>
        </View>

        {/* JOB INFORMATION CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge42}>
              <Feather name="briefcase" size={20} color="#0066FF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>JOB INFORMATION</Text>
              <Text style={styles.sectionSub}>Work details and organization information</Text>
            </View>
          </View>

          {!isEditing ? (
            <View style={styles.rowsContainer}>
              <ProfileRow icon="layers" label="Department" value={jobInfo.department} />
              <ProfileRow icon="users" label="Team" value={jobInfo.team} />
              <ProfileRow icon="user" label="Reporting Manager" value={jobInfo.reportingManager} link />
              <ProfileRow icon="map-pin" label="Work Location" value={jobInfo.workLocation} />
              <ProfileRow icon="calendar" label="Joining Date" value={jobInfo.joiningDate} isLast />
            </View>
          ) : (
            <View style={styles.editFormContainer}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                  style={styles.textInput}
                  value={editJobForm.department}
                  onChangeText={(val) => setEditJobForm({ ...editJobForm, department: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Team</Text>
                <TextInput
                  style={styles.textInput}
                  value={editJobForm.team}
                  onChangeText={(val) => setEditJobForm({ ...editJobForm, team: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Reporting Manager</Text>
                <TextInput
                  style={styles.textInput}
                  value={editJobForm.reportingManager}
                  onChangeText={(val) => setEditJobForm({ ...editJobForm, reportingManager: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Work Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={editJobForm.workLocation}
                  onChangeText={(val) => setEditJobForm({ ...editJobForm, workLocation: val })}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Joining Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={editJobForm.joiningDate}
                  onChangeText={(val) => setEditJobForm({ ...editJobForm, joiningDate: val })}
                />
              </View>
            </View>
          )}
        </View>

        {/* CONTACT INFORMATION CARD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge42}>
              <Feather name="mail" size={20} color="#0066FF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
              <Text style={styles.sectionSub}>Your contact details</Text>
            </View>
          </View>

          {!isEditing ? (
            <View style={styles.rowsContainer}>
              <ProfileRow icon="mail" label="Email" value={contactInfo.email} />
              <ProfileRow icon="phone" label="Phone" value={contactInfo.phone} isLast />
            </View>
          ) : (
            <View style={styles.editFormContainer}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editContactForm.email}
                  onChangeText={(val) => setEditContactForm({ ...editContactForm, email: val })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={editContactForm.phone}
                  onChangeText={(val) => setEditContactForm({ ...editContactForm, phone: val })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          {/* Logout Button matching Image 2 */}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => go('Login')} activeOpacity={0.85}>
            <View style={styles.logoutLeft}>
              <Feather name="log-out" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavBar active="Profile" onNavigate={go} />
    </View>
  );
}

function ProfileRow({ icon, label, value, link, isLast }) {
  return (
    <View style={[styles.dataRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.rowLeft}>
        <View style={styles.miniIconBadge}>
          <Feather name={icon} size={15} color="#0066FF" />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, link && styles.rowValueLink]}>{value}</Text>
    </View>
  );
}
