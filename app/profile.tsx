import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';

export default function Profile() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose a photo source', [
      {
        text: 'Camera',
        onPress: () => Alert.alert('Camera', 'Camera feature coming soon'),
      },
      {
        text: 'Gallery',
        onPress: () => Alert.alert('Gallery', 'Gallery feature coming soon'),
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  const handlePersonalInfo = () => {
    Alert.alert('Personal Information', 'View and edit your personal details');
  };

  const handleHelpSupport = () => {
    Alert.alert('Help & Support', 'Contact support team for assistance');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'View our privacy policy');
  };

  const handleAboutTrustika = () => {
    Alert.alert('About Trustika', 'Learn more about our service');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => alert('Logged out successfully'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* BACK BUTTON HEADER */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: colors.text }]}>My Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* PROFILE HEADER */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: '#4B7A7F' }]}>
              <MaterialIcons name="person" size={60} color="#fff" />
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: '#14B8A6' }]}
              onPress={handleChangePhoto}
            >
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>Alex Thompson</Text>
          <Text style={[styles.profileEmail, { color: '#14B8A6' }]}>alex.t@example.com</Text>
        </View>

        {/* ACCOUNT SETTINGS SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ACCOUNT SETTINGS</Text>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: colors.sectionBackground,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handlePersonalInfo}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}
            >
              <MaterialIcons name="person" size={22} color="#14B8A6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                Personal Information
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* SUPPORT & LEGAL SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>SUPPORT & LEGAL</Text>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: colors.sectionBackground,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleHelpSupport}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}
            >
              <MaterialIcons name="help" size={22} color="#14B8A6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: colors.sectionBackground,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handlePrivacyPolicy}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}
            >
              <MaterialIcons name="privacy-tip" size={22} color="#14B8A6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: colors.sectionBackground,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleAboutTrustika}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}
            >
              <MaterialIcons name="info" size={22} color="#14B8A6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>About Trustika</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)' }]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#EF4444" />
            <Text style={[styles.logoutText, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBarTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
