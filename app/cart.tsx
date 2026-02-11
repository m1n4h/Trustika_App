import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../lib/ThemeContext";
import * as Location from "expo-location";
import { apiPost } from "../lib/api";

const DELIVERY_FEE = 5000;

export default function CartScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();

  const cartData = params.cart ? JSON.parse(params.cart as string) : [];
  const [deliveryLocation, setDeliveryLocation] = useState("Loading location...");
  const [editLocationVisible, setEditLocationVisible] = useState(false);
  const [editedLocation, setEditedLocation] = useState(deliveryLocation);
  const [cartItems, setCartItems] = useState(cartData);
  const [submitting, setSubmitting] = useState(false);

  // Fetch GPS location on component mount
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setDeliveryLocation("Location access denied");
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
          let address =
            place?.street ||
            place?.name ||
            place?.subregion ||
            place?.city ||
            "Unknown location";
          setDeliveryLocation(address);
          setEditedLocation(address);
        } else {
          setDeliveryLocation("Address not found");
        }
      } catch (error) {
        console.log("Location error:", error);
        setDeliveryLocation("Could not fetch location");
      }
    })();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const numericPrice =
      typeof item.basePrice === "number"
        ? item.basePrice
        : parseFloat(String(item.price).replace(/[^0-9]/g, ""));
    const price = Number.isFinite(numericPrice) ? numericPrice : 0;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + DELIVERY_FEE;

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* DELIVERY TO SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Delivery to
            </Text>

            <View
              style={[
                styles.deliveryCard,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#f0fdf4",
                },
              ]}
            >
              <View
                style={[
                  styles.locationIconContainer,
                  { backgroundColor: "#2bee6c" },
                ]}
              >
                <MaterialIcons name="home" size={20} color="#000" />
              </View>

              <View style={styles.deliveryInfo}>
                <Text style={[styles.deliveryLabel, { color: colors.text }]}>
                  Home
                </Text>
                <Text style={[styles.deliveryAddress, { color: colors.text }]}>
                  {deliveryLocation}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditedLocation(deliveryLocation);
                  setEditLocationVisible(true);
                }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ORDER ITEMS SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Order Items
            </Text>

            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.orderItem,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.itemImage}>
                    {/* Placeholder for item image from database */}
                  </View>

                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.itemPrice, { color: "#2bee6c" }]}>
                      {item.price}
                    </Text>
                  </View>

                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        {
                          backgroundColor: isDarkMode ? "#1e293b" : "#dcfce7",
                        },
                      ]}
                      onPress={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.quantityText,
                        { color: colors.text },
                      ]}
                    >
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        {
                          backgroundColor: isDarkMode ? "#1e293b" : "#dcfce7",
                        },
                      ]}
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyCart}>
                <MaterialIcons name="shopping-cart" size={48} color="#9CA3AF" />
                <Text style={[styles.emptyCartText, { color: colors.text }]}>
                  Your cart is empty
                </Text>
              </View>
            )}
          </View>

          {/* PRICING SUMMARY */}
          {cartItems.length > 0 && (
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#f8f9fa",
                },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Subtotal
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {subtotal.toLocaleString()} TSh
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {DELIVERY_FEE.toLocaleString()} TSh
                </Text>
              </View>

              <View
                style={[
                  styles.summaryDivider,
                  { borderBottomColor: colors.border },
                ]}
              />

              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  Total
                </Text>
                <Text style={styles.totalValue}>
                  {total.toLocaleString()} TSh
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* PLACE ORDER BUTTON */}
        {cartItems.length > 0 && (
          <SafeAreaView edges={["bottom"]} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.placeOrderButton}
              disabled={submitting}
              onPress={async () => {
                try {
                  setSubmitting(true);
                  const response = await apiPost<{ ok: boolean; order: any }>(
                    "/api/v1/orders",
                    {
                      vendorId: params.vendorId,
                      items: cartItems.map((item: any) => ({
                        menuItemId: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        basePrice:
                          typeof item.basePrice === "number"
                            ? item.basePrice
                            : parseFloat(String(item.price).replace(/[^0-9]/g, "")) || 0,
                      })),
                      deliveryAddress: {
                        line1: deliveryLocation,
                      },
                      paymentProvider: "cash",
                    },
                  );

                  if (response.ok) {
                    router.push({
                      pathname: "/order-success",
                      params: {
                        restaurantName: "Trustika Kitchen",
                        estimatedTime: "25-35",
                        orderNumber: response.order.orderNumber,
                      },
                    });
                  } else {
                    alert("Order failed, please try again.");
                  }
                } catch (e) {
                  console.log("Order failed", e);
                  alert("Order failed, please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#000" />
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}

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
                      setDeliveryLocation(editedLocation);
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.4,
  },

  // DELIVERY SECTION
  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  locationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  deliveryInfo: {
    flex: 1,
  },

  deliveryLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  deliveryAddress: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  editButton: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  editButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2bee6c",
  },

  // ORDER ITEMS
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
  },

  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2bee6c",
  },

  quantityText: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },

  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyCartText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#9CA3AF",
  },

  // SUMMARY SECTION
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  summaryDivider: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2bee6c",
  },

  // BUTTON SECTION
  buttonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },

  placeOrderButton: {
    backgroundColor: "#2bee6c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  placeOrderText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
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
