import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../lib/ThemeContext";
import MapView, { Marker } from "react-native-maps";

const CANCELLATION_REASONS = [
  "Driver is taking too long",
  "Wrong address",
  "Changed my mind",
  "Found better delivery option",
  "Item no longer needed",
  "Other reasons",
];

export default function OnTheWayScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [progressAnim] = useState(new Animated.Value(0));
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleReasonSelected = (reason: string) => {
    setSelectedReason(reason);
    // Navigate to home after a short delay
    setTimeout(() => {
      setShowCancelModal(false);
      router.push("/");
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* MAP BACKGROUND */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -6.3690,
              longitude: 34.8888,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            <Marker
              coordinate={{
                latitude: -6.3690,
                longitude: 34.8888,
              }}
              title="Tanzania"
            />
          </MapView>
        </View>

        {/* BOTTOM CARD */}
        <View
          style={[
            styles.bottomCard,
            {
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            },
          ]}
        >
          {/* PULL HANDLE */}
          <View
            style={[
              styles.pullHandle,
              { backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB" },
            ]}
          />

          {/* TIME SECTION */}
          <View style={styles.timeSection}>
            <Text style={[styles.timeValue, { color: colors.text }]}>
              12 mins
            </Text>
            <Text style={[styles.timeLabel, { color: "#64748b" }]}>
              Estimated Arrival Time
            </Text>

            {/* PROGRESS BAR */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* DRIVER INFO CARD */}
          <View
            style={[
              styles.driverCard,
              {
                backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                borderColor: isDarkMode ? "#334155" : "#e2e8f0",
              },
            ]}
          >
            {/* DRIVER PHOTO & RATING */}
            <View style={styles.driverPhotoSection}>
              <View style={styles.photoContainer}>
                <View style={styles.driverPhoto}>
                  <MaterialIcons name="person" size={40} color="#2bee6c" />
                </View>
                <View style={styles.ratingBadge}>
                  <MaterialIcons name="star" size={14} color="#fbbf24" />
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>

              {/* DRIVER DETAILS */}
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  Michael T.
                </Text>
                <Text style={[styles.carModel, { color: "#64748b" }]}>
                  White Toyota
                </Text>
                <Text style={[styles.carModel, { color: "#64748b" }]}>
                  Prius
                </Text>
                <Text style={[styles.licensePlate, { color: "#64748b" }]}>
                  Lic: 4XG-990
                </Text>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <MaterialIcons name="call" size={24} color="#2bee6c" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <MaterialIcons name="chat" size={24} color="#2563eb" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* CANCEL BUTTON */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>

          {/* BOTTOM SPACING */}
          <View style={{ height: 20 }} />
        </View>
      </View>

      {/* CANCELLATION MODAL */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              },
            ]}
          >
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Cancel Order
              </Text>
            </View>

            {/* REASON TEXT */}
            <Text style={[styles.reasonText, { color: "#64748b" }]}>
              Please select a reason for cancellation
            </Text>

            {/* REASONS LIST */}
            <ScrollView
              style={styles.reasonsList}
              showsVerticalScrollIndicator={false}
            >
              {CANCELLATION_REASONS.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonItem,
                    {
                      backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                      borderColor:
                        selectedReason === reason
                          ? "#ef4444"
                          : isDarkMode
                          ? "#334155"
                          : "#e2e8f0",
                      borderWidth: selectedReason === reason ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleReasonSelected(reason)}
                >
                  <View
                    style={[
                      styles.reasonCheckbox,
                      {
                        borderColor:
                          selectedReason === reason
                            ? "#ef4444"
                            : "#cbd5e1",
                        backgroundColor:
                          selectedReason === reason
                            ? "#ef4444"
                            : "transparent",
                      },
                    ]}
                  >
                    {selectedReason === reason && (
                      <MaterialIcons name="check" size={16} color="#ffffff" />
                    )}
                  </View>
                  <Text
                    style={[styles.reasonItemText, { color: colors.text }]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* CONFIRM BUTTON */}
            <TouchableOpacity
              style={[
                styles.confirmCancelButton,
                {
                  opacity: selectedReason ? 1 : 0.5,
                },
              ]}
              onPress={() =>
                selectedReason && handleReasonSelected(selectedReason)
              }
              disabled={!selectedReason}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmCancelButtonText}>
                Confirm Cancellation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // MAP SECTION
  mapContainer: {
    flex: 0.55,
    position: "relative",
    overflow: "hidden",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  // BADGES
  badgesContainer: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  driverBadge: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  driverBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },

  // BOTTOM CARD
  bottomCard: {
    flex: 0.55,
    borderTopLeftRadius: 56,
    borderTopRightRadius: 56,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  pullHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 16,
  },

  // TIME SECTION
  timeSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },

  timeValue: {
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 4,
  },

  timeLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 12,
  },

  progressBarContainer: {
    width: 140,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#16a34a",
    borderRadius: 3,
  },

  // DRIVER CARD
  driverCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  driverPhotoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  photoContainer: {
    position: "relative",
  },

  driverPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },

  ratingBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },

  driverDetails: {
    flex: 1,
    gap: 1,
  },

  driverName: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 1,
  },

  carModel: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.2,
  },

  licensePlate: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.4,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },

  // CANCEL BUTTON
  cancelButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  reasonText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    letterSpacing: -0.2,
  },

  reasonsList: {
    marginBottom: 16,
    maxHeight: 350,
  },

  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  reasonCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  reasonItemText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    letterSpacing: -0.2,
  },

  confirmCancelButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
});
