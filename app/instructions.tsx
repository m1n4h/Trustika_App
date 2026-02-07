import React from "react";
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
import { useRouter } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

const PACKING_INSTRUCTIONS = [
  "Pack items into a box, bag, or envelope",
  "No prohibited items or goods exceeding local value limits",
  "Hand the package directly to the driver",
  "Ensure it weighs less than the selected weight limit",
];

export default function InstructionsScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const handleOK = () => {
    router.push("/ontheway");
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* SCROLLABLE CONTENT */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* FULL IMAGE BACKGROUND */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/transport/box.png")}
              style={styles.boxImage}
              resizeMode="cover"
            />
          </View>

          {/* CONTENT CARD */}
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              Packing instructions
            </Text>

            <View style={styles.instructionsList}>
              {PACKING_INSTRUCTIONS.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.checkmark}>
                    <MaterialIcons name="check" size={20} color="#16a34a" />
                  </View>
                  <Text
                    style={[styles.instructionText, { color: colors.text }]}
                  >
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>

            {/* SPACER FOR BUTTON */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* FIXED BUTTON */}
        <SafeAreaView
          style={[
            styles.buttonContainer,
            {
              backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            },
          ]}
          edges={["bottom"]}
        >
          <TouchableOpacity
            style={styles.okButton}
            onPress={handleOK}
            activeOpacity={0.9}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
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

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "none",
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    display: "none",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  // IMAGE CONTAINER WITH GRADIENT
  imageContainer: {
    height: 420,
    backgroundColor: "#c19a6b",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  boxImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // CONTENT CARD
  contentCard: {
    paddingHorizontal: 24,
    paddingTop: 32,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    marginTop: -32,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 24,
  },

  // INSTRUCTIONS LIST
  instructionsList: {
    gap: 16,
  },

  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },

  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 2,
  },

  instructionText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    flex: 1,
    letterSpacing: -0.3,
  },

  // BUTTON
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },

  okButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  okButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
});
