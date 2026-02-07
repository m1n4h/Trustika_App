import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';

const PHONE_NUMBER = '0750355402';
const EMAIL = 'support@trustika.com';

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export default function CustomerServices() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const handleCall = async () => {
    try {
      await Linking.openURL(`tel:${PHONE_NUMBER}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to make a call');
    }
  };

  const handleWhatsApp = async () => {
    try {
      const message = encodeURIComponent('Hello, I need assistance with Trustika');
      const whatsappUrl = `https://wa.me/${PHONE_NUMBER.replace(/^0/, '255')}?text=${message}`;
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      Alert.alert('Error', 'WhatsApp is not installed or URL failed');
    }
  };

  const handleEmail = async () => {
    try {
      await Linking.openURL(`mailto:${EMAIL}?subject=Trustika Support Request`);
    } catch (error) {
      Alert.alert('Error', 'Unable to open email');
    }
  };

  const handleSMS = async () => {
    try {
      await Linking.openURL(`sms:${PHONE_NUMBER}?body=Hello, I need assistance with Trustika`);
    } catch (error) {
      Alert.alert('Error', 'Unable to send SMS');
    }
  };

  const handleInAppChat = () => {
    Alert.alert('Live Chat', 'Connect with our support team in real-time');
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'phone',
      title: 'Phone Call',
      description: 'Call us directly for instant support',
      icon: 'phone-in-talk',
      color: '#22C55E',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      onPress: handleCall,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Message us for quick responses',
      icon: 'chat-bubble',
      color: '#25D366',
      backgroundColor: 'rgba(37, 211, 102, 0.1)',
      onPress: handleWhatsApp,
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Send us detailed inquiries',
      icon: 'mail-outline',
      color: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      onPress: handleEmail,
    },
    {
      id: 'sms',
      title: 'Text Message',
      description: 'Quick text support anytime',
      icon: 'sms',
      color: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      onPress: handleSMS,
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our team instantly',
      icon: 'forum',
      color: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      onPress: handleInAppChat,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Customer Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* HERO SECTION */}
        <View style={[styles.heroSection, { backgroundColor: colors.sectionBackground }]}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="support-agent" size={48} color="#FF6B6B" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>How Can We Help?</Text>
          <Text style={[styles.heroSubtitle, { color: colors.text }]}>
            Choose your preferred way to reach us. We're here 24/7 to assist you.
          </Text>
        </View>

        {/* CONTACT OPTIONS */}
        <View style={styles.contactOptionsContainer}>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.contactOption,
                {
                  backgroundColor: isDarkMode
                    ? colors.sectionBackground
                    : option.backgroundColor,
                  borderColor: isDarkMode ? colors.border : option.color,
                },
              ]}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
                <MaterialIcons name={option.icon as any} size={28} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.text }]}>
                  {option.description}
                </Text>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={option.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* CONTACT INFO CARD */}
        <View style={[styles.infoCard, { backgroundColor: colors.sectionBackground }]}>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={22} color="#FF6B6B" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Phone</Text>
              <Text style={styles.infoValue}>{PHONE_NUMBER}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={22} color="#3B82F6" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Email</Text>
              <Text style={styles.infoValue}>{EMAIL}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={22} color="#22C55E" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Support Hours</Text>
              <Text style={styles.infoValue}>24/7 Available</Text>
            </View>
          </View>
        </View>

        {/* QUICK RESPONSE TIME */}
        <View style={[styles.responseCard, { backgroundColor: isDarkMode ? '#2D3748' : '#FEF3F2' }]}>
          <MaterialIcons name="schedule" size={24} color="#FF6B6B" />
          <Text style={[styles.responseTitle, { color: colors.text }]}>Average Response Time</Text>
          <Text style={styles.responseValue}>30 minutes - 2 hours</Text>
        </View>

        {/* FEATURES */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Us</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                <MaterialIcons name="check-circle" size={20} color="#22C55E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Quick Response</Text>
                <Text style={styles.featureDesc}>Get help within minutes</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <MaterialIcons name="language" size={20} color="#3B82F6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Professional Team</Text>
                <Text style={styles.featureDesc}>Trained support experts</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <MaterialIcons name="shield" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Secure & Safe</Text>
                <Text style={styles.featureDesc}>Your data is protected</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: colors.text }]}>
            Thank you for choosing Trustika
          </Text>
          <Text style={styles.footerSubtext}>We appreciate your business</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },

  scrollView: {
    flex: 1,
  },

  // HERO SECTION
  heroSection: {
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },

  // CONTACT OPTIONS
  contactOptionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    opacity: 0.7,
  },

  // INFO CARD
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },

  // RESPONSE CARD
  responseCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  responseTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  responseValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },

  // FEATURES
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  // FOOTER
  footerSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
});
