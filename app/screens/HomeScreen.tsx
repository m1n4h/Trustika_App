import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../lib/ThemeContext";
import { HomeGuideTour } from "../../components/HomeGuideTour";

// Light map style for iOS
const lightMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState("Dar es Salaam");
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Tour state
  const [tourVisible, setTourVisible] = useState(false);
  const [targetPositions, setTargetPositions] = useState({
    food: null as any,
    pharmacy: null as any,
    sendto: null as any,
  });
  const foodRef = useRef<View>(null);
  const pharmacyRef = useRef<View>(null);
  const sendtoRef = useRef<View>(null);

  useEffect(() => {
    (async () => {
      // Omba ruhusa ya location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Ruhusa ya location inahitajika ili kuonyesha ramani");
        setLoading(false);
        return;
      }

      // Pata location halisi
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc);

      // Set region ili zoom iwe street level
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // Reverse geocode kupata jina la eneo/mtaa
      let name = "Dar es Salaam";
      try {
        let places = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (places && places.length > 0) {
          let place = places[0];
          name =
            place?.name ||
            place?.street ||
            place?.subregion ||
            place?.city ||
            "Dar es Salaam";
        }
      } catch (error) {
        console.log("Reverse geocoding failed, using default location");
        name = "Dar es Salaam";
      }

      setLocationName(name);
      setLoading(false);
    })();
  }, []);

  // Initialize tour on first load
  useEffect(() => {
    const initTour = async () => {
      try {
        // Check if tour was already completed
        const tourCompleted = await AsyncStorage.getItem('tour_completed');
        if (!tourCompleted) {
          // Delay to ensure all components are laid out
          setTimeout(() => {
            measureTargets();
          }, 2000);
        }
      } catch (error) {
        console.log('Error checking tour status:', error);
      }
    };

    initTour();
  }, []);

  // Measure target positions for the tour
  const measureTargets = () => {
    const measureRef = (ref: React.RefObject<View>) => {
      return new Promise((resolve) => {
        if (ref.current) {
          try {
            (ref.current as any).measureInWindow((x: number, y: number, width: number, height: number) => {
              resolve({ x, y, width, height });
            });
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    };

    Promise.all([
      measureRef(foodRef),
      measureRef(pharmacyRef),
      measureRef(sendtoRef),
    ]).then(([food, pharmacy, sendto]) => {
      if (food && pharmacy && sendto) {
        setTargetPositions({
          food: food as any,
          pharmacy: pharmacy as any,
          sendto: sendto as any,
        });
        setTourVisible(true);
      } else {
        // Retry if any position failed
        setTimeout(() => {
          measureTargets();
        }, 500);
      }
    });
  };

  // Handler to restart tour
  const handleRestartTour = () => {
    measureTargets();
    setTourVisible(true);
  };

  // Navigation handlers
  const handleSendTo = () => {
    router.push("/address");
  };

  const handleLater = () => {
    router.push("/schedule");
  };

  const handleOrders = () => {
    router.push("/orders");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleTrack = () => {
    router.push("/track");
  };

  // Menu handlers
  const handlePayments = () => {
    setMenuVisible(false);
    router.push("/payments");
  };

  const handleSettings = () => {
    setMenuVisible(false);
    router.push("/settings");
  };

  const handleCustomerService = () => {
    setMenuVisible(false);
    router.push("/customer-services");
  };

  const handleOtherServices = () => {
    setMenuVisible(false);
    alert("Other Services - Coming soon");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0047AB" />
        <Text style={{ marginTop: 10, color: colors.text }}>Inapata location yako...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* HAMBURGER MENU MODAL */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <MaterialIcons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={handlePayments}>
              <MaterialIcons name="payment" size={24} color="#FF6B6B" />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Payments</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={handleSettings}>
              <MaterialIcons name="settings" size={24} color="#FF6B6B" />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={handleCustomerService}>
              <MaterialIcons name="support-agent" size={24} color="#FF6B6B" />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Customer Services</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleOtherServices}>
              <MaterialIcons name="more-horiz" size={24} color="#FF6B6B" />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Other Services</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* HEADER WITH HAMBURGER */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={() => setMenuVisible(true)}
          >
            <MaterialIcons name="menu" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Trustika</Text>
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
            ]}
            onPress={() => setNotificationsVisible(true)}
          >
            <MaterialIcons name="notifications" size={20} color={colors.text} />
            {notifications.length > 0 && (
              <View style={styles.notificationDot}>
                <Text style={styles.notificationCount}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* MAP SECTION (Top 45%) */}
        <View style={styles.mapContainer}>
          {location && region ? (
            <MapView
              style={StyleSheet.absoluteFillObject}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={false}
              mapType={Platform.OS === "ios" ? "standard" : "standard"}
              customMapStyle={Platform.OS === "ios" ? lightMapStyle : undefined}
            >
              {/* Removed default red Marker to rely on custom orange center pin */}
            </MapView>
          ) : (
            <View style={[StyleSheet.absoluteFillObject, styles.mapFallback]}>
              <Text style={{ color: colors.text }}>Location not available</Text>
            </View>
          )}

          {/* Location Badge - at top center */}
          <View style={[styles.locationBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.greenDot} />
            <Text style={[styles.locationText, { color: colors.text }]}>{locationName}, Tanzania</Text>
          </View>

          {/* Location Pin at Center */}
          <View style={styles.centerPin}>
            <MaterialIcons
              name="location-on"
              size={48}
              color="#F97316"
              style={styles.pinIcon}
            />
            <View style={styles.blueDot} />
          </View>

          {/* My Location Button */}
          <TouchableOpacity style={[styles.myLocationButton, { backgroundColor: colors.background }]}>
            <MaterialIcons name="my-location" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Google Logo */}
          <View style={styles.googleLogo}>
            <Text style={styles.googleText}>Google</Text>
          </View>
        </View>

        {/* MAIN CONTENT SECTION - NOW SCROLLABLE */}
        <ScrollView style={[styles.contentScrollView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
            {/* Pull Handle */}
            <View style={[styles.pullHandle, { backgroundColor: colors.border }]} />

            {/* Services Grid */}
            <View style={styles.servicesGrid}>
              <TouchableOpacity
                ref={foodRef}
                style={[styles.serviceCard, { backgroundColor: isDarkMode ? '#2D3748' : '#EFF6FF' }]}
                onPress={() => router.push("/food")}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialIcons name="restaurant" size={56} color="#F97316" />
                </View>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>Order Food</Text>
              </TouchableOpacity>

              <TouchableOpacity
                ref={pharmacyRef}
                style={[styles.serviceCard, { backgroundColor: isDarkMode ? '#2D3748' : '#EFF6FF' }]}
                onPress={() => router.push("/pharmacy")}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialIcons name="medication" size={56} color="#0D9488" />
                </View>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>Order Medicine</Text>
              </TouchableOpacity>
            </View>

            {/* SEND TO SECTION */}
            <View
              ref={sendtoRef}
              style={[styles.sendToContainer, { backgroundColor: colors.sectionBackground }]}
            >
              <TouchableOpacity style={styles.sendToLeft} onPress={handleSendTo}>
                <MaterialIcons name="search" size={24} color="#9CA3AF" />
                <Text style={[styles.sendToText, { color: colors.text }]}>Send to?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.laterButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={handleLater}>
                <MaterialIcons name="schedule" size={16} color={colors.text} />
                <Text style={[styles.laterText, { color: colors.text }]}>Later</Text>
                <MaterialIcons name="expand-more" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Recent Locations */}
            <View style={styles.recentLocations}>
              <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Locations</Text>
              <TouchableOpacity style={[styles.locationItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.locationIcon, { backgroundColor: colors.sectionBackground }]}>
                  <MaterialIcons name="history" size={20} color="#6B7280" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationItemTitle, { color: colors.text }]}>Posta Mpya</Text>
                  <Text style={styles.locationItemSubtitle}>
                    Posta Mpya, Azikiwe Street, Dar es Salaam, Tan...
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.locationItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.locationIcon, { backgroundColor: colors.sectionBackground }]}>
                  <MaterialIcons name="history" size={20} color="#6B7280" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationItemTitle, { color: colors.text }]}>Mbagala</Text>
                  <Text style={styles.locationItemSubtitle}>Mbagala, Tanzania</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION - Fixed at bottom */}
        <View style={styles.bottomNav}>
          <NavItem icon="home" label="Home" active />
          <NavItem icon="receipt-long" label="Orders" onPress={handleOrders} />
          <NavItem icon="explore" label="Track" onPress={handleTrack} />
          <NavItem icon="account-circle" label="Profile" onPress={handleProfile} />
        </View>
      </View>

      {/* NOTIFICATIONS MODAL */}
      {notificationsVisible && (
        <View
          style={[
            styles.notificationsModal,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={[styles.notificationsHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.notificationsTitle, { color: colors.text }]}>
              Notifications
            </Text>
            <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsList}>
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
                    ]}
                  >
                    <MaterialIcons name="notifications" size={20} color="#2bee6c" />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[styles.notificationItemTitle, { color: colors.text }]}>
                      {notification?.title || "Notification"}
                    </Text>
                    <Text style={styles.notificationItemMessage}>
                      {notification?.message || ""}
                    </Text>
                    <Text style={styles.notificationItemTime}>
                      {notification?.time || ""}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noNotificationsContainer}>
                <MaterialIcons name="notifications-none" size={48} color="#9CA3AF" />
                <Text style={[styles.noNotificationsText, { color: colors.text }]}>
                  No notifications
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Guided Tour Component */}
      <HomeGuideTour
        visible={tourVisible}
        onClose={() => setTourVisible(false)}
        targetPositions={targetPositions}
        isDarkMode={isDarkMode}
        colors={colors}
      />
    </SafeAreaView>
  );
}

