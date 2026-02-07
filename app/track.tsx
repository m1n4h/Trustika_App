import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '../lib/ThemeContext';

export default function Track() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef<MapView>(null);

  const handleSearch = () => {
    if (!trackingId.trim()) {
      Alert.alert('Error', 'Please enter a tracking ID');
      return;
    }
    setIsTracking(true);
    Alert.alert('Tracking', `Tracking order ${trackingId}`);
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then(camera => {
      if (camera && camera.zoom !== undefined) {
        camera.zoom += 1;
        mapRef.current?.animateCamera(camera);
      }
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then(camera => {
      if (camera && camera.zoom !== undefined) {
        camera.zoom -= 1;
        mapRef.current?.animateCamera(camera);
      }
    });
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion({
      latitude: -6.7924,
      longitude: 39.2083,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  // Mock delivery route coordinates (Dar es Salaam, Tanzania area)
  const startPoint = { latitude: -6.7924, longitude: 39.2083 };
  const endPoint = { latitude: -6.8000, longitude: 39.3300 };
  const currentPoint = { latitude: -6.8100, longitude: 39.2700 };

  const routeCoordinates = [
    startPoint,
    { latitude: -6.7950, longitude: 39.2150 },
    { latitude: -6.8000, longitude: 39.2400 },
    { latitude: -6.8050, longitude: 39.2550 },
    { latitude: -6.8100, longitude: 39.2700 },
    { latitude: -6.8050, longitude: 39.3000 },
    endPoint,
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Track Order</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* MAP VIEW */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -6.8100,
          longitude: 39.2700,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {isTracking && (
          <>
            {/* Route line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#14B8A6"
              strokeWidth={3}
            />

            {/* Start marker */}
            <Marker coordinate={startPoint}>
              <View style={styles.markerContainer}>
                <View style={[styles.markerDot, { backgroundColor: '#14B8A6' }]} />
              </View>
            </Marker>

            {/* Current location marker */}
            <Marker coordinate={currentPoint}>
              <View style={styles.currentMarkerContainer}>
                <MaterialIcons name="local-shipping" size={28} color="#fff" />
              </View>
            </Marker>

            {/* End marker */}
            <Marker coordinate={endPoint}>
              <View style={styles.markerContainer}>
                <View style={[styles.markerDot, { backgroundColor: '#14B8A6' }]} />
              </View>
            </Marker>
          </>
        )}
      </MapView>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.sectionBackground,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Enter Tracking ID..."
          placeholderTextColor={colors.text === '#fff' ? '#9CA3AF' : '#D1D5DB'}
          value={trackingId}
          onChangeText={setTrackingId}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MAP CONTROLS */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
          <MaterialIcons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
          <MaterialIcons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleRecenter}>
          <MaterialIcons name="my-location" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* DELIVERY STATUS */}
      {isTracking && (
        <View style={[styles.statusCard, { backgroundColor: colors.sectionBackground }]}>
          <View style={styles.statusContent}>
            <View style={[styles.statusIcon, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}>
              <MaterialIcons name="local-shipping" size={28} color="#14B8A6" />
            </View>
            <View style={styles.statusText}>
              <Text style={[styles.statusLabel, { color: colors.text }]}>ON ITS WAY</Text>
              <Text style={[styles.estimatedTime, { color: colors.text }]}>
                Estimated 4:25 PM
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      )}
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
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    marginRight: 8,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 180,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  currentMarkerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
