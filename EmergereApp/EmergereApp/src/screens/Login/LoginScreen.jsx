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
        source={require('../../../assets/emergere-login-logo.png')}
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
          {password.length > 0 && (
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} activeOpacity={0.7}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
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


    </KeyboardAvoidingView>
  );
}
