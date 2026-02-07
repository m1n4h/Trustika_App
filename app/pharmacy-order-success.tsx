import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

export default function PharmacyOrderSuccessScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();

  const pharmacyName = params.pharmacyName as string || "Order Medicine";
  const orderNumber = params.orderNumber as string || "TR-8821";
  const estimatedTimeStr = params.estimatedTime as string || "25-40";

  // Parse estimated time and set countdown
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const timeMatch = estimatedTimeStr.match(/(\d+)-(\d+)/);
    if (timeMatch) {
      const avgTime = Math.floor(
        (parseInt(timeMatch[1]) + parseInt(timeMatch[2])) / 2
      );
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

  const handleTrackOrder = () => {
    router.push({
      pathname: "/track",
      params: { orderNumber },
    });
  };

  const handleCallPharmacy = () => {
    // In a real app, would use actual pharmacy phone number
    Linking.openURL("tel:+255700000000").catch(() => {
      alert("Unable to make call");
    });
  };

  const handleViewReceipt = () => {
    router.push("/");
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* NURSE IMAGE */}
          <Image
            source={require("../assets/images/transport/nurse.png")}
            style={styles.nurseImage}
            resizeMode="contain"
          />

          {/* SPACING */}
          <View style={styles.spacing} />

          {/* SUCCESS HEADING */}
          <Text style={[styles.successHeading, { color: colors.text }]}>
            Order Placed
          </Text>
          <Text style={[styles.successHeading, { color: colors.text }]}>
            Successfully!
          </Text>

          {/* ORDER INFO */}
          <View style={styles.orderInfoContainer}>
            <Text style={[styles.orderNumber, { color: colors.text }]}>
              Order #{orderNumber} •
            </Text>
            <Text style={[styles.orderNumber, { color: colors.text }]}>
              {" "}Estimated delivery time:
            </Text>
            <Text style={[styles.estimatedTime, { color: colors.text }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          {/* PHARMACY CARD */}
          <View
            style={[
              styles.pharmacyCard,
              { backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" },
            ]}
          >
            <View style={styles.pharmacyInfo}>
              <Text style={[styles.pharmacyName, { color: colors.text }]}>
                {pharmacyName}
              </Text>
              <Text style={[styles.pharmacyBranch, { color: "#2bee6c" }]}>
                Downtown Branch
              </Text>

              <TouchableOpacity
                style={[
                  styles.callButton,
                  {
                    backgroundColor: isDarkMode ? "#0f172a" : "#f0fdf4",
                  },
                ]}
                onPress={handleCallPharmacy}
              >
                <MaterialIcons name="phone" size={20} color="#2bee6c" />
                <Text style={[styles.callButtonText, { color: "#2bee6c" }]}>
                  Call Pharmacy
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pharmacyImagePlaceholder}>
              <MaterialIcons name="image" size={40} color="#9ca3af" />
            </View>
          </View>

          {/* TRACK ORDER BUTTON */}
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>

          {/* RECEIPT LINK */}
          <TouchableOpacity onPress={handleViewReceipt}>
            <Text style={[styles.receiptText, { color: "#9ca3af" }]}>
              View your receipt in the{" "}
              <Text style={[styles.receiptLink, { color: colors.text }]}>
                Order History
              </Text>
            </Text>
          </TouchableOpacity>

          {/* BACK HOME BUTTON */}
          <TouchableOpacity
            style={[
              styles.backHomeButton,
              {
                backgroundColor: isDarkMode ? "#1e293b" : "#f3f4f6",
                borderColor: colors.border,
              },
            ]}
            onPress={handleBackHome}
          >
            <MaterialIcons name="home" size={20} color="#2bee6c" />
            <Text style={[styles.backHomeButtonText, { color: colors.text }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  nurseImage: {
    width: "100%",
    height: 320,
    marginBottom: 24,
    marginHorizontal: -20,
    marginTop: -20,
  },

  spacing: {
    height: 16,
  },

  successHeading: {
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 50,
    marginBottom: 16,
  },

  orderInfoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },

  estimatedTime: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },

  pharmacyCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
  },

  pharmacyInfo: {
    flex: 1,
    gap: 12,
  },

  pharmacyName: {
    fontSize: 18,
    fontWeight: "700",
  },

  pharmacyBranch: {
    fontSize: 14,
    fontWeight: "500",
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },

  callButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  pharmacyImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },

  trackButton: {
    width: "100%",
    backgroundColor: "#2bee6c",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  trackButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  receiptText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  receiptLink: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  backHomeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },

  backHomeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
