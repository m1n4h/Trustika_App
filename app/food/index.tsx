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

const CATEGORIES = [
  { id: 1, name: "All", icon: "dashboard" },
  { id: 2, name: "Burgers", icon: "lunch-dining" },
  { id: 3, name: "Sushi", icon: "rice-bowl" },
  { id: 4, name: "Pizza", icon: "local-pizza" },
  { id: 5, name: "Salads", icon: "local-florist" },
];

const RESTAURANTS = [
  {
    id: 1,
    name: "Green Garden Bistro",
    description: "Signature Green Salad & Healthy Bowls",
    rating: 4.8,
    distance: 1.2,
    delivery: 1.99,
    badge: "Popular",
    image: "🥗",
  },
  {
    id: 2,
    name: "The Urban Grill",
    description: "Premium grilled steaks and artisanal burgers",
    rating: 4.5,
    distance: 0.8,
    delivery: 0,
    badge: "Free Delivery",
    image: "🍖",
  },
  {
    id: 3,
    name: "Sushi Zen",
    description: "Traditional Japanese & Modern Rolls",
    rating: 4.9,
    distance: 2.5,
    delivery: 2.5,
    badge: "Top Rated",
    image: "🍣",
  },
];

export default function FoodScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>("Loading location...");
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [editLocationVisible, setEditLocationVisible] = useState(false);
  const [editedLocation, setEditedLocation] = useState(userLocation);
  const [notifications, setNotifications] = useState([]);

  const filteredRestaurants = RESTAURANTS.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setUserLocation("Location access denied");
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        // Reverse geocode to get address
        let places = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (places && places.length > 0) {
          let place = places[0];
          let address =
            place?.street ||
            place?.name ||
            place?.subregion ||
            place?.city ||
            "Unknown location";
          setUserLocation(address);
        } else {
          setUserLocation("Address not found");
        }
      } catch (error) {
        console.log("Location error:", error);
        setUserLocation("Could not fetch location");
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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="location-on" size={20} color="#2bee6c" />
            <TouchableOpacity>
              <Text style={[styles.deliverText, { color: colors.text }]}>
                DELIVER TO
              </Text>
              <View style={styles.locationRow}>
                <Text
                  style={[styles.addressText, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {userLocation}
                </Text>
                <TouchableOpacity
                  style={styles.editLocationButton}
                  onPress={() => {
                    setEditedLocation(userLocation);
                    setEditLocationVisible(true);
                  }}
                >
                  <MaterialIcons name="edit" size={16} color="#2bee6c" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.headerIcon,
                { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
              ]}
              onPress={() => setNotificationsVisible(true)}
            >
              <MaterialIcons
                name="notifications"
                size={20}
                color={colors.text}
              />
              {notifications.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notifications.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.avatarButton,
                { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
              ]}
            >
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={20} color="#2bee6c" />
              </View>
            </TouchableOpacity>
          </View>
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
              <MaterialIcons
                name="search"
                size={20}
                color="#94a3b8"
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search for restaurants or dishes"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: "#dcfce7" },
              ]}
            >
              <MaterialIcons name="tune" size={20} color="#2bee6c" />
            </TouchableOpacity>
          </View>

          {/* CATEGORIES */}
          <View style={styles.categoriesSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {CATEGORIES.map((category) => (
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
                    size={18}
                    color={
                      selectedCategory === category.id
                        ? "#000"
                        : colors.text
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

          {/* RESTAURANTS SECTION */}
          <View style={styles.restaurantsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Restaurants Near You
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* RESTAURANT CARDS */}
          <View style={styles.restaurantsContainer}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={[
                  styles.restaurantCard,
                  {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: "/restaurant-detail",
                    params: { restaurant: JSON.stringify(restaurant) },
                  });
                }}
              >
                {/* IMAGE */}
                <View
                  style={[
                    styles.restaurantImage,
                    {
                      backgroundColor: isDarkMode ? "#0f172a" : "#e5e7eb",
                    },
                  ]}
                >

                  {/* HEART ICON */}
                  <TouchableOpacity style={styles.heartButton}>
                    <MaterialIcons
                      name="favorite-border"
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>

                {/* INFO */}
                <View style={styles.restaurantInfo}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.restaurantName,
                        { color: colors.text },
                      ]}
                    >
                      {restaurant.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons
                        name="star"
                        size={16}
                        color="#2bee6c"
                      />
                      <Text style={styles.rating}>
                        {restaurant.rating}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.description,
                      { color: "#64748b" },
                    ]}
                    numberOfLines={1}
                  >
                    {restaurant.description}
                  </Text>

                  {/* FOOTER */}
                  <View style={styles.restaurantFooter}>
                    <View style={styles.deliveryInfo}>
                      <MaterialIcons
                        name="location-on"
                        size={14}
                        color="#64748b"
                      />
                      <Text style={styles.distance}>
                        {restaurant.distance}km
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
            ) : (
              <View style={styles.noResultsContainer}>
                <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                <Text style={[styles.noResultsText, { color: colors.text }]}>
                  No restaurants found
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* BOTTOM NAVIGATION */}
      {/* EDIT LOCATION MODAL */}
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
              notifications.map((notification) => (
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

  deliverText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  addressText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
    maxWidth: 180,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(43, 238, 108, 0.2)",
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    alignItems: "center",
  },

  searchBar: {
    flex: 1,
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

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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

  // RESTAURANTS
  restaurantsHeader: {
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

  restaurantsContainer: {
    gap: 16,
  },

  restaurantCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  restaurantImage: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  foodEmoji: {
    fontSize: 80,
  },

  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  timeBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  timeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.2,
  },

  popularBadge: {
    position: "absolute",
    bottom: 12,
    left: 140,
    backgroundColor: "#2bee6c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  popularBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.2,
  },

  restaurantInfo: {
    padding: 12,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2bee6c",
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    letterSpacing: -0.2,
  },

  restaurantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  distance: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    marginRight: 8,
  },

  delivery: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2bee6c",
  },

  orderButton: {
    backgroundColor: "#2bee6c",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },

  orderButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#000",
    letterSpacing: -0.2,
  },

  // BOTTOM NAVIGATION
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  navItem: {
    alignItems: "center",
    gap: 4,
  },

  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2bee6c",
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

  // NOTIFICATION BADGE
  notificationBadge: {
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

  notificationBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
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

  // LOCATION ROW WITH EDIT BUTTON
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editLocationButton: {
    padding: 4,
  },

  // EDIT LOCATION MODAL
  editLocationModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    justifyContent: "center",
    alignItems: "center",
  },

  editLocationContainer: {
    borderRadius: 16,
    width: "85%",
    maxHeight: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 14,
  },

  editLocationButtons: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2bee6c",
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
