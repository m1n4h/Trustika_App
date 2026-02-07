import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../lib/ThemeContext";
import * as Location from "expo-location";

const PHARMACY_CATEGORIES = [
  { id: 1, name: "All", icon: "dashboard" },
  { id: 2, name: "Open Now", icon: "schedule" },
  { id: 3, name: "Top Rated", icon: "star" },
  { id: 4, name: "24/7", icon: "nights-stay" },
];

const PHARMACIES = [
  {
    id: 1,
    name: "City Health Pharmacy",
    description: "Full range of medicines and health supplements",
    rating: 4.8,
    distance: 0.8,
    time: "15-20",
    delivery: 1.99,
    badge: "OPEN NOW",
    badgeColor: "#2bee6c",
    image: "💊",
  },
  {
    id: 2,
    name: "Trustika Premium Care",
    description: "Premium medicines and wellness products",
    rating: 4.9,
    distance: 1.2,
    time: "10-15",
    delivery: 0,
    badge: "TOP RATED",
    badgeColor: "#fbbf24",
    image: "⚕️",
  },
  {
    id: 3,
    name: "Midnight Care Pharma",
    description: "24/7 Emergency medicines and services",
    rating: 4.5,
    distance: 2.5,
    time: "25-30",
    delivery: 2.5,
    badge: "OPEN 24/7",
    badgeColor: "#3b82f6",
    image: "🌙",
  },
];

