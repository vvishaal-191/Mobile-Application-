const fs = require('fs');

// ==========================================
// 1. UPDATE ApplyPermissionScreen.jsx
// ==========================================
const jsxPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Replace date handlers with clean toggle / picker like ApplyLeaveScreen
const newJsxContent = `// src/screens/ApplyPermission/ApplyPermissionScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './ApplyPermissionScreen.styles';

const PERMISSION_TYPES = [
  'Early Going',
  'Late Coming',
  'Personal Work',
  'Official Work',
];

const DURATION_OPTIONS = [
  '1 Hour',
  '2 Hours',
  '3 Hours',
  '4 Hours',
  '5 Hours',
];

const MANAGERS = [
  'Vishnu (Reporting Manager)',
  'Ram (Reporting Manager)',
  'Rahul (Reporting Manager)',
];

/** Derive initials from a full name string */
function getInitials(name) {
  if (!name) return 'PS';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

/** Read the reporting manager from global profile and match to a MANAGERS entry */
function resolveDefaultManager() {
  const profile =
    (typeof global !== 'undefined' && global.USER_PROFILE) || {};
  const managerName = profile.reportingManager || 'Vishnu (Reporting Manager)';
  const match = MANAGERS.find((m) =>
    m.toLowerCase() === managerName.toLowerCase() ||
    managerName.toLowerCase().startsWith(m.toLowerCase()) ||
    m.toLowerCase().startsWith(managerName.toLowerCase())
  );
  return match || MANAGERS[0];
}

export default function ApplyPermissionScreen({ navigation }) {
  const [date, setDate] = useState('09/04/2026');
  const [permissionType, setPermissionType] = useState('Early Going');
  const [startTime, setStartTime] = useState('03:00 PM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [durationText, setDurationText] = useState('2 Hours');
  const [reason, setReason] = useState('');
  const [manager, setManager] = useState(resolveDefaultManager);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const go = (screen, params) => navigation && navigation.navigate(screen, params);

  const toggleDate = () => {
    const nextDate = date === '09/04/2026' ? '09/10/2026' : '09/04/2026';
    setDate(nextDate);
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm) {
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const calculateDurationText = (startStr, endStr) => {
    const startMin = parseTimeToMinutes(startStr);
    const endMin = parseTimeToMinutes(endStr);
    if (startMin === null || endMin === null) return '2 Hours';

    let diff = endMin - startMin;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    let result = '';
    if (hours > 0 && mins > 0) result = \`\${hours} Hr \${mins} Mins\`;
    else if (hours > 0) result = \`\${hours} Hour\${hours > 1 ? 's' : ''}\`;
    else result = \`\${mins} Mins\`;

    return result;
  };

  const handleStartTimeChange = (text) => {
    setStartTime(text);
    setDurationText(calculateDurationText(text, endTime));
  };

  const handleEndTimeChange = (text) => {
    setEndTime(text);
    setDurationText(calculateDurationText(startTime, text));
  };

  const handleSelectDuration = (val) => {
    setDurationText(val);
    setIsDurationOpen(false);
  };

  const handleSubmit = () => {
    const profile =
      (typeof global !== 'undefined' && global.USER_PROFILE) || {};
    const employeeName = profile.name || 'Sneha Reddy';
    const employeeInitials = profile.initials || getInitials(employeeName) || 'SR';
    const employeeId = profile.employeeId || 'EMP-2024-0103';
    const employeeRole = profile.role || 'UI/UX Designer';

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const managerDisplayName = manager.replace(' (Reporting Manager)', '');

    const cleanDuration = durationText ? durationText.replace(' (Auto-calculated)', '') : '2 Hours';

    const newRequest = {
      id: Date.now().toString(),
      initials: employeeInitials,
      name: employeeName,
      empId: employeeId,
      role: employeeRole,
      isPermission: true,
      type: permissionType,
      leaveType: permissionType,
      permissionType: permissionType,
      tag: permissionType,
      tagTone: 'purple',
      date: date,
      fromDate: date,
      toDate: date,
      startTime,
      endTime,
      schedule: \`\${date} (\${startTime} - \${endTime})\`,
      duration: cleanDuration,
      totalDays: cleanDuration,
      reason: reason || 'Personal work / Medical checkup',
      status: 'pending',
      appliedDate: todayStr,
      approverName: managerDisplayName,
      approvingManager: manager,
      approverComments: '',
      supportingDocs: 'None Attached',
      remark: \`Sent to \${managerDisplayName} for review.\`,
      typeTone: 'purple',
      emergencyContact: manager,
      contact: manager,
      subtitle: \`\${permissionType} Application\`,
      appliedPath: \`\${employeeName.split(' ')[0]} (Applied)\`,
      title: \`\${permissionType} (\${cleanDuration})\`,
      subtitleReq: \`\${date} • \${reason || 'Personal Work'}\`,
    };

    if (typeof global !== 'undefined') {
      if (!global.PERMISSION_REQUESTS) global.PERMISSION_REQUESTS = [];
      global.PERMISSION_REQUESTS.unshift(newRequest);
      global.LATEST_REQUEST = newRequest;
      global.LATEST_PERMISSION_REQUEST = newRequest;
    }

    setSubmittedRequest(newRequest);
    setShowSuccessModal(true);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {/* Header Gradient Banner - Flush to top */}
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

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Apply Permission</Text>
              <Text style={styles.headerSubtitle}>Request short duration permission</Text>
            </View>

            {/* 3D Calendar Illustration Badge */}
            <View style={styles.badgeContainer}>
              <View style={styles.calendarIllustrateBox}>
                <View style={styles.calendarHeaderBar} />
                <View style={styles.calendarRingsRow}>
                  <View style={styles.calendarRing} />
                  <View style={styles.calendarRing} />
                  <View style={styles.calendarRing} />
                </View>
                <View style={styles.calendarGrid}>
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                  <View style={styles.calendarCell} />
                </View>
                <View style={styles.clockBadge}>
                  <Feather name="clock" size={15} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Form Card */}
        <View style={styles.formCard}>
          {/* Date * (Consistent with Apply Leave interaction) */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.inputCard}
              activeOpacity={0.7}
              onPress={toggleDate}
            >
              <Text style={styles.cardInputText}>{date}</Text>
              <TouchableOpacity
                style={styles.calendarIconBtn}
                activeOpacity={0.7}
                onPress={toggleDate}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="calendar" size={18} color="#111827" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Permission Type * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Permission Type <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectCard, isTypeOpen && styles.selectCardActive]}
              onPress={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsDurationOpen(false);
                setIsManagerOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{permissionType}</Text>
              <Feather name={isTypeOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
            </TouchableOpacity>
            {isTypeOpen && (
              <View style={styles.dropdownContainer}>
                {PERMISSION_TYPES.map((t) => {
                  const isSelected = t === permissionType;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                      onPress={() => {
                        setPermissionType(t);
                        setIsTypeOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Duration * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Duration <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectCard, isDurationOpen && styles.selectCardActive]}
              onPress={() => {
                setIsDurationOpen(!isDurationOpen);
                setIsTypeOpen(false);
                setIsManagerOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{durationText}</Text>
              <Feather name={isDurationOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
            </TouchableOpacity>
            {isDurationOpen && (
              <View style={styles.dropdownContainer}>
                {DURATION_OPTIONS.map((d) => {
                  const isSelected = d === durationText;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                      onPress={() => handleSelectDuration(d)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Reason * */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Reason <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.textareaCard}>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                maxLength={500}
                placeholder="E.g., Medical checkup, personal work..."
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
              />
              <Text style={styles.charCounter}>{reason.length}/500</Text>
            </View>
          </View>

          {/* Approving Manager */}
          <View style={styles.field}>
            <Text style={styles.label}>Approving Manager</Text>
            <TouchableOpacity
              style={[styles.selectCard, isManagerOpen && styles.selectCardActive]}
              onPress={() => {
                setIsManagerOpen(!isManagerOpen);
                setIsTypeOpen(false);
                setIsDurationOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{manager}</Text>
              <Feather name={isManagerOpen ? "chevron-up" : "chevron-down"} size={18} color="#111827" />
            </TouchableOpacity>
            {isManagerOpen && (
              <View style={styles.dropdownContainer}>
                {MANAGERS.map((m) => {
                  const isSelected = m === manager;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                      onPress={() => {
                        setManager(m);
                        setIsManagerOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Submit Request Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Feather name="send" size={18} color="#FFFFFF" style={styles.submitIcon} />
            <Text style={styles.submitText}>Submit Request</Text>
          </TouchableOpacity>
        </View>

        {/* Extra scrollable bottom space */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Success Popup Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <View style={modalStyles.iconWrap}>
              <Feather name="check" size={32} color="#1FAE6E" />
            </View>
            <Text style={modalStyles.title}>Request Submitted!</Text>
            <Text style={modalStyles.message}>Your permission request has been submitted successfully.</Text>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={() => {
                setShowSuccessModal(false);
                if (navigation) {
                  navigation.navigate('History');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.buttonText}>View My Requests →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavBar active="Apply" onNavigate={(scr) => navigation && navigation.navigate(scr)} />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 6,
    borderColor: '#F0FDF4',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
`;

