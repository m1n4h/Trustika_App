import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

interface Medicine {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

const MEDICINES = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain & Fever relief",
    price: 11980,
    image: "",
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    description: "Immune Support (30 Tabs)",
    price: 24980,
    image: "",
  },
  {
    id: 3,
    name: "Moisturizing Lotion",
    description: "For sensitive skin (200ml)",
    price: 36400,
    image: "",
  },
  {
    id: 4,
    name: "Fluoride Toothpaste",
    description: "Whitening Mint (100g)",
    price: 9000,
    image: "",
  },
  {
    id: 5,
    name: "Adhesive Bandages",
    description: "Waterproof Assorted (20pk)",
    price: 6500,
    image: "",
  },
  {
    id: 6,
    name: "Antibiotic Ointment",
    description: "Triple action (1oz)",
    price: 13500,
    image: "",
  },
];

export default function PharmacyDetailScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();

  const pharmacy = params.pharmacy ? JSON.parse(params.pharmacy as string) : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredMedicines = MEDICINES.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
        },
      ]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
          {/* PHARMACY INFO CARD */}
          {pharmacy && (
            <View
              style={[
                styles.pharmacyCard,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#f0f9ff",
                },
              ]}
            >
              <View style={styles.pharmacyInfo}>
                <Text style={[styles.pharmacyName, { color: colors.text }]}>
                  {pharmacy.name}
                </Text>

                <View style={styles.infoRow}>
                  <MaterialIcons name="schedule" size={16} color="#2bee6c" />
                  <Text style={styles.infoText}>Delivery in 20-30 mins</Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons name="verified" size={16} color="#2bee6c" />
                  <Text style={styles.infoText}>Certified Pharmacist</Text>
                </View>
              </View>
            </View>
          )}

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
                placeholder="Search medicines"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* MEDICINES LIST */}
          <View style={styles.medicinesList}>
            {filteredMedicines.map((medicine) => (
              <View
                key={medicine.id}
                style={[
                  styles.medicineItem,
                  {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                    borderBottomColor: isDarkMode ? "#334155" : "#e5e7eb",
                  },
                ]}
              >
                {/* MEDICINE IMAGE */}
                <View
                  style={[
                    styles.medicineImage,
                    {
                      backgroundColor: isDarkMode ? "#0f172a" : "#f3f4f6",
                    },
                  ]}
                >
                  <Text style={styles.medicineEmoji}>{medicine.image}</Text>
                </View>

                {/* MEDICINE INFO */}
                <View style={styles.medicineInfo}>
                  <Text
                    style={[styles.medicineName, { color: colors.text }]}
                  >
                    {medicine.name}
                  </Text>
                  <Text
                    style={[
                      styles.medicineDescription,
                      { color: "#9CA3AF" },
                    ]}
                  >
                    {medicine.description}
                  </Text>
                  <Text style={styles.medicinePrice}>
                    TSh {medicine.price.toLocaleString()}
                  </Text>
                </View>

                {/* ADD BUTTON */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(medicine)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FLOATING CART BUTTON */}
        {cart.length > 0 && (
          <View style={[styles.floatingCart, { backgroundColor: "#2bee6c" }]}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>{cartCount} Items</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/pharmacy-checkout",
                    params: {
                      cart: JSON.stringify(cart),
                      pharmacy: pharmacy?.name,
                    },
                  });
                }}
              >
                <Text style={styles.viewCartText}>View Cart</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cartRight}>
              <Text style={styles.cartTotal}>TSh {(cartTotal).toLocaleString()}</Text>
              <MaterialIcons name="shopping-bag" size={20} color="#000" />
            </View>
          </View>
        )}
      </View>
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

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  // PHARMACY CARD
  pharmacyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 0,
    borderRadius: 16,
    gap: 0,
  },

  pharmacyLogo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  pharmacyInfo: {
    flex: 1,
  },

  pharmacyName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2bee6c",
  },

  // SEARCH
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },

  // MEDICINES LIST
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  medicinesList: {
    paddingHorizontal: 16,
  },

  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },

  medicineImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },

  medicineEmoji: {
    fontSize: 50,
  },

  medicineInfo: {
    flex: 1,
  },

  medicineName: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  medicineDescription: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },

  medicinePrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2bee6c",
    letterSpacing: -0.2,
  },

  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2bee6c",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
  },

  // FLOATING CART
  floatingCart: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cartInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cartCount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
  },

  viewCartText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },

  cartRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cartTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
});
