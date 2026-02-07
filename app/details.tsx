import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../lib/ThemeContext";

// ============================================
// TYPES & INTERFACES
// ============================================
type PackageType = "document" | "box" | "fragile";
type WeightRange = "small" | "medium" | "large";

interface PackageOption {
  type: PackageType;
  title: string;
  icon: string;
}

interface WeightOption {
  type: WeightRange;
  title: string;
  weight: string;
  icon: string;
}

// ============================================
// CONSTANTS
// ============================================
const PACKAGE_TYPES: PackageOption[] = [
  { type: "document", title: "Document", icon: "description" },
  { type: "box", title: "Box", icon: "inventory-2" },
  { type: "fragile", title: "Fragile", icon: "local-bar" },
];

const WEIGHT_RANGES: WeightOption[] = [
  { type: "small", title: "Small", weight: "1-10kg", icon: "shopping-bag" },
  { type: "medium", title: "Medium", weight: "10-25kg", icon: "work" },
  { type: "large", title: "Large", weight: "25kg+", icon: "airplanemode-active" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function DetailsScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("box");
  const [selectedWeight, setSelectedWeight] = useState<WeightRange>("medium");

  // Calculate delivery cost
  const deliveryCost = useMemo(() => {
    const basePrice = 15.0;
    const weightMultiplier = {
      small: 1.0,
      medium: 1.5,
      large: 2.2,
    };
    return (basePrice * weightMultiplier[selectedWeight]).toFixed(2);
  }, [selectedWeight]);

  const handleNextStep = () => {
    router.push("/instructions");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* SCROLLABLE CONTENT */}
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* PACKAGE TYPE SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Package Type
              </Text>
              <Text style={[styles.sectionHelper, { color: "#64748b" }]}>
                Select the category that best fits your item
              </Text>
            </View>

            <View style={styles.packageGrid}>
              {PACKAGE_TYPES.map((pkg) => (
                <PackageCard
                  key={pkg.type}
                  option={pkg}
                  isActive={selectedPackage === pkg.type}
                  onPress={() => setSelectedPackage(pkg.type)}
                  isDarkMode={isDarkMode}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          {/* WEIGHT RANGE SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Weight Range
              </Text>
              <Text style={[styles.sectionHelper, { color: "#64748b" }]}>
                Choose the approximate weight for accurate pricing
              </Text>
            </View>

            <View style={styles.weightContainer}>
              {WEIGHT_RANGES.map((option) => (
                <WeightCard
                  key={option.type}
                  option={option}
                  isActive={selectedWeight === option.type}
                  onPress={() => setSelectedWeight(option.type)}
                  isDarkMode={isDarkMode}
                  colors={colors}
                />
              ))}
            </View>

            {/* COST SUMMARY */}
            <View
              style={[
                styles.costSummary,
                {
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                },
              ]}
            >
              <View style={styles.costContent}>
                <Text
                  style={[
                    styles.costLabel,
                    { color: isDarkMode ? "#ffffff" : "#0f172a" },
                  ]}
                >
                  Delivery Cost
                </Text>
                <Text style={styles.costPrice}>${deliveryCost}</Text>
              </View>

              <View
                style={[
                  styles.insuredBadge,
                  {
                    backgroundColor: isDarkMode ? "rgba(43, 238, 108, 0.1)" : "rgba(43, 238, 108, 0.1)",
                  },
                ]}
              >
                <MaterialIcons name="verified" size={16} color="#2bee6c" />
                <Text style={styles.insuredText}>INSURED</Text>
              </View>
            </View>
          </View>

          {/* Bottom spacer for fixed button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FIXED BOTTOM BUTTON */}
        <SafeAreaView
          style={[
            styles.fixedButtonContainer,
            { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" },
          ]}
          edges={["bottom"]}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}
            activeOpacity={0.9}
          >
            <Text style={styles.nextButtonText}>Next Step</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#0f172a" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================
function PackageCard({
  option,
  isActive,
  onPress,
  isDarkMode,
  colors,
}: {
  option: PackageOption;
  isActive: boolean;
  onPress: () => void;
  isDarkMode: boolean;
  colors: any;
}) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.05 : 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 12,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.packageCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.packageCard,
          {
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            borderColor: isActive ? "#2bee6c" : "transparent",
            borderWidth: 2,
            shadowColor: isActive ? "#2bee6c" : "transparent",
            shadowOpacity: isActive ? 0.3 : 0.05,
            elevation: isActive ? 8 : 2,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.packageIcon,
            {
              backgroundColor: isActive
                ? "rgba(43, 238, 108, 0.1)"
                : isDarkMode
                ? "#334155"
                : "#f1f5f9",
            },
          ]}
        >
          <MaterialIcons
            name={option.icon as any}
            size={28}
            color={isActive ? "#2bee6c" : isDarkMode ? "#94a3b8" : "#cbd5e1"}
          />
        </View>

        <Text
          style={[
            styles.packageTitle,
            {
              color: colors.text,
              fontWeight: isActive ? "700" : "600",
            },
          ]}
        >
          {option.title}
        </Text>

        {isActive && (
          <View style={styles.checkBadge}>
            <MaterialIcons name="check" size={14} color="#000" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function WeightCard({
  option,
  isActive,
  onPress,
  isDarkMode,
  colors,
}: {
  option: WeightOption;
  isActive: boolean;
  onPress: () => void;
  isDarkMode: boolean;
  colors: any;
}) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.02 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.02 : 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 10,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.weightCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.weightCard,
          {
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            borderColor: isActive ? "#2bee6c" : isDarkMode ? "transparent" : "transparent",
            borderWidth: 2,
            shadowColor: isActive ? "#2bee6c" : "transparent",
            shadowOpacity: isActive ? 0.2 : 0.05,
            elevation: isActive ? 6 : 1,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.weightContent}>
          <View
            style={[
              styles.weightIcon,
              {
                backgroundColor: isActive
                  ? "rgba(43, 238, 108, 0.1)"
                  : isDarkMode
                  ? "#334155"
                  : "#f1f5f9",
              },
            ]}
          >
            <MaterialIcons
              name={option.icon as any}
              size={20}
              color={isActive ? "#2bee6c" : isDarkMode ? "#94a3b8" : "#cbd5e1"}
            />
          </View>

          <View style={styles.weightInfo}>
            <Text
              style={[
                styles.weightTitle,
                {
                  color: colors.text,
                  fontWeight: isActive ? "700" : "600",
                },
              ]}
            >
              {option.title}
            </Text>
            <Text
              style={[
                styles.weightSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {option.weight}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.radioButton,
            {
              borderColor: isActive ? "#2bee6c" : isDarkMode ? "#475569" : "#cbd5e1",
              backgroundColor: isActive ? "#2bee6c" : "transparent",
            },
          ]}
        >
          {isActive && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // SECTIONS
  section: {
    marginBottom: 32,
  },

  sectionHeader: {
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 4,
  },

  sectionHelper: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.2,
  },

  // PACKAGE CARDS (Grid)
  packageGrid: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  packageCardWrapper: {
    flex: 1,
  },

  packageCard: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  packageIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  packageTitle: {
    fontSize: 12,
    letterSpacing: -0.2,
    textAlign: "center",
  },

  checkBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2bee6c",
    justifyContent: "center",
    alignItems: "center",
  },

  // WEIGHT CARDS
  weightContainer: {
    gap: 12,
  },

  weightCardWrapper: {
    width: "100%",
  },

  weightCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  weightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  weightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  weightInfo: {
    flex: 1,
  },

  weightTitle: {
    fontSize: 14,
    letterSpacing: -0.3,
    marginBottom: 2,
  },

  weightSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },

  // COST SUMMARY
  costSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.05,
    elevation: 2,
  },

  costContent: {
    gap: 4,
  },

  costLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  costPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2bee6c",
    letterSpacing: -0.8,
  },

  insuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  insuredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
  },

  // FIXED BUTTON
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },

  nextButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2bee6c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#2bee6c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
});

