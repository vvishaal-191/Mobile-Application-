// src/screens/Notifications/NotificationsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './NotificationsScreen.styles';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'approved',
    text: 'Your Casual Leave request for Sep 02 has been Approved by Rahul Sharma',
    time: '2 hours ago',
    renderText: () => (
      <Text style={styles.notifText}>
        Your <Text style={styles.highlightGreen}>Casual Leave</Text> request for Sep 02 has been <Text style={styles.highlightGreen}>Approved</Text> by Rahul Sharma
      </Text>
    ),
  },
  {
    id: '2',
    type: 'permission',
    text: 'New Permission request submitted for review',
    time: '5 hours ago',
    renderText: () => (
      <Text style={styles.notifText}>
        New <Text style={styles.highlightBlue}>Permission request</Text> submitted for review
      </Text>
    ),
  },
  {
    id: '3',
    type: 'rejected',
    text: 'Your Sick Leave request for Sep 15 was Rejected. Reason: Insufficient balance',
    time: '1 day ago',
    renderText: () => (
      <Text style={styles.notifText}>
        Your <Text style={styles.highlightRed}>Sick Leave</Text> request for Sep 15 was <Text style={styles.highlightRed}>Rejected</Text>. Reason: Insufficient balance
      </Text>
    ),
  },
  {
    id: '4',
    type: 'holiday',
    text: 'Holiday Alert: Ganesh Chaturthi on Sep 10',
    time: '2 days ago',
    renderText: () => (
      <Text style={styles.notifText}>
        <Text style={styles.highlightAmber}>Holiday Alert:</Text> Ganesh Chaturthi on Sep 10
      </Text>
    ),
  },
];

export default function NotificationsScreen({ navigation, route }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Directly navigate to EmployeeDashboard for Home/Dashboard
  const go = (screen) => {
    if (!navigation) return;
    if (screen === 'Dashboard') {
      navigation.navigate('EmployeeDashboard');
    } else {
      navigation.navigate(screen);
    }
  };

  const handleBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      go('EmployeeDashboard');
    }
  };

  // Merge any global notifications
  useEffect(() => {
    const globalNotifs = (typeof global !== 'undefined' && global.NOTIFICATIONS) || [];
    if (globalNotifs.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const fresh = globalNotifs.filter((n) => !existingIds.has(n.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    }
  }, []);

  // Merge route params notification
  useEffect(() => {
    if (route?.params?.newNotification) {
      const n = route.params.newNotification;
      const isApprove = n.status === 'approved' || n.tone !== 'danger';
      const item = {
        id: n.id || Date.now().toString(),
        type: isApprove ? 'approved' : 'rejected',
        text: n.desc || n.title,
        time: 'Just now',
        renderText: () => (
          <Text style={styles.notifText}>
            {n.title || (isApprove ? 'Permission Request Approved' : 'Permission Request Rejected')}: {n.desc}
          </Text>
        ),
      };
      setNotifications((prev) => [item, ...prev]);
    }
  }, [route?.params?.newNotification]);

  const handleClearAll = () => {
    setNotifications([]);
    if (typeof global !== 'undefined') {
      global.NOTIFICATIONS = [];
    }
  };

  const handleRemoveOne = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderBadge = (type) => {
    switch (type) {
      case 'approved':
        return (
          <View style={[styles.iconBadge, styles.badgeGreen]}>
            <Feather name="check-circle" size={22} color="#10B981" />
          </View>
        );
      case 'permission':
        return (
          <View style={[styles.iconBadge, styles.badgeBlue]}>
            <Feather name="info" size={22} color="#0066FF" />
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.iconBadge, styles.badgeRed]}>
            <Feather name="x-circle" size={22} color="#EF4444" />
          </View>
        );
      case 'holiday':
        return (
          <View style={[styles.iconBadge, styles.badgeAmber]}>
            <Feather name="bell" size={20} color="#D97706" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconBadge, styles.badgeBlue]}>
            <Feather name="bell" size={20} color="#0066FF" />
          </View>
        );
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'approved':
        return styles.cardApproved;
      case 'permission':
        return styles.cardPermission;
      case 'rejected':
        return styles.cardRejected;
      case 'holiday':
        return styles.cardHoliday;
      default:
        return styles.cardPermission;
    }
  };

  const getDismissBtnStyle = (type) => {
    if (type === 'rejected') return styles.dismissBtnRed;
    if (type === 'holiday') return styles.dismissBtnAmber;
    return null;
  };

  const getDismissIconColor = (type) => {
    if (type === 'rejected') return '#EF4444';
    if (type === 'holiday') return '#D97706';
    return '#3B82F6';
  };

  return (
    <View style={styles.screen}>
      {/* Royal Blue Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>Stay updated with your requests</Text>
            </View>
          </View>
          <View style={styles.bellArtWrap}>
            <Feather name="bell" size={32} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Controls Row */}
        <View style={styles.controlsRow}>
          <View style={styles.recentPill}>
            <Feather name="bell" size={14} color="#FFFFFF" />
            <Text style={styles.recentPillText}>Recent</Text>
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearAllBtn}
              activeOpacity={0.7}
            >
              <Feather name="trash-2" size={15} color="#0066FF" />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Recent Notifications</Text>

        {/* Cards List */}
        {notifications.length > 0 ? (
          <View style={styles.cardList}>
            {notifications.map((item) => (
              <View key={item.id} style={[styles.notifCard, getCardStyle(item.type)]}>
                <View style={styles.notifRow}>
                  {renderBadge(item.type)}
                  <View style={styles.notifTextWrap}>
                    {item.renderText ? item.renderText() : <Text style={styles.notifText}>{item.text}</Text>}
                    <View style={styles.timeRow}>
                      <Feather name="calendar" size={13} color="#94A3B8" />
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveOne(item.id)}
                    style={[styles.dismissBtn, getDismissBtnStyle(item.type)]}
                    activeOpacity={0.7}
                  >
                    <Feather name="x" size={13} color={getDismissIconColor(item.type)} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Feather name="bell-off" size={28} color="#0066FF" />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>All notifications have been cleared.</Text>
          </View>
        )}
      </ScrollView>

      {/* active="" ensures Home icon is NOT highlighted on the Notification page */}
      <BottomNavBar active="" onNavigate={go} />
    </View>
  );
}
