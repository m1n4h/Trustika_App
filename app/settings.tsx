import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, setIsDarkMode, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [dataSync, setDataSync] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          router.push('/');
          alert('Logged out successfully');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => alert('Account deletion requested. Please check your email for confirmation.'),
          style: 'destructive',
        },
      ]
    );
  };

  const backgroundColor = colors.background;
  const textColor = colors.text;
  const sectionBgColor = colors.sectionBackground;
  const borderColor = colors.border;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* THEME SETTINGS */}
        <View style={[styles.section, { backgroundColor: sectionBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name={isDarkMode ? 'dark-mode' : 'light-mode'} size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#FF6B6B' }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* NOTIFICATIONS SETTINGS */}
        <View style={[styles.section, { backgroundColor: sectionBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#FF6B6B' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="sync" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Auto Data Sync</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: '#D1D5DB', true: '#FF6B6B' }}
              thumbColor={dataSync ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* SECURITY SETTINGS */}
        <View style={[styles.section, { backgroundColor: sectionBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Security & Privacy</Text>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: borderColor }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="fingerprint" size={24} color="#FF6B6B" />
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>Biometric Login</Text>
                <Text style={styles.settingDesc}>Face ID / Fingerprint</Text>
              </View>
            </View>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: '#D1D5DB', true: '#FF6B6B' }}
              thumbColor={biometric ? '#fff' : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: borderColor }]}
            onPress={() => alert('Password change feature coming soon')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="lock" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Change Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => alert('Privacy policy content')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ACCOUNT SETTINGS */}
        <View style={[styles.section, { backgroundColor: sectionBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: borderColor }]}
            onPress={() => alert('Edit profile feature coming soon')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="person" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Edit Profile</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: borderColor }]}
            onPress={() => alert('Payment methods feature coming soon')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="payment" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Payment Methods</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => alert('Saved addresses feature coming soon')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="location-on" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Saved Addresses</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* APP INFO */}
        <View style={[styles.section, { backgroundColor: sectionBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: borderColor }]}
            onPress={() => alert('App Version: 1.0.0')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="info" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => alert('Check for updates feature coming soon')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="system-update" size={24} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: textColor }]}>Check for Updates</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* LOGOUT & DELETE ACCOUNT */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}
            onPress={handleDeleteAccount}
          >
            <MaterialIcons name="delete-forever" size={20} color="#DC2626" />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textColor }]}>Trustika © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
  },
  settingDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginLeft: 14,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    marginHorizontal: 12,
    gap: 8,
    marginBottom: 20,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