export default function PharmacyScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>("Loading location...");
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [editLocationVisible, setEditLocationVisible] = useState(false);
  const [editedLocation, setEditedLocation] = useState(userLocation);

  const filteredPharmacies = PHARMACIES.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setUserLocation("Location access denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        let places = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (places && places.length > 0) {
          let place = places[0];
          let address = place?.street || place?.name || place?.city || "Unknown location";
          setUserLocation(address);
        }
      } catch (error) {
        console.log("Location error:", error);
      }
    })();
  }, []);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: isDarkMode ? "#1e293b" : "#f0f9ff" }]}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => {
              setEditedLocation(userLocation);
              setEditLocationVisible(true);
            }}
          >
            <MaterialIcons name="location-on" size={20} color="#2bee6c" />
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>CURRENT LOCATION</Text>
              <View style={styles.locationRow}>
                <Text
                  style={[styles.locationText, { color: isDarkMode ? "#e2e8f0" : "#1f2937" }]}
                  numberOfLines={1}
                >
                  {userLocation}
                </Text>
                <MaterialIcons name="edit" size={16} color="#2bee6c" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                  borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                },
              ]}
            >
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search for medicines or pharmacies"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* CATEGORIES */}
          <View style={styles.categoriesSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {PHARMACY_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        selectedCategory === category.id
                          ? "#2bee6c"
                          : isDarkMode
                          ? "#1e293b"
                          : "#f1f5f9",
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <MaterialIcons
                    name={category.icon}
                    size={16}
                    color={
                      selectedCategory === category.id ? "#000" : colors.text
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          selectedCategory === category.id
                            ? "#000"
                            : colors.text,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* PHARMACIES SECTION */}
          <View style={styles.pharmaciesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pharmacies Near You
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* PHARMACY CARDS */}
          <View style={styles.pharmaciesContainer}>
            {filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy) => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={[
                    styles.pharmacyCard,
                    {
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: "/pharmacy-detail",
                      params: { pharmacy: JSON.stringify(pharmacy) },
                    });
                  }}
                >
                  {/* IMAGE */}
                  <View
                    style={[
                      styles.pharmacyImage,
                      {
                        backgroundColor: isDarkMode ? "#0f172a" : "#e0e7ff",
                      },
                    ]}
                  >
                    {/* RATING BADGE */}
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.ratingText}>{pharmacy.rating}</Text>
                    </View>
                  </View>

                  {/* INFO */}
                  <View style={styles.pharmacyInfo}>
                    {/* STATUS BADGE */}
                    <View style={styles.statusBadge}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: pharmacy.badgeColor },
                        ]}
                      >
                        {pharmacy.badge}
                      </Text>
                    </View>

                    {/* NAME */}
                    <Text
                      style={[styles.pharmacyName, { color: colors.text }]}
                    >
                      {pharmacy.name}
                    </Text>

                    {/* DISTANCE & TIME */}
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <MaterialIcons
                          name="location-on"
                          size={14}
                          color="#2bee6c"
                        />
                        <Text style={styles.detailText}>
                          {pharmacy.distance}km away
                        </Text>
                      </View>
                      <View style={styles.detailDot} />
                      <View style={styles.detailItem}>
                        <MaterialIcons
                          name="schedule"
                          size={14}
                          color="#2bee6c"
                        />
                        <Text style={styles.detailText}>
                          {pharmacy.time} mins
                        </Text>
                      </View>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.pharmacyFooter}>
                      <Text style={[styles.deliveryText, { color: colors.text }]}>
                        {pharmacy.delivery === 0
                          ? "Free Delivery"
                          : `Delivery: $${pharmacy.delivery}`}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.viewStoreButton,
                          {
                            backgroundColor:
                              pharmacy.badge === "OPEN NOW" || pharmacy.badge === "OPEN 24/7"
                                ? "#2bee6c"
                                : "#e5e7eb",
                          },
                        ]}
                        onPress={() => {
                          router.push({
                            pathname: "/pharmacy-detail",
                            params: { pharmacy: JSON.stringify(pharmacy) },
                          });
                        }}
                      >
                        <Text
                          style={[
                            styles.viewStoreText,
                            {
                              color:
                                pharmacy.badge === "OPEN NOW" || pharmacy.badge === "OPEN 24/7"
                                  ? "#000"
                                  : "#9ca3af",
                            },
                          ]}
                        >
                          {pharmacy.badge === "OPEN NOW"
                            ? "Open"
                            : pharmacy.badge === "OPEN 24/7"
                            ? "Open 24/7"
                            : "Closed"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                <Text style={[styles.noResultsText, { color: colors.text }]}>
                  No pharmacies found
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
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

      {/* LOCATION EDIT MODAL */}
      {editLocationVisible && (
        <View style={[styles.editLocationModal, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.editLocationContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.editLocationHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.editLocationTitle, { color: colors.text }]}>
                Edit Delivery Location
              </Text>
              <TouchableOpacity onPress={() => setEditLocationVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.editLocationContent}>
              <Text style={[styles.editLocationLabel, { color: colors.text }]}>
                Enter your delivery address:
              </Text>
              <TextInput
                style={[
                  styles.editLocationInput,
                  {
                    backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter location"
                placeholderTextColor="#94a3b8"
                value={editedLocation}
                onChangeText={setEditedLocation}
              />

              <View style={styles.editLocationButtons}>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setEditLocationVisible(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setUserLocation(editedLocation);
                    setEditLocationVisible(false);
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  locationContainer: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#2bee6c",
    marginBottom: 2,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  locationText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
    flex: 1,
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

  // SCROLL VIEW
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },

  // SEARCH
  searchContainer: {
    marginBottom: 16,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },

  // CATEGORIES
  categoriesSection: {
    marginBottom: 20,
  },

  categoriesList: {
    gap: 10,
    paddingRight: 16,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  // PHARMACIES
  pharmaciesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2bee6c",
    letterSpacing: -0.2,
  },

  pharmaciesContainer: {
    gap: 16,
  },

  pharmacyCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  pharmacyImage: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  pharmacyEmoji: {
    fontSize: 80,
  },

  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },

  pharmacyInfo: {
    padding: 12,
  },

  statusBadge: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  pharmacyName: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  detailText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2bee6c",
  },

  detailDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 4,
  },

  pharmacyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  deliveryText: {
    fontSize: 13,
    fontWeight: "600",
  },

  viewStoreButton: {
    backgroundColor: "#2bee6c",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  viewStoreText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.2,
  },

  // NO RESULTS
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#9CA3AF",
  },

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

  // LOCATION MODAL
  editLocationModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  editLocationContainer: {
    width: "85%",
    borderRadius: 16,
    overflow: "hidden",
  },

  editLocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  editLocationTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  editLocationContent: {
    padding: 20,
  },

  editLocationLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },

  editLocationInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  editLocationButtons: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#2bee6c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});
