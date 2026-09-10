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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './LoginScreen.styles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = () => {
    if (!password || password.length < 8) {
      setPasswordError('Password must contain a minimum of 8 characters.');
      return;
    }
    setPasswordError('');
    navigation && navigation.navigate('EmployeeDashboard');
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

      <View style={styles.logoBadge}>
        <View style={styles.logoIcon} />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to manage leaves & attendance</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          placeholderTextColor="#F2F2F2"
          keyboardType="email-address"
          autoCapitalize="none"
        />
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
    </KeyboardAvoidingView>
  );
}
