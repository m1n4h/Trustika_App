import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Clipboard,
  Animated,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../lib/ThemeContext";
import * as Location from "expo-location";

const DELIVERY_FEE = 5000; // TSh

export default function PharmacyCheckoutScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();

  const initialCart = params.cart ? JSON.parse(params.cart as string) : [];
  const pharmacyName = params.pharmacy as string;

  const [userLocation, setUserLocation] = useState<string>("Getting location...");
  const [editLocationVisible, setEditLocationVisible] = useState(false);
  const [editedLocation, setEditedLocation] = useState(userLocation);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [cart, setCart] = useState(initialCart);
  const panResponders = useRef<{[key: string]: any}>({});
  const translateX = useRef<{[key: string]: Animated.Value}>({});

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
          setEditedLocation(address);
        }
      } catch (error) {
        console.log("Location error:", error);
      }
    })();
  }, []);

  const createPanResponder = (itemId: string | number) => {
    if (!translateX.current[itemId]) {
      translateX.current[itemId] = new Animated.Value(0);
    }

    if (!panResponders.current[itemId]) {
      panResponders.current[itemId] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dx < 0) {
            Animated.event([null, { dx: translateX.current[itemId] }], {
              useNativeDriver: false,
            })(evt, gestureState);
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < -100) {
            Animated.spring(translateX.current[itemId], {
              toValue: -80,
              useNativeDriver: false,
            }).start();
          } else {
            Animated.spring(translateX.current[itemId], {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        },
      });
    }

    return panResponders.current[itemId];
  };

  const removeFromCart = (itemId: string | number) => {
    setCart(cart.filter((item: any) => item.id !== itemId));
    if (translateX.current[itemId]) {
      Animated.spring(translateX.current[itemId], {
        toValue: -300,
        useNativeDriver: false,
      }).start(() => {
        delete translateX.current[itemId];
        delete panResponders.current[itemId];
      });
    }
  };

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.emptyCart}>
            <MaterialIcons name="shopping-cart" size={64} color="#94a3b8" />
            <Text style={[styles.emptyCartText, { color: colors.text }]}>
              Your cart is empty
            </Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlaceOrder = async () => {
    const orderNumber = Math.random().toString(36).substring(7).toUpperCase();
    
    Clipboard.setString(orderNumber);
    
    Alert.alert("Order Placed!", `Order #${orderNumber} confirmed`);
    
    router.push({
      pathname: "/pharmacy-order-success",
      params: {
        orderNumber,
        pharmacyName,
        estimatedTime: "25-40",
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ORDER SUMMARY SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>ORDER SUMMARY</Text>

            {cart.map((item: any) => {
              const panResponder = createPanResponder(item.id);
              const translateXValue = translateX.current[item.id] || new Animated.Value(0);

              return (
                <View key={item.id} style={styles.orderItemContainer}>
                  <TouchableOpacity
                    style={styles.deleteBackground}
                    onPress={() => removeFromCart(item.id)}
                    activeOpacity={1}
                  >
                    <MaterialIcons name="delete" size={24} color="#fff" />
                  </TouchableOpacity>

                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      styles.orderItem,
                      {
                        backgroundColor: isDarkMode ? "#1e293b" : "#f9fafb",
                        transform: [{ translateX: translateXValue }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.itemImage,
                        {
                          backgroundColor: isDarkMode ? "#0f172a" : "#e5e7eb",
                        },
                      ]}
                    />

                    <View style={styles.itemDetails}>
                      <Text style={[styles.itemName, { color: colors.text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemPrice, { color: "#2bee6c" }]}>
                        TSh {item.price.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.itemQuantity}>
                      <Text style={[styles.quantityText, { color: colors.text }]}>
                        {item.quantity}
                      </Text>
                      <Text style={[styles.quantityLabel, { color: "#64748b" }]}>x</Text>
                    </View>
                  </Animated.View>
                </View>
              );
            })}
          </View>

          {/* SPECIAL INSTRUCTIONS SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              SPECIAL INSTRUCTIONS
            </Text>

            <TextInput
              style={[
                styles.instructionsInput,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#f9fafb",
                  color: colors.text,
                  borderColor: isDarkMode ? "#334155" : "#e5e7eb",
                },
              ]}
              placeholder="Notes for the pharmacist (e.g., allergies, generic preference...)"
              placeholderTextColor="#94a3b8"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* PAYMENT METHOD SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              PAYMENT METHOD
            </Text>

            <View
              style={[
                styles.paymentMethod,
                { backgroundColor: isDarkMode ? "#1e293b" : "#f9fafb" },
              ]}
            >
              <View style={styles.paymentContent}>
                <MaterialIcons name="money" size={24} color="#2bee6c" />
                <Text style={[styles.paymentText, { color: colors.text }]}>
                  Cash on Delivery
                </Text>
              </View>
              <MaterialIcons name="check-circle" size={24} color="#2bee6c" />
            </View>
          </View>

          {/* PRICING SUMMARY */}
          <View style={styles.section}>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: "#64748b" }]}>Subtotal</Text>
              <Text style={[styles.pricingValue, { color: colors.text }]}>
                TSh {subtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.pricingRow}>
              <Text style={[styles.pricingLabel, { color: "#64748b" }]}>Delivery Fee</Text>
              <Text style={[styles.pricingValue, { color: colors.text }]}>
                TSh {DELIVERY_FEE.toLocaleString()}
              </Text>
            </View>

            <View style={[styles.pricingDivider, { backgroundColor: isDarkMode ? "#334155" : "#e5e7eb" }]} />

            <View style={styles.pricingRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: "#2bee6c" }]}>
                TSh {total.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* CONFIRM ORDER BUTTON */}
        <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
            <MaterialIcons name="check-circle" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 0,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  changeText: {
    color: "#2bee6c",
    fontSize: 14,
    fontWeight: "600",
  },

  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(43, 238, 108, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  deliveryInfo: {
    flex: 1,
  },

  deliveryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  deliveryAddress: {
    fontSize: 13,
  },

  orderItemContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 0,
  },

  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
    width: "100%",
    zIndex: 1,
  },

  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    flexShrink: 0,
  },

  itemDetails: {
    flex: 1,
    minWidth: 0,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },

  itemQuantity: {
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },

  quantityText: {
    fontSize: 16,
    fontWeight: "700",
  },

  quantityLabel: {
    fontSize: 12,
  },

  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  emptyCartText: {
    fontSize: 18,
    fontWeight: "600",
  },

  continueShoppingButton: {
    backgroundColor: "#2bee6c",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },

  continueShoppingText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
  },

  instructionsInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 120,
  },

  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },

  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  paymentText: {
    fontSize: 16,
    fontWeight: "600",
  },

  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  pricingLabel: {
    fontSize: 14,
  },

  pricingValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  pricingDivider: {
    height: 1,
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#2bee6c",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  confirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  // EDIT LOCATION MODAL
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