// NAV ITEM COMPONENT
function NavItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View style={styles.navIconContainer}>
        <MaterialIcons name={icon} size={26} color={active ? "#0047AB" : "#9CA3AF"} />
        {label === "Track" && <View style={styles.notificationDot} />}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  hamburgerBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF6B6B",
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "75%",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 16,
    flex: 1,
  },

  mapContainer: { 
    height: "45%", 
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  mapFallback: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5",
  },

  locationBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: "85%",
    borderWidth: 1,
    zIndex: 10,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981" },
  locationText: { fontWeight: "600", fontSize: 14 },

  centerPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -48 }],
    alignItems: "center",
    zIndex: 5,
  },
  pinIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  blueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    bottom: 8,
  },

  myLocationButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },

  googleLogo: { 
    position: "absolute", 
    bottom: 40, 
    left: 16,
    zIndex: 5,
  },
  googleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  contentScrollView: { flex: 1 },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },

  pullHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 16,
    backgroundColor: "#E5E7EB",
  },

  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 20,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(100, 150, 255, 0.1)",
  },
  serviceIconContainer: { marginBottom: 12 },
  serviceTitle: { fontWeight: "600", fontSize: 13, textAlign: "center" },

  sendToContainer: {
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sendToLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 12,
    flex: 1,
  },
  sendToText: { fontWeight: "600", fontSize: 14 },

  laterButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    elevation: 1,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  laterText: { fontWeight: "500", fontSize: 12 },

  recentLocations: { paddingHorizontal: 20, marginBottom: 20 },
  recentTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: { flex: 1 },
  locationItemTitle: { fontWeight: "600", fontSize: 15, marginBottom: 3 },
  locationItemSubtitle: { fontSize: 13, color: "#9CA3AF" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 8 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    gap: 4,
    paddingVertical: 8,
  },
  navIconContainer: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navLabel: { fontSize: 11, fontWeight: "500", color: "#9CA3AF", letterSpacing: -0.2 },
  navLabelActive: { fontWeight: "700", color: "#0047AB" },

  // NOTIFICATIONS MODAL
  notificationsModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    paddingTop: 60,
  },

  notificationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  notificationsTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  notificationsList: {
    flex: 1,
  },

  notificationItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },

  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationContent: {
    flex: 1,
    justifyContent: "center",
  },

  notificationItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  notificationItemMessage: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  notificationItemTime: {
    fontSize: 11,
    color: "#CBD5E1",
  },

  noNotificationsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  noNotificationsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#9CA3AF",
  },
});