fs.writeFileSync(jsxPath, newJsxContent, 'utf8');
console.log('Updated ApplyPermissionScreen.jsx');

// ==========================================
// 2. UPDATE ApplyPermissionScreen.styles.js
// ==========================================
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

stylesContent = stylesContent.replace(
  `  field: {
    marginBottom: 18,
    position: 'relative',
  },
  dateField: {
    zIndex: 100,
  },`,
  `  field: {
    marginBottom: 18,
  },`
);

const oldRNCardStyles = /\/\* Dropdown Calendar Card[\s\S]*?\}\);?/;
const newRNCardStyles = `});`;

stylesContent = stylesContent.replace(oldRNCardStyles, newRNCardStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');

// ==========================================
// 3. HTML & CSS for Web (Consistent with Apply Leave)
// ==========================================
const permDateCardHtml = `<!-- Date * -->
            <div class="perm-field">
              <label class="perm-label">Date <span class="perm-required">*</span></label>
              <div class="perm-input-card" id="perm-date-card" onclick="openCalPicker('perm-date-picker')">
                <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
                <div class="perm-card-icon" id="perm-calendar-icon-btn" onclick="openCalPicker('perm-date-picker')" title="Choose date">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <label for="perm-date-picker" class="al-hidden-picker-label perm-hidden-picker-label">
                  <input type="date" id="perm-date-picker" value="2026-09-04" onchange="onPermDateChange(this.value)" />
                </label>
              </div>
            </div>`;

const permPickerCss = `
        /* Hidden Date Picker Overlay (Consistent with Apply Leave) */
        .perm-hidden-picker-label {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          opacity: 0;
          z-index: 2;
        }

        .perm-hidden-picker-label input[type="date"] {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
`;

const permPickerJs = `
        function openCalPicker(pickerId) {
          var picker = document.getElementById(pickerId);
          if (picker) {
            if (typeof picker.showPicker === 'function') {
              try {
                picker.showPicker();
              } catch (e) {
                picker.click();
              }
            } else {
              picker.click();
            }
          }
        }
        window.openCalPicker = openCalPicker;

        function onPermDateChange(val) {
          if (!val) return;
          var parts = val.split('-');
          if (parts.length === 3) {
            // Formats as MM/DD/YYYY matching Image 2 & Apply Permission layout
            var formatted = parts[1] + '/' + parts[2] + '/' + parts[0];
            var displayEl = document.getElementById('perm-date-display');
            if (displayEl) {
              if (displayEl.tagName === 'INPUT') displayEl.value = formatted;
              else displayEl.textContent = formatted;
            }
          }
          if (typeof calcPermDuration === 'function') calcPermDuration();
        }
        window.onPermDateChange = onPermDateChange;
`;

function updateHtmlBundle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ApplyPermission">');
  if (tplStart === -1) {
    console.error('tpl-ApplyPermission not found in ' + filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  let tpl = content.substring(tplStart, tplEnd + 11);

  // 1. Replace CSS
  const oldCssRegex = /\/\* Calendar Dropdown[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
  if (oldCssRegex.test(tpl)) {
    tpl = tpl.replace(oldCssRegex, permPickerCss.trim());
  }

  // 2. Replace Date Field HTML
  const oldDateFieldRegex = /<!-- Date \* -->[\s\S]*?<!-- Permission Type/m;
  tpl = tpl.replace(oldDateFieldRegex, permDateCardHtml + '\n\n            <!-- Permission Type');

  // 3. Replace JS functions
  const oldJsRegex = /var permCalState = \{[\s\S]*?window\.selectTodayPermDate = selectTodayPermDate;/;
  if (oldJsRegex.test(tpl)) {
    tpl = tpl.replace(oldJsRegex, permPickerJs.trim());
  } else if (!tpl.includes('function openCalPicker')) {
    tpl = tpl.replace('function onPermDateChange', permPickerJs + '\n        function onPermDateChange');
  }

  content = content.substring(0, tplStart) + tpl + content.substring(tplEnd + 11);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

// Update the 4 html bundles
updateHtmlBundle('preview_app.html');
updateHtmlBundle('index.html');
updateHtmlBundle('EmergereApp/EmergereApp/preview_app.html');
updateHtmlBundle('EmergereApp/EmergereApp/index.html');

// Update standalone preview.css and preview.html
const standaloneCssPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css';
let standCss = fs.readFileSync(standaloneCssPath, 'utf8');
const oldStandCssRegex = /\/\* Calendar Dropdown[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
if (oldStandCssRegex.test(standCss)) {
  standCss = standCss.replace(oldStandCssRegex, permPickerCss.trim());
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);

const standaloneHtmlPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html';
let standHtml = fs.readFileSync(standaloneHtmlPath, 'utf8');

const oldStandDateFieldRegex = /<!-- Date \* -->[\s\S]*?<!-- Permission Type/m;
standHtml = standHtml.replace(oldStandDateFieldRegex, permDateCardHtml + '\n\n      <!-- Permission Type');

const oldStandJsRegex = /var permCalState = \{[\s\S]*?window\.selectTodayPermDate = selectTodayPermDate;/;
if (oldStandJsRegex.test(standHtml)) {
  standHtml = standHtml.replace(oldStandJsRegex, permPickerJs.trim());
} else if (!standHtml.includes('function openCalPicker')) {
  standHtml = standHtml.replace('function onPermDateChange', permPickerJs + '\nfunction onPermDateChange');
}
fs.writeFileSync(standaloneHtmlPath, standHtml, 'utf8');
console.log('Updated ' + standaloneHtmlPath);
