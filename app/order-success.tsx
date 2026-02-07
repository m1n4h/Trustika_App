import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();

  const restaurantName = params.restaurantName as string || "Trustika Kitchen";
  const estimatedTimeStr = params.estimatedTime as string || "25-35";
  const orderNumber = params.orderNumber as string || "#TF-92841-B";
  const restaurantPhone = params.restaurantPhone as string || "";

  // Parse estimated time and set countdown
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const timeMatch = estimatedTimeStr.match(/(\d+)-(\d+)/);
    if (timeMatch) {
      const avgTime = Math.floor((parseInt(timeMatch[1]) + parseInt(timeMatch[2])) / 2);
      return avgTime * 60; // Convert to seconds
    }
    return 30 * 60; // Default 30 minutes
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyOrderNumber = () => {
    Clipboard.setString(orderNumber);
    Alert.alert("Copied!", `Order number ${orderNumber} copied to clipboard`);
  };

  const handleTrackOrder = () => {
    router.push({
      pathname: "/track",
      params: { orderNumber },
    });
  };

  const handleCallRestaurant = () => {
    if (restaurantPhone) {
      // In a real app, would use Linking.openURL(`tel:${restaurantPhone}`)
      alert(`Calling ${restaurantName}: ${restaurantPhone}`);
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  // Configure header with back button
  useFocusEffect(
    React.useCallback(() => {
      // The native back button will automatically navigate back
      // But we ensure it goes to home
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* SUCCESS ICON */}
          <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconBackground,
              { backgroundColor: isDarkMode ? "#1e7a3f" : "#dcfce7" },
            ]}
          >
            <MaterialIcons name="check-circle" size={80} color="#2bee6c" />
          </View>
        </View>

        {/* HEADING */}
        <Text style={[styles.heading, { color: colors.text }]}>
          Order Placed
        </Text>
        <Text style={[styles.heading, { color: colors.text }]}>
          Successfully!
        </Text>

        {/* DESCRIPTION */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionText, { color: "#6B7280" }]}>
            Your meal from{" "}
          </Text>
          <Text style={[styles.descriptionText, { color: "#2bee6c", fontWeight: "700" }]}>
            {restaurantName}
          </Text>
          <Text style={[styles.descriptionText, { color: "#6B7280" }]}>
            {" "}
            is being prepared with care and will be on its way soon.
          </Text>
        </View>

        {/* ESTIMATED ARRIVAL */}
        <View
          style={[
            styles.estimatedContainer,
            {
              backgroundColor: isDarkMode ? "#1e7a3f" : "#dcfce7",
            },
          ]}
        >
          <MaterialIcons name="schedule" size={24} color="#2bee6c" />
          <View>
            <Text style={[styles.estimatedLabel, { color: "#2bee6c" }]}>
              ESTIMATED ARRIVAL
            </Text>
            <Text style={[styles.estimatedTime, { color: colors.text }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        {/* ORDER NUMBER */}
        <TouchableOpacity
          style={[
            styles.orderNumberContainer,
            {
              backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
            },
          ]}
          onPress={handleCopyOrderNumber}
        >
          <View style={styles.orderNumberLeft}>
            <MaterialIcons name="receipt" size={24} color="#9CA3AF" />
            <View>
              <Text style={[styles.orderNumberLabel, { color: "#9CA3AF" }]}>
                Order Number
              </Text>
              <Text style={[styles.orderNumberValue, { color: colors.text }]}>
                {orderNumber}
              </Text>
            </View>
          </View>
          <MaterialIcons name="content-copy" size={20} color="#2bee6c" />
        </TouchableOpacity>

        {/* CALL RESTAURANT */}
        <TouchableOpacity
          style={[
            styles.callContainer,
            {
              backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
            },
          ]}
          onPress={handleCallRestaurant}
        >
          <View style={styles.callLeft}>
            <MaterialIcons name="call" size={24} color="#2bee6c" />
            <View>
              <Text style={[styles.callLabel, { color: colors.text }]}>
                Call Restaurant
              </Text>
              <Text style={[styles.callSubtext, { color: "#9CA3AF" }]}>
                Contact kitchen for updates
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* BUTTONS */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <MaterialIcons name="location-on" size={20} color="#000" />
            <Text style={styles.trackButtonText}>Track My Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleBackHome}
          >
            <MaterialIcons name="home" size={20} color="#2bee6c" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
  },

  // SUCCESS ICON
  iconContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },

  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  // HEADING
  heading: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
  },

  // DESCRIPTION
  descriptionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 32,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  // ESTIMATED ARRIVAL
  estimatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },

  estimatedLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  estimatedTime: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },

  // ORDER NUMBER
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  orderNumberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  orderNumberLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  orderNumberValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  viewDetails: {
    color: "#2bee6c",
    fontWeight: "700",
    fontSize: 14,
  },

  // CALL RESTAURANT
  callContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },

  callLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  callLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },

  callSubtext: {
    fontSize: 13,
    fontWeight: "500",
  },

  // BUTTONS
  buttonsContainer: {
    marginTop: "auto",
    gap: 12,
    paddingBottom: 16,
  },

  trackButton: {
    backgroundColor: "#2bee6c",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  trackButtonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },

  homeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: "#2bee6c",
    backgroundColor: "rgba(43, 238, 108, 0.1)",
  },

  homeButtonText: {
    color: "#2bee6c",
    fontWeight: "700",
    fontSize: 16,
  },

  backHomeText: {
    color: "#2bee6c",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 12,
  },
});
