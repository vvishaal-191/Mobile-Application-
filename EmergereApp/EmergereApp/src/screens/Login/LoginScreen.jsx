import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './LoginScreen.styles';

const PREDEFINED_EMPLOYEES = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@emergere.com',
    password: 'Employee@123',
    role: 'Senior Software Engineer',
    empId: 'EMP-2024-0156',
    initials: 'PS',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 43210',
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@emergere.com',
    password: 'Employee@123',
    role: 'UI/UX Designer',
    empId: 'EMP-2024-0142',
    initials: 'AP',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 43211',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@emergere.com',
    password: 'Employee@123',
    role: 'QA Engineer',
    empId: 'EMP-2024-0188',
    initials: 'SR',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 43212',
  },
  {
    name: 'Rohit Verma',
    email: 'rohit.verma@emergere.com',
    password: 'Employee@123',
    role: 'Backend Developer',
    empId: 'EMP-2024-0165',
    initials: 'RV',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 43213',
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@emergere.com',
    password: 'Employee@123',
    role: 'Frontend Developer',
    empId: 'EMP-2024-0173',
    initials: 'AI',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 43214',
  },
];

const PREDEFINED_MANAGERS = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@emergere.com',
    altEmail: 'manager@emergere.com',
    password: 'Manager@123',
    role: 'Engineering Lead / Manager',
    empId: 'MGR-2024-0012',
    initials: 'RS',
    reportingManager: 'Board of Directors',
    phone: '+91 98765 00001',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@emergere.com',
    password: 'Manager@123',
    role: 'Operations Manager',
    empId: 'MGR-2024-0008',
    initials: 'VM',
    reportingManager: 'Board of Directors',
    phone: '+91 98765 00002',
  },
  {
    name: 'Neha Kapoor',
    email: 'neha.kapoor@emergere.com',
    password: 'Manager@123',
    role: 'Project & HR Manager',
    empId: 'MGR-2024-0015',
    initials: 'NK',
    reportingManager: 'Board of Directors',
    phone: '+91 98765 00003',
  },
];

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  // Credentials Selection Modal state
  const [showEmpModal, setShowEmpModal] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSelectAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setAuthError('');
    setPasswordError('');
    setShowEmpModal(false);
  };

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    setAuthError('');
    setPasswordError('');

    if (!trimmedEmail) {
      setAuthError('Please enter your email address.');
      return;
    }

    if (!trimmedPass) {
      setAuthError('Please enter your password.');
      return;
    }

    // 1. Check Manager Credentials (3 predefined manager accounts)
    const matchedManager = PREDEFINED_MANAGERS.find(
      (m) => m.email.toLowerCase() === trimmedEmail || (m.altEmail && m.altEmail.toLowerCase() === trimmedEmail)
    );
    if (matchedManager) {
      const validManagerPasswords = [matchedManager.password, 'Manager@123', 'manager123'];
      if (validManagerPasswords.includes(trimmedPass)) {
        if (typeof global !== 'undefined') {
          global.USER_ROLE = 'manager';
          global.USER_PROFILE = {
            name: matchedManager.name,
            role: matchedManager.role,
            employeeId: matchedManager.empId,
            initials: matchedManager.initials,
            email: matchedManager.email,
            department: 'Management',
            team: 'Leadership',
            workLocation: 'Bangalore',
            joiningDate: 'Jun 01, 2022',
            phone: matchedManager.phone,
          };
        }
        navigation && navigation.navigate('ManagerDashboard');
        return;
      } else {
        setAuthError('Invalid password for Manager account.');
        return;
      }
    }

    // 2. Check Employee Credentials (5 predefined employee emails)
    const matchedEmployee = PREDEFINED_EMPLOYEES.find(
      (emp) => emp.email.toLowerCase() === trimmedEmail
    );

    if (matchedEmployee) {
      const validEmployeePasswords = [matchedEmployee.password, 'Employee@123', 'employee123', 'password123'];
      if (validEmployeePasswords.includes(trimmedPass)) {
        if (typeof global !== 'undefined') {
          global.USER_ROLE = 'employee';
          global.USER_PROFILE = {
            ...matchedEmployee,
            department: 'IT',
            team: 'Development',
            workLocation: 'Bangalore',
            joiningDate: 'Mar 15, 2022',
          };
        }
        navigation && navigation.navigate('EmployeeDashboard');
        return;
      } else {
        setAuthError('Invalid password for employee account.');
        return;
      }
    }

    // Neither valid manager nor valid employee
    setAuthError('Invalid email or password. Please use the search icon to pick a predefined employee or manager account.');
  };

  const handleOpenForgotModal = () => {
    setForgotEmail('');
    setForgotContact('');
    setForgotError('');
    setShowForgotModal(true);
  };

  const handleConfirmForgot = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!forgotEmail || !emailRegex.test(forgotEmail)) {
      setForgotError('Please enter a valid registered Email ID.');
      return;
    }

    if (!forgotContact || !phoneRegex.test(forgotContact.replace(/[\s-]/g, ''))) {
      setForgotError('Please enter a valid 10-digit registered Contact Number.');
      return;
    }

    setForgotError('');
    setShowForgotModal(false);
    navigation && navigation.navigate('EmployeeDashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D47B5" />

      <Image
        source={require('../../../assets/emergere-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to manage leaves & attendance</Text>

      {!!authError && (
        <View style={styles.authErrorBox}>
          <Feather name="alert-circle" size={18} color="#E5484D" />
          <Text style={styles.authErrorText}>{authError}</Text>
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Email Address *</Text>
        <View style={styles.emailRow}>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setAuthError('');
            }}
            placeholder="Enter your email address"
            placeholderTextColor="#F2F2F2"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => setShowEmpModal(true)}
            activeOpacity={0.7}
            accessibilityLabel="Select predefined employee email"
          >
            <Feather name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text.length >= 8) setPasswordError('');
            }}
            placeholder="Enter your password"
            placeholderTextColor="#F2F2F2"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <TouchableOpacity
        style={styles.rememberRow}
        onPress={() => setRememberMe(!rememberMe)}
        activeOpacity={0.8}
      >
        <View style={styles.checkbox}>
          {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotWrap} onPress={handleOpenForgotModal}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Forgot Password?</Text>
              <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter your registered Email ID and Contact Number to verify your account.
            </Text>

            {!!forgotError && (
              <View style={styles.modalErrorBox}>
                <Text style={styles.modalErrorText}>{forgotError}</Text>
              </View>
            )}

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Email ID *</Text>
              <TextInput
                style={styles.modalInput}
                value={forgotEmail}
                onChangeText={(text) => {
                  setForgotEmail(text);
                  setForgotError('');
                }}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Contact Number *</Text>
              <TextInput
                style={styles.modalInput}
                value={forgotContact}
                onChangeText={(text) => {
                  setForgotContact(text);
                  setForgotError('');
                }}
                placeholder="Enter 10-digit contact number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowForgotModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmForgot}
              >
                <Text style={styles.modalConfirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Credentials Selection Modal (Employee & Manager) */}
      <Modal
        visible={showEmpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEmpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.empModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Login Credentials</Text>
              <TouchableOpacity onPress={() => setShowEmpModal(false)}>
                <Feather name="x" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Choose an account to sign in with predefined credentials:
            </Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Employee Credentials Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Employee</Text>
                <View style={[styles.sectionBadge, styles.sectionBadgeEmp]}>
                  <Text style={[styles.sectionBadgeText, styles.sectionBadgeEmpText]}>5 Accounts</Text>
                </View>
              </View>

              {PREDEFINED_EMPLOYEES.map((emp) => (
                <TouchableOpacity
                  key={emp.email}
                  style={styles.empItem}
                  onPress={() => handleSelectAccount(emp)}
                  activeOpacity={0.7}
                >
                  <View style={styles.empAvatar}>
                    <Text style={styles.empAvatarText}>{emp.initials}</Text>
                  </View>
                  <View style={styles.empInfo}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <Text style={styles.empRole}>{emp.role} • {emp.empId}</Text>
                    <Text style={styles.empEmail}>{emp.email}</Text>
                    <View style={styles.empPasswordRow}>
                      <Text style={styles.empPasswordLabel}>Password:</Text>
                      <Text style={styles.empPasswordVal}>{emp.password}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}

              {/* Manager Credentials Section */}
              <View style={[styles.sectionHeader, { marginTop: 16 }]}>
                <Text style={styles.sectionTitle}>Manager</Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>3 Accounts</Text>
                </View>
              </View>

              {PREDEFINED_MANAGERS.map((mgr) => (
                <TouchableOpacity
                  key={mgr.email}
                  style={styles.empItem}
                  onPress={() => handleSelectAccount(mgr)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.empAvatar, styles.empAvatarManager]}>
                    <Text style={styles.empAvatarText}>{mgr.initials}</Text>
                  </View>
                  <View style={styles.empInfo}>
                    <Text style={styles.empName}>{mgr.name}</Text>
                    <Text style={styles.empRole}>{mgr.role} • {mgr.empId}</Text>
                    <Text style={styles.empEmail}>{mgr.email}</Text>
                    <View style={styles.empPasswordRow}>
                      <Text style={styles.empPasswordLabel}>Password:</Text>
                      <Text style={styles.empPasswordVal}>{mgr.password}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
