// app/address.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type TransportKey = "truck" | "canter" | "carry" | "motorcycle" | "tricycle" | "walker";

interface TransportOption {
  key: TransportKey;
  title: string;
  price: string;
  time: string;
  capacity: string;
  desc: string;
  image: any;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    key: "walker",
    title: "Walker",
    price: "$5.00",
    time: "2 min",
    capacity: "Small Items",
    desc: "Fast & affordable",
    image: require("../assets/images/transport/walker.png"),
  },
  {
    key: "motorcycle",
    title: "Motorcycle",
    price: "$8.50",
    time: "3 min",
    capacity: "Small Parcels",
    desc: "Quick delivery",
    image: require("../assets/images/transport/motarcycle.png"),
  },
  {
    key: "tricycle",
    title: "Tricycle",
    price: "$12.00",
    time: "4 min",
    capacity: "Medium Items",
    desc: "Comfortable ride",
    image: require("../assets/images/transport/tricycle.png"),
  },
  {
    key: "carry",
    title: "Carry",
    price: "$20.00",
    time: "5 min",
    capacity: "300KG Capacity",
    desc: "Quick & spacious",
    image: require("../assets/images/transport/carry.png"),
  },
  {
    key: "canter",
    title: "Canter",
    price: "$35.00",
    time: "6 min",
    capacity: "1000KG Capacity",
    desc: "Medium cargo",
    image: require("../assets/images/transport/canter.png"),
  },
  {
    key: "truck",
    title: "Truck",
    price: "$50.00",
    time: "7 min",
    capacity: "5000KG Capacity",
    desc: "Heavy cargo",
    image: require("../assets/images/transport/truck.png"),
  },
];

const { height } = Dimensions.get("window");

