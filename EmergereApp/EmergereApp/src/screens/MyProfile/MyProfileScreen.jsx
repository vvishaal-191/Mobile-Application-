// src/screens/MyProfile/MyProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import ScreenHeader from '../../components/ScreenHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './MyProfileScreen.styles';

export default function MyProfileScreen({ navigation, route }) {
  const [isEditing, setIsEditing] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState(
    route?.params?.employmentStatus ||
      (typeof global !== 'undefined' && global.EMPLOYMENT_STATUS) ||
      'Active'
  );

  useEffect(() => {
    if (route?.params?.employmentStatus) {
      setEmploymentStatus(route.params.employmentStatus);
    } else if (typeof global !== 'undefined' && global.EMPLOYMENT_STATUS) {
      setEmploymentStatus(global.EMPLOYMENT_STATUS);
    }
    if (typeof global !== 'undefined' && global.USER_PROFILE) {
      const p = global.USER_PROFILE;
      setProfileHeader({
        name: p.name || 'Priya Sharma',
        role: p.role || 'Senior Software Engineer',
        employeeId: p.employeeId || 'EMP-2024-0156',
      });
      setJobInfo({
        department: p.department || 'IT',
        team: p.team || 'Development',
        reportingManager: p.reportingManager || 'Rahul Sharma',
        workLocation: p.workLocation || 'Bangalore',
        joiningDate: p.joiningDate || 'Mar 15, 2022',
      });
      setContactInfo({
        email: p.email || 'priya.sharma@emergere.com',
        phone: p.phone || '+91 98765 43210',
      });
    }
  }, [route?.params?.employmentStatus]);

  const [profileHeader, setProfileHeader] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      name: p.name || 'Priya Sharma',
      role: p.role || 'Senior Software Engineer',
      employeeId: p.employeeId || 'EMP-2024-0156',
    };
  });

  const [jobInfo, setJobInfo] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      department: p.department || 'IT',
      team: p.team || 'Development',
      reportingManager: p.reportingManager || 'Rahul Sharma',
      workLocation: p.workLocation || 'Bangalore',
      joiningDate: p.joiningDate || 'Mar 15, 2022',
    };
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const p = (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    return {
      email: p.email || 'priya.sharma@emergere.com',
      phone: p.phone || '+91 98765 43210',
    };
  });

  const [editProfileHeaderForm, setEditProfileHeaderForm] = useState({ ...profileHeader });
  const [editJobForm, setEditJobForm] = useState({ ...jobInfo });
  const [editContactForm, setEditContactForm] = useState({ ...contactInfo });

  const getInitials = (nameStr) => {
    if (!nameStr) return 'PS';
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
      <ScreenHeader
        title="My Profile"
        subtitle="Employee Details"
        onBack={() => navigation && navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <View style={styles.cardHeaderRightEdit}>
            {!isEditing ? (
              <TouchableOpacity style={styles.editBtn} onPress={handleEditPress}>
                <Feather name="edit-2" size={14} color="#2F6BFF" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionBtnGroup}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelPress}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSavePress}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!isEditing ? (
            <>
              <Avatar initials={getInitials(profileHeader.name)} size={90} />
              <Text style={styles.name}>{profileHeader.name}</Text>
              <Text style={styles.role}>{profileHeader.role}</Text>
              <View style={styles.idChip}>
                <Text style={styles.idText}>{profileHeader.employeeId}</Text>
              </View>
            </>
          ) : (
            <View style={styles.editFormContainer}>
              <Text style={styles.sectionTitle}>PROFILE SUMMARY</Text>

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
        </Card>

        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Employment Status</Text>
            <StatusBadge
              label={employmentStatus}
              tone={employmentStatus === 'Active' ? 'success' : 'danger'}
            />
          </View>
        </Card>

        {/* JOB INFORMATION CARD */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>JOB INFORMATION</Text>

          {!isEditing ? (
            <>
              <InfoRow label="Department" value={jobInfo.department} />
              <InfoRow label="Team" value={jobInfo.team} />
              <InfoRow label="Reporting Manager" value={jobInfo.reportingManager} link />
              <InfoRow label="Work Location" value={jobInfo.workLocation} />
              <InfoRow label="Joining Date" value={jobInfo.joiningDate} />
            </>
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
        </Card>

        {/* CONTACT INFORMATION CARD */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>

          {!isEditing ? (
            <>
              <InfoRow label="Email" value={contactInfo.email} />
              <InfoRow label="Phone" value={contactInfo.phone} />
            </>
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
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => go('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar active="Profile" onNavigate={go} />
    </View>
  );
}

function InfoRow({ label, value, link }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, link && styles.infoValueLink]}>{value}</Text>
    </View>
  );
}
