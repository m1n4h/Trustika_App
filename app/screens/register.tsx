import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const COUNTRIES = [
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "+257", name: "Burundi", flag: "🇧🇮" },
  { code: "+211", name: "South Sudan", flag: "🇸🇸" },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleRegister = () => {
    setError(null);
    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (phone && phone.replace(/[^0-9]/g, "").length < 7) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/screens/HomeScreen");
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us today</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TouchableOpacity style={styles.phoneRow} onPress={() => setPickerVisible(true)}>
              <View style={styles.countryBox}>
                <Text style={styles.countryText}>{country.flag} {country.code}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="7xxxxxxxx"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/screens/login')}>
              <Text style={styles.registerLink}>Log in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={pickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setPickerVisible(false);
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={[styles.countryName, { marginLeft: 10 }]}>{item.name}</Text>
                  </View>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 36, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 16, color: "#6B7280", marginTop: 8 },
  inputGroup: { marginBottom: 18 },
  label: { color: "#0F172A", fontWeight: "700", marginBottom: 8 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryBox: { borderWidth: 1, borderColor: "#E6EEF6", padding: 12, borderRadius: 12, marginRight: 12 },
  countryText: { color: "#0F172A", fontWeight: "700" },
  phoneInput: { flex: 1 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  input: { borderWidth: 1, borderColor: "#EEF2F7", padding: 14, borderRadius: 12, color: "#0F172A" },
  forgot: { alignSelf: "flex-end", color: "#10B981", marginVertical: 12 },
  button: { backgroundColor: "#10B981", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 16, shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 18 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerText: { color: "#6B7280" },
  registerLink: { color: "#10B981", fontWeight: "700" },
  errorBox: { backgroundColor: "#FEE2E2", padding: 10, borderRadius: 8, marginBottom: 12 },
  errorText: { color: "#B91C1C" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  countryRow: { paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", borderBottomColor: "#F3F4F6", borderBottomWidth: 1 },
  countryName: { color: "#111827" },
  countryCode: { color: "#6B7280" },
  countryFlag: { fontSize: 18 },
  modalClose: { padding: 12, alignItems: "center" },
  modalCloseText: { color: "#10B981", fontWeight: "700" },
});
