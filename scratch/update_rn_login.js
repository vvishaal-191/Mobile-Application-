const fs = require('fs');
const path = require('path');

const rnLoginScreenCode = `// src/screens/Login/LoginScreen.jsx
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
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'employee@123',
    role: 'Senior Software Engineer',
    empId: 'EMP-2024-0101',
    initials: 'JD',
    reportingManager: 'Vishnu Kumar',
    phone: '+91 98765 11001',
  },
  {
    name: 'Jack Ryan',
    email: 'jack@gmail.com',
    password: 'employee@123',
    role: 'QA Engineer',
    empId: 'EMP-2024-0102',
    initials: 'JR',
    reportingManager: 'Ram Prasad',
    phone: '+91 98765 11002',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@gmail.com',
    password: 'employee@123',
    role: 'UI/UX Designer',
    empId: 'EMP-2024-0103',
    initials: 'SR',
    reportingManager: 'Rahul Sharma',
    phone: '+91 98765 11003',
  },
];

const PREDEFINED_MANAGERS = [
  {
    name: 'Vishnu Kumar',
    email: 'vishnu@gmail.com',
    password: 'manager@123',
    role: 'Engineering Manager',
    empId: 'MGR-2024-0010',
    initials: 'VK',
    reportingManager: 'Director of Engineering',
    phone: '+91 98765 22001',
  },
  {
    name: 'Ram Prasad',
    email: 'ram@gmail.com',
    password: 'manager@123',
    role: 'Technical Lead / Manager',
    empId: 'MGR-2024-0011',
    initials: 'RP',
    reportingManager: 'Director of Engineering',
    phone: '+91 98765 22002',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    password: 'manager@123',
    role: 'Operations Manager',
    empId: 'MGR-2024-0012',
    initials: 'RS',
    reportingManager: 'Vice President',
    phone: '+91 98765 22003',
  },
];

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [forgotError, setForgotError] = useState('');

  const isPasswordMatch = (expected, actual) => {
    if (!expected || !actual) return false;
    const exp = String(expected).trim();
    const act = String(actual).trim();
    return exp === act || exp.toLowerCase() === act.toLowerCase();
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

    // 1. Check Manager Credentials (vishnu@gmail.com, ram@gmail.com, rahul@gmail.com)
    const matchedManager = PREDEFINED_MANAGERS.find(
      (m) => m.email.toLowerCase() === trimmedEmail
    );
    if (matchedManager && isPasswordMatch(matchedManager.password, trimmedPass)) {
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
    }

    // 2. Check Employee Credentials (john@gmail.com, jack@gmail.com, sneha@gmail.com)
    const matchedEmployee = PREDEFINED_EMPLOYEES.find(
      (emp) => emp.email.toLowerCase() === trimmedEmail
    );
    if (matchedEmployee && isPasswordMatch(matchedEmployee.password, trimmedPass)) {
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
    }

    // Strict validation failed
    setAuthError('Invalid email address or password. Please check your credentials and try again.');
  };

  const handleOpenForgotModal = () => {
    setForgotEmail('');
    setForgotContact('');
    setForgotError('');
    setShowForgotModal(true);
  };

  const handleConfirmForgot = () => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const phoneRegex = /^\\d{10}$/;

    if (!forgotEmail || !emailRegex.test(forgotEmail)) {
      setForgotError('Please enter a valid registered Email ID.');
      return;
    }

    if (!forgotContact || !phoneRegex.test(forgotContact.replace(/[\\s-]/g, ''))) {
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
      <StatusBar barStyle="light-content" backgroundColor="#0056FF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Royal Blue Banner with Architectural Graphic */}
        <View style={styles.headerBanner}>
          {/* Header Texts */}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              Welcome <Text style={styles.headerTitleAccent}>Back</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Sign in to continue to your account</Text>
            <View style={styles.pillBar}>
              <View style={styles.pillWhite} />
              <View style={styles.pillCyan} />
            </View>
          </View>
        </View>

        {/* Centered Overlapping Logo Card */}
        <View style={styles.logoCardWrap}>
          <View style={styles.logoCard}>
            <Image
              source={require('../../../assets/tech-circuit-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Floating Main Form Card */}
        <View style={styles.formCard}>
          {!!authError && (
            <View style={styles.authErrorBox}>
              <Feather name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.authErrorText}>{authError}</Text>
            </View>
          )}

          {/* Username or Email Input */}
          <View style={styles.inputWrap}>
            <Feather name="user" size={18} color="#0066FF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputField}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setAuthError('');
              }}
              placeholder="Username or Email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color="#0066FF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInputField}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text.length >= 8) setPasswordError('');
              }}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              activeOpacity={0.7}
              style={styles.eyeBtn}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
          {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          {/* Remember Me and Forgot Password Row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, !rememberMe && styles.checkboxUnchecked]}>
                {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenForgotModal} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginButtonText}>Login</Text>
            <View style={styles.arrowCircle}>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
        </View>

        {/* Bottom Decorative Wave Area */}
        <View style={styles.bottomWaveDecor}>
          <View style={styles.waveOrb1} />
          <View style={styles.waveOrb2} />
          <View style={styles.waveOrb3} />
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
}
`;

const rnLoginStylesCode = `// src/screens/Login/LoginScreen.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF5FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    justifyContent: 'flex-start',
  },
  headerBanner: {
    width: '100%',
    height: 220,
    backgroundColor: '#0056FF',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: Platform.OS === 'ios' ? 54 : 38,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    zIndex: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  headerTitleAccent: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.88)',
    marginBottom: 10,
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  pillWhite: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pillCyan: {
    width: 22,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.55)',
  },
  logoCardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -46,
    marginBottom: 14,
    zIndex: 15,
  },
  logoCard: {
    width: 92,
    height: 92,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0050DC',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  logoImage: {
    width: 58,
    height: 58,
  },
  formCard: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    shadowColor: '#0046C8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  authErrorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authErrorText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  inputWrap: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 10,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    height: '100%',
    fontSize: 14.5,
    fontWeight: '500',
    color: '#0F172A',
  },
  eyeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 2,
    marginTop: 4,
    marginBottom: 20,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
  },
  rememberText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  forgotText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0066FF',
  },
  loginButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 8,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
    marginLeft: 24,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 4,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  bottomWaveDecor: {
    width: '100%',
    height: 100,
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden',
  },
  waveOrb1: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
  },
  waveOrb2: {
    position: 'absolute',
    bottom: 40,
    right: 50,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 102, 255, 0.25)',
  },
  waveOrb3: {
    position: 'absolute',
    bottom: 10,
    right: 120,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalErrorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  modalErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalField: {
    marginBottom: 14,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalConfirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
`;

fs.writeFileSync(path.resolve('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx'), rnLoginScreenCode, 'utf8');
console.log('Updated LoginScreen.jsx');

fs.writeFileSync(path.resolve('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js'), rnLoginStylesCode, 'utf8');
console.log('Updated LoginScreen.styles.js');
