import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '../lib/ThemeContext';

export default function OrderDetails() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const params = useLocalSearchParams();

  const {
    pickupLocation = 'Current Location',
    dropoffLocation = 'Destination',
    transportName = 'Transport',
    transportPrice = '$0.00',
    transportTime = '0 min',
    transportCapacity = 'Capacity',
  } = params;

  const handleConfirm = () => {
    router.push('/orders');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleCancel}>
          <MaterialIcons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* MAP VIEW */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -6.8100,
              longitude: 39.2700,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            <Marker
              coordinate={{ latitude: -6.8100, longitude: 39.2700 }}
              title="Pickup"
            >
              <View style={[styles.mapMarker, { backgroundColor: '#10B981' }]}>
                <MaterialIcons name="location-on" size={20} color="#fff" />
              </View>
            </Marker>

            <Marker
              coordinate={{ latitude: -6.8200, longitude: 39.2800 }}
              title="Destination"
            >
              <View style={[styles.mapMarker, { backgroundColor: '#FF6B6B' }]}>
                <MaterialIcons name="location-on" size={20} color="#fff" />
              </View>
            </Marker>

            <Polyline
              coordinates={[
                { latitude: -6.8100, longitude: 39.2700 },
                { latitude: -6.8150, longitude: 39.2750 },
                { latitude: -6.8200, longitude: 39.2800 },
              ]}
              strokeColor="#10B981"
              strokeWidth={3}
              lineDashPattern={[8, 4]}
            />
          </MapView>
        </View>

        {/* LOCATION DETAILS CARD */}
        <View style={[styles.detailsCard, { backgroundColor: colors.sectionBackground }]}>
          <View style={styles.locationRow}>
            <View style={styles.markerIcon}>
              <View style={[styles.locationDot, { backgroundColor: '#10B981' }]} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: colors.text }]}>Pickup Location</Text>
              <Text style={[styles.locationValue, { color: colors.text }]}>
                {String(pickupLocation)}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.locationRow}>
            <View style={styles.markerIcon}>
              <View style={[styles.locationDot, { backgroundColor: '#FF6B6B' }]} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, { color: colors.text }]}>Drop-off Location</Text>
              <Text style={[styles.locationValue, { color: colors.text }]}>
                {String(dropoffLocation)}
              </Text>
            </View>
          </View>
        </View>

        {/* TRANSPORT DETAILS CARD */}
        <View style={[styles.detailsCard, { backgroundColor: colors.sectionBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transport Details</Text>

          <View style={styles.transportCard}>
            <View
              style={[
                styles.transportIconBox,
                {
                  backgroundColor: isDarkMode
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(16, 185, 129, 0.1)',
                },
              ]}
            >
              <MaterialIcons name="local-shipping" size={32} color="#10B981" />
            </View>

            <View style={styles.transportInfo}>
              <View style={styles.transportHeader}>
                <View>
                  <Text style={[styles.transportName, { color: colors.text }]}>
                    {String(transportName)}
                  </Text>
                  <View style={styles.transportMeta}>
                    <MaterialIcons name="schedule" size={14} color="#10B981" />
                    <Text style={[styles.transportTime, { color: colors.text }]}>
                      {String(transportTime)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transportPrice, { color: colors.text }]}>
                  {String(transportPrice)}
                </Text>
              </View>
              <Text style={[styles.transportCapacity, { color: colors.text }]}>
                {String(transportCapacity)}
              </Text>
            </View>
          </View>
        </View>

        {/* BILLING SUMMARY CARD */}
        <View style={[styles.detailsCard, { backgroundColor: colors.sectionBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Billing Summary</Text>

          <View style={styles.billingRow}>
            <Text style={[styles.billingLabel, { color: colors.text }]}>Service Fee</Text>
            <Text style={[styles.billingValue, { color: colors.text }]}>
              {String(transportPrice)}
            </Text>
          </View>

          <View style={styles.billingRow}>
            <Text style={[styles.billingLabel, { color: colors.text }]}>Taxes & Fees</Text>
            <Text style={[styles.billingValue, { color: colors.text }]}>$1.50</Text>
          </View>

          <View style={[styles.billingDivider, { backgroundColor: colors.border }]} />

          <View style={styles.billingRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: '#10B981' }]}>
              ${(parseFloat(String(transportPrice).replace('$', '')) + 1.5).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ADDITIONAL INFO */}
        <View style={[styles.detailsCard, { backgroundColor: colors.sectionBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Information</Text>

          <TouchableOpacity style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#10B981" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Driver Details</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>Available after confirmation</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>

          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#10B981" />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Support</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>Available 24/7</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={[styles.footer, { backgroundColor: colors.sectionBackground, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={handleCancel}
        >
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Place Order</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#102216" />
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  mapContainer: {
    height: 240,
    marginBottom: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  markerIcon: {
    paddingTop: 2,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  transportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transportIconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transportInfo: {
    flex: 1,
  },
  transportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  transportName: {
    fontSize: 14,
    fontWeight: '700',
  },
  transportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  transportTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  transportPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  transportCapacity: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  billingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  billingValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  billingDivider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
  },
  spacer: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#10B981',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#102216',
    fontSize: 14,
    fontWeight: '700',
  },
});