export default function AddressScreen() {
  const router = useRouter();

  const [loadingLoc, setLoadingLoc] = useState(true);
  const [pickupName, setPickupName] = useState("Current Location");
  const [dropoff, setDropoff] = useState("");
  const [region, setRegion] = useState<Region | null>(null);

  const [selected, setSelected] = useState<TransportKey>("truck");
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);

  // fake destination point (kwa UI/preview)
  const destination = useMemo(() => {
    if (!region) return null;
    return {
      latitude: region.latitude + 0.01,
      longitude: region.longitude + 0.02,
    };
  }, [region]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoadingLoc(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const reg: Region = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        };
        setRegion(reg);

        try {
          const places = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          if (places && places.length > 0) {
            const place = places[0];
            const name =
              place.name ||
              place.street ||
              place.subregion ||
              place.city ||
              "Current Location";
            setPickupName(name);
          }
        } catch (e) {
          console.log("Geocoding failed");
        }
      } catch (e) {
        // ignore (fallback UI)
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  const routePoints = useMemo(() => {
    if (!region || !destination) return [];
    return [
      { latitude: region.latitude, longitude: region.longitude },
      destination,
    ];
  }, [region, destination]);

  const handleDropoffFinish = () => {
    if (dropoff.trim()) {
      setDropoffFocused(false);
      setShowTransportModal(true);
    }
  };

  const onConfirm = () => {
    router.push("/details");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* TOP INPUT CARD - Location Selection */}
        <View style={styles.topInputCard}>
          <View style={styles.inputContainer}>
            {/* Pickup Location - Editable */}
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="#22C55E" />
              <TextInput
                value={pickupName}
                onChangeText={setPickupName}
                placeholder="Current location"
                placeholderTextColor="#9CA3AF"
                style={styles.pickupInput}
                returnKeyType="done"
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerLine} />

            {/* Dropoff Input */}
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="#EF4444" />
              <TextInput
                value={dropoff}
                onChangeText={setDropoff}
                onFocus={() => setDropoffFocused(true)}
                onBlur={handleDropoffFinish}
                placeholder="Enter your drop-off location"
                placeholderTextColor="#9CA3AF"
                style={styles.dropoffInput}
                returnKeyType="done"
              />
            </View>

            {/* Swap Button */}
            <TouchableOpacity style={styles.swapBtnTop}>
              <MaterialIcons name="import-export" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FULL MAP VIEW - No Header */}
        {region ? (
          <MapView style={styles.mapLarge} region={region}>
            {/* pickup marker */}
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="Pickup"
            >
              <View style={styles.markerGreen}>
                <MaterialIcons name="location-on" size={20} color="#fff" />
              </View>
            </Marker>

            {/* destination marker */}
            {destination && (
              <Marker coordinate={destination} title="Drop-off">
                <View style={styles.markerRed}>
                  <MaterialIcons name="location-on" size={20} color="#fff" />
                </View>
              </Marker>
            )}

            {/* route line */}
            {routePoints.length >= 2 && (
              <Polyline
                coordinates={routePoints}
                strokeWidth={4}
                strokeColor="#22C55E"
                lineDashPattern={[12, 8]}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapFallback}>
            <Text style={{ color: "#6B7280" }}>Loading map...</Text>
          </View>
        )}
      </View>

      {/* TRANSPORT SELECTION MODAL - Popup from bottom */}
      <Modal
        visible={showTransportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTransportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setShowTransportModal(false)}
          />

          <View style={styles.transportSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderArea}>
              <Text style={styles.sheetTitle}>Select Transport</Text>
              <TouchableOpacity onPress={() => setShowTransportModal(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {TRANSPORT_OPTIONS.map((option) => (
                <TransportCard
                  key={option.key}
                  active={selected === option.key}
                  onPress={() => setSelected(option.key)}
                  title={option.title}
                  price={option.price}
                  time={option.time}
                  imageSource={option.image}
                  capacity={option.capacity}
                  desc={option.desc}
                />
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm {selected}</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TransportCard({
  active,
  onPress,
  title,
  price,
  time,
  imageSource,
  capacity,
  desc,
}: {
  active: boolean;
  onPress: () => void;
  title: string;
  price: string;
  time: string;
  imageSource: any;
  capacity: string;
  desc: string;
}) {
  const scaleAnim = useRef(new Animated.Value(active ? 1.02 : 1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: active ? 1.02 : 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 10,
    }).start();
  }, [active]);

  return (
    <Animated.View
      style={[
        styles.transportCardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.transportCard, active && styles.transportCardActive]}
        activeOpacity={0.8}
      >
        <View style={[styles.iconBox, active && styles.iconBoxActive]}>
          <Image source={imageSource} style={styles.transportImage} />
          {active && <View style={styles.activeBadge} />}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.transportTitle}>{title}</Text>
          <Text style={styles.transportDesc}>{desc}</Text>
          <View style={styles.transportMeta}>
            <MaterialIcons name="schedule" size={14} color="#6B7280" />
            <Text style={styles.transportTime}>{time}</Text>
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityText}>{capacity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}>{price}</Text>
          <View style={[styles.selectRing, active && styles.selectRingActive]}>
            {active && <MaterialIcons name="check" size={16} color="#22C55E" />}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  // CLOSE BUTTON ON MAP
  closeButtonMap: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  // TOP INPUT CARD
  topInputCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    zIndex: 5,
  },
  inputContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    position: "relative",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  pickupInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    padding: 0,
  },
  dropoffInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    padding: 0,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  swapBtnTop: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // MAP
  mapLarge: { flex: 1 },
  mapFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },

  markerGreen: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#E6FFF0",
  },
  markerRed: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFE6E6",
  },

  // MODAL OVERLAY
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  // TRANSPORT SHEET
  transportSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.75,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeaderArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // TRANSPORT CARD WRAPPER
  transportCardWrapper: {
    marginBottom: 12,
  },

  // TRANSPORT CARD
  transportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transportCardActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.2,
    elevation: 8,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBoxActive: {
    backgroundColor: "#D1FAE5",
    shadowColor: "#22C55E",
    shadowOpacity: 0.15,
    elevation: 6,
  },
  activeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "#fff",
  },
  transportImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  transportTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  transportDesc: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 6,
  },
  transportMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  transportTime: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  capacityBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: "auto",
  },
  capacityText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#92400E",
    letterSpacing: -0.2,
  },

  priceBox: {
    alignItems: "flex-end",
    gap: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#22C55E",
    letterSpacing: -0.3,
  },
  selectRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectRingActive: {
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
    borderWidth: 3,
  },

  // CONFIRM BUTTON
  confirmBtn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
    textTransform: "capitalize",
    letterSpacing: -0.2,
  },
});
