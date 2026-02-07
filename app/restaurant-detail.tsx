import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

const MENU_ITEMS = [
  {
    id: 1,
    category: "Starters",
    items: [
      {
        id: 101,
        name: "Crispy Spring Rolls",
        description: "4 pieces with sweet chili dipping sauce and fresh mint.",
        price: "16,000 TSh",
        image: "🥟",
      },
      {
        id: 102,
        name: "Truffle Parm Fries",
        description: "Golden fries tossed in truffle oil and aged parmesan.",
        price: "22,000 TSh",
        image: "🍟",
      },
    ],
  },
  {
    id: 2,
    category: "Main Course",
    items: [
      {
        id: 201,
        name: "Avocado Zinger Burger",
        description: "Spicy chicken, fresh avocado, brioche bun, house sauce.",
        price: "32,000 TSh",
        image: "🍔",
      },
      {
        id: 202,
        name: "Grilled Salmon Fillet",
        description: "Fresh Atlantic salmon with lemon butter and herbs.",
        price: "47,000 TSh",
        image: "🐟",
      },
    ],
  },
  {
    id: 3,
    category: "Desserts",
    items: [
      {
        id: 301,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center and vanilla ice cream.",
        price: "20,000 TSh",
        image: "🍰",
      },
      {
        id: 302,
        name: "Berry Cheesecake",
        description: "NY style cheesecake with fresh mixed berries.",
        price: "21,000 TSh",
        image: "🍪",
      },
    ],
  },
  {
    id: 4,
    category: "Beverages",
    items: [
      {
        id: 401,
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice.",
        price: "12,000 TSh",
        image: "🧃",
      },
      {
        id: 402,
        name: "Iced Coffee",
        description: "Cold brew coffee with ice and milk.",
        price: "14,000 TSh",
        image: "☕",
      },
    ],
  },
];

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();
  const restaurant = params ? JSON.parse(params.restaurant as string) : null;

  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [cart, setCart] = useState<any[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState("123 Green Valley Ave");

  const currentCategoryItems = MENU_ITEMS.find(
    (cat) => cat.category === selectedCategory
  )?.items || [];

  const addToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  if (!restaurant) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

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
          {/* RESTAURANT INFO */}
          <View
            style={[
              styles.restaurantCard,
              {
                backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
              },
            ]}
          >
            <View style={styles.restaurantImageContainer}>
            </View>

            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text }]}>
                {restaurant.name}
              </Text>

              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={18} color="#2bee6c" />
                <Text
                  style={[
                    styles.rating,
                    { color: colors.text },
                  ]}
                >
                  {restaurant.rating} ({restaurant.reviews || "100+"})
                </Text>
              </View>

              <Text style={[styles.cuisine, { color: colors.text }]}>
                {restaurant.description}
              </Text>
            </View>
          </View>

          {/* CATEGORY TABS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesTabs}
          >
            {MENU_ITEMS.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  {
                    borderBottomColor:
                      selectedCategory === category.category ? "#2bee6c" : "transparent",
                  },
                ]}
                onPress={() => setSelectedCategory(category.category)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    {
                      color:
                        selectedCategory === category.category
                          ? "#2bee6c"
                          : colors.text,
                      fontWeight:
                        selectedCategory === category.category ? "700" : "600",
                    },
                  ]}
                >
                  {category.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* MENU SECTION TITLE */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory}
          </Text>

          {/* MENU ITEMS */}
          <View style={styles.menuContainer}>
            {currentCategoryItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.menuItem,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.menuItemImage}>
                </View>

                <View style={styles.menuItemContent}>
                  <Text style={[styles.itemName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>
                    {item.price}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* CART BUTTON - FIXED AT BOTTOM IN SAFE AREA */}
        {cart.length > 0 && (
          <SafeAreaView edges={["bottom"]} style={styles.cartButtonContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => {
                router.push({
                  pathname: "/cart",
                  params: {
                    cart: JSON.stringify(cart),
                    location: deliveryLocation,
                  },
                });
              }}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
              <Text style={styles.cartButtonText}>View Cart</Text>
              <Text style={styles.cartTotal}>{cartTotal.toLocaleString()} TSh</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingBottom: 20,
  },

  restaurantCard: {
    margin: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  restaurantImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },

  restaurantImage: {
    fontSize: 80,
  },

  restaurantInfo: {
    gap: 8,
  },

  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  rating: {
    fontSize: 14,
    fontWeight: "600",
  },

  cuisine: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  categoriesTabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },

  categoryTab: {
    paddingBottom: 8,
    borderBottomWidth: 2,
  },

  categoryTabText: {
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },

  menuContainer: {
    paddingHorizontal: 16,
  },

  menuItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
    alignItems: "flex-start",
  },

  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },

  itemImage: {
    fontSize: 40,
  },

  menuItemContent: {
    flex: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  itemDescription: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },

  addButton: {
    backgroundColor: "#2bee6c",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },

  addButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },

  cartButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },

  cartButton: {
    backgroundColor: "#2bee6c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  cartBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  cartButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },

  cartTotal: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
