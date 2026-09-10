// src/screens/Notifications/NotificationsScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Card from '../../components/Card';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './NotificationsScreen.styles';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    icon: 'check-circle',
    color: '#1FAE6E',
    text: 'Your Casual Leave request for Sep 02 has been Approved by Rahul Sharma',
    time: '2h ago',
    unread: false,
  },
  {
    id: '2',
    icon: 'info',
    color: '#2F6BFF',
    text: 'New Permission request submitted for review',
    time: '5h ago',
    unread: true,
  },
  {
    id: '3',
    icon: 'x-circle',
    color: '#E5484D',
    text: 'Your Sick Leave request for Sep 15 was Rejected. Reason: Insufficient balance',
    time: '1d ago',
    unread: false,
  },
  {
    id: '4',
    icon: 'alert-circle',
    color: '#F5A623',
    text: 'Holiday Alert: Ganesh Chaturthi on Sep 10',
    time: '2d ago',
    unread: false,
  },
];

export default function NotificationsScreen({ navigation, route }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const go = (screen) => navigation && navigation.navigate(screen);

  React.useEffect(() => {
    if (route?.params?.newNotification) {
      const newNotif = route.params.newNotification;
      setNotifications((prev) => [
        {
          id: newNotif.id || Date.now().toString(),
          icon: newNotif.icon || 'check-circle',
          color: newNotif.tone === 'danger' ? '#E5484D' : '#1FAE6E',
          text: newNotif.desc || newNotif.title,
          time: 'Just now',
          unread: true,
        },
        ...prev,
      ]);
    }
  }, [route?.params?.newNotification]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleRemoveOne = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Image source={require('../../../assets/emergere-logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <Text style={styles.subtitle}>Stay updated with your requests</Text>

      <View style={styles.recentRow}>
        <Text style={styles.recentLabel}>Recent</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.markAllText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Card key={n.id} style={[styles.notifCard, n.unread && styles.notifCardUnread]}>
              <View style={styles.notifRow}>
                <View style={styles.iconWrap}>
                  <Feather name={n.icon} size={20} color={n.color} />
                </View>
                <View style={styles.notifTextWrap}>
                  <Text style={styles.notifText}>{n.text}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveOne(n.id)}
                  style={{ padding: 4, marginLeft: 6 }}
                >
                  <Feather name="x" size={16} color="#9AA3B2" />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color="#9AA3B2" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>All notifications have been cleared.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar active="Dashboard" onNavigate={go} />
    </View>
  );
}
