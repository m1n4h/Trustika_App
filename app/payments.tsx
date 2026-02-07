import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';

type PaymentMethod = 'cash' | 'card' | 'crypto' | 'mobile' | null;

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function Payments() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMobileMoneyModal, setShowMobileMoneyModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [selectedMobileProvider, setSelectedMobileProvider] = useState<string | null>(null);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleCardChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card Number', 'Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.cardHolder.trim()) {
      Alert.alert('Invalid Name', 'Please enter cardholder name');
      return false;
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleCardPayment = () => {
    if (validateCardDetails()) {
      Alert.alert('Success', 'Card details saved securely. Ready to proceed with payment.');
      setShowCardForm(false);
      setSelectedMethod('card');
    }
  };

  const handleConnectWallet = (walletType: string) => {
    Alert.alert('Connect Wallet', `Connecting to ${walletType}...`);
    setConnectedWallet(walletType);
    setShowWalletModal(false);
    setSelectedMethod('crypto');
  };

  const handleSelectMobileProvider = (provider: string) => {
    setSelectedMobileProvider(provider);
    Alert.alert('Mobile Money', `You selected ${provider}. Ready to proceed with payment.`);
    setShowMobileMoneyModal(false);
    setSelectedMethod('mobile');
  };

  const handlePaymentConfirm = () => {
    if (!selectedMethod) {
      Alert.alert('Select Payment Method', 'Please choose a payment method to continue');
      return;
    }

    const methodNames = {
      cash: 'Cash Payment',
      card: 'Credit/Debit Card',
      crypto: 'Cryptocurrency',
      mobile: 'Mobile Money',
    };

    Alert.alert('Payment Confirmed', `You have selected ${methodNames[selectedMethod]}. Proceeding with payment...`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payments</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* PAYMENT METHODS */}
        <View style={styles.methodsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Payment Method</Text>

          {/* CASH PAYMENT */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor:
                  selectedMethod === 'cash'
                    ? isDarkMode
                      ? '#2D3748'
                      : '#EFF6FF'
                    : colors.sectionBackground,
                borderColor: selectedMethod === 'cash' ? '#FF6B6B' : colors.border,
                borderWidth: selectedMethod === 'cash' ? 2 : 1,
              },
            ]}
            onPress={() => setSelectedMethod('cash')}
          >
            <View style={[styles.methodIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <MaterialIcons name="payments" size={28} color="#22C55E" />
            </View>
            <View style={styles.methodContent}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Cash Payment</Text>
              <Text style={styles.methodDesc}>Pay with cash at delivery</Text>
            </View>
            {selectedMethod === 'cash' && (
              <MaterialIcons name="check-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>

          {/* DEBIT/CREDIT CARD */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor:
                  selectedMethod === 'card'
                    ? isDarkMode
                      ? '#2D3748'
                      : '#EFF6FF'
                    : colors.sectionBackground,
                borderColor: selectedMethod === 'card' ? '#FF6B6B' : colors.border,
                borderWidth: selectedMethod === 'card' ? 2 : 1,
              },
            ]}
            onPress={() => setShowCardForm(true)}
          >
            <View style={[styles.methodIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <MaterialIcons name="credit-card" size={28} color="#3B82F6" />
            </View>
            <View style={styles.methodContent}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>
                Credit/Debit Card
              </Text>
              <Text style={styles.methodDesc}>Visa, Mastercard, or local cards</Text>
            </View>
            {selectedMethod === 'card' && (
              <MaterialIcons name="check-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>

          {/* MOBILE MONEY */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor:
                  selectedMethod === 'mobile'
                    ? isDarkMode
                      ? '#2D3748'
                      : '#EFF6FF'
                    : colors.sectionBackground,
                borderColor: selectedMethod === 'mobile' ? '#FF6B6B' : colors.border,
                borderWidth: selectedMethod === 'mobile' ? 2 : 1,
              },
            ]}
            onPress={() => setShowMobileMoneyModal(true)}
          >
            <View style={[styles.methodIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <MaterialIcons name="phone-android" size={28} color="#8B5CF6" />
            </View>
            <View style={styles.methodContent}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Mobile Money</Text>
              <Text style={styles.methodDesc}>Mpesa, AirtelMoney, Vodacom Cash</Text>
            </View>
            {selectedMethod === 'mobile' && (
              <MaterialIcons name="check-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>

          {/* CRYPTOCURRENCY */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              {
                backgroundColor:
                  selectedMethod === 'crypto'
                    ? isDarkMode
                      ? '#2D3748'
                      : '#EFF6FF'
                    : colors.sectionBackground,
                borderColor: selectedMethod === 'crypto' ? '#FF6B6B' : colors.border,
                borderWidth: selectedMethod === 'crypto' ? 2 : 1,
              },
            ]}
            onPress={() => setShowWalletModal(true)}
          >
            <View style={[styles.methodIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <MaterialIcons name="currency-bitcoin" size={28} color="#F97316" />
            </View>
            <View style={styles.methodContent}>
              <Text style={[styles.methodTitle, { color: colors.text }]}>Stable Coins</Text>
              <Text style={styles.methodDesc}>USDT, USDC, or other stablecoins</Text>
            </View>
            {selectedMethod === 'crypto' && (
              <MaterialIcons name="check-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>
        </View>

        {/* CONNECTED WALLET INFO */}
        {connectedWallet && (
          <View style={[styles.walletInfo, { backgroundColor: isDarkMode ? '#2D3748' : '#F0FDF4' }]}>
            <MaterialIcons name="check-circle" size={20} color="#22C55E" />
            <View style={styles.walletInfoContent}>
              <Text style={[styles.walletInfoTitle, { color: colors.text }]}>
                Wallet Connected
              </Text>
              <Text style={styles.walletInfoDesc}>{connectedWallet}</Text>
            </View>
          </View>
        )}

        {/* SAVED CARDS */}
        {selectedMethod === 'card' && (
          <View style={styles.savedCardsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Cards</Text>
            <TouchableOpacity
              style={[styles.savedCard, { backgroundColor: colors.sectionBackground }]}
            >
              <MaterialIcons name="credit-card" size={24} color="#3B82F6" />
              <View style={styles.savedCardInfo}>
                <Text style={[styles.savedCardNumber, { color: colors.text }]}>
                  **** **** **** 4242
                </Text>
                <Text style={styles.savedCardExpiry}>Expires 12/25</Text>
              </View>
              <MaterialIcons name="check-circle" size={24} color="#22C55E" />
            </TouchableOpacity>
          </View>
        )}

        {/* SECURITY INFO */}
        <View style={[styles.securityInfo, { backgroundColor: isDarkMode ? '#2D3748' : '#FEF3F2' }]}>
          <MaterialIcons name="lock" size={20} color="#FF6B6B" />
          <View style={styles.securityContent}>
            <Text style={[styles.securityTitle, { color: colors.text }]}>Secure Payment</Text>
            <Text style={styles.securityDesc}>Your payment information is encrypted and secure</Text>
          </View>
        </View>
      </ScrollView>

      {/* PAYMENT BUTTON */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
      </View>

      {/* CARD FORM MODAL */}
      <Modal
        visible={showCardForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCardForm(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* MODAL HEADER */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowCardForm(false)}>
              <MaterialIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Card Details</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* CARD PREVIEW */}
            <View style={[styles.cardPreview, { backgroundColor: '#FF6B6B' }]}>
              <MaterialIcons name="credit-card" size={32} color="#fff" style={{ opacity: 0.3 }} />
              <Text style={styles.cardPreviewNumber}>
                {cardDetails.cardNumber || '**** **** **** ****'}
              </Text>
              <View style={styles.cardPreviewBottom}>
                <View>
                  <Text style={styles.cardPreviewLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardPreviewValue}>
                    {cardDetails.cardHolder || 'YOUR NAME'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
                  <Text style={styles.cardPreviewValue}>
                    {cardDetails.expiryDate || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </View>

            {/* FORM INPUTS */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Card Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.sectionBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.text === '#fff' ? '#9CA3AF' : '#D1D5DB'}
                  keyboardType="numeric"
                  value={cardDetails.cardNumber}
                  onChangeText={value => handleCardChange('cardNumber', value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Cardholder Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.sectionBackground,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.text === '#fff' ? '#9CA3AF' : '#D1D5DB'}
                  value={cardDetails.cardHolder}
                  onChangeText={value => handleCardChange('cardHolder', value)}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Expiry Date</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.sectionBackground,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.text === '#fff' ? '#9CA3AF' : '#D1D5DB'}
                    keyboardType="numeric"
                    value={cardDetails.expiryDate}
                    onChangeText={value => handleCardChange('expiryDate', value)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>CVV</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.sectionBackground,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="123"
                    placeholderTextColor={colors.text === '#fff' ? '#9CA3AF' : '#D1D5DB'}
                    keyboardType="numeric"
                    secureTextEntry
                    value={cardDetails.cvv}
                    onChangeText={value => handleCardChange('cvv', value)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveCardButton}
                onPress={handleCardPayment}
              >
                <Text style={styles.saveCardButtonText}>Save Card Details</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* WALLET CONNECTION MODAL */}
      <Modal
        visible={showWalletModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWalletModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowWalletModal(false)}>
              <MaterialIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Connect Wallet</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.walletDesc, { color: colors.text }]}>
              Choose your wallet provider to connect and complete payment with stable coins
            </Text>

            <View style={styles.walletList}>
              {['MetaMask', 'Trust Wallet', 'WalletConnect', 'Coinbase Wallet'].map(wallet => (
                <TouchableOpacity
                  key={wallet}
                  style={[
                    styles.walletOption,
                    { backgroundColor: colors.sectionBackground, borderColor: colors.border },
                  ]}
                  onPress={() => handleConnectWallet(wallet)}
                >
                  <MaterialIcons name="account-balance-wallet" size={28} color="#F97316" />
                  <Text style={[styles.walletOptionText, { color: colors.text }]}>{wallet}</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.text} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* MOBILE MONEY MODAL */}
      <Modal
        visible={showMobileMoneyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMobileMoneyModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowMobileMoneyModal(false)}>
              <MaterialIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Mobile Money</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.walletDesc, { color: colors.text }]}>
              Select your mobile money provider and enter payment details
            </Text>

            <View style={styles.walletList}>
              {[
                { name: 'M-Pesa', icon: 'phone-android', color: '#22C55E' },
                { name: 'Airtel Money', icon: 'phone-android', color: '#EF4444' },
                { name: 'Vodacom Cash', icon: 'phone-android', color: '#F97316' },
                { name: 'TNM Money', icon: 'phone-android', color: '#3B82F6' },
              ].map(provider => (
                <TouchableOpacity
                  key={provider.name}
                  style={[
                    styles.walletOption,
                    { backgroundColor: colors.sectionBackground, borderColor: colors.border },
                  ]}
                  onPress={() => handleSelectMobileProvider(provider.name)}
                >
                  <MaterialIcons name={provider.icon as any} size={28} color={provider.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.walletOptionText, { color: colors.text }]}>{provider.name}</Text>
                    <Text style={[styles.providerDesc, { color: colors.text }]}>Fast and secure transfers</Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.text} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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

  summaryCard: {
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  methodsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  methodDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  walletInfo: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  walletInfoContent: {
    marginLeft: 12,
    flex: 1,
  },
  walletInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  walletInfoDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  savedCardsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  savedCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  savedCardNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  savedCardExpiry: {
    fontSize: 12,
    color: '#6B7280',
  },

  securityInfo: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  securityContent: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: 12,
    color: '#6B7280',
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  paymentButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // MODAL STYLES
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },

  // CARD FORM STYLES
  cardPreview: {
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  cardPreviewNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardPreviewValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  saveCardButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // WALLET MODAL STYLES
  walletDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.8,
  },
  walletList: {
    gap: 12,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  walletOptionText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  providerDesc: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 12,
    marginTop: 4,
  },
});
