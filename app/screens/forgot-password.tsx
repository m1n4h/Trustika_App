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



export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReset = () => {
    setError(null);
    if (!email || !/.+@.+\..+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your phone number to receive a reset link.</Text>
          </View>

          {sent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentTitle}>Reset Sent</Text>
              <Text style={styles.sentText}>We've sent a reset link to your email. Follow the instructions to recover your account.</Text>
              <TouchableOpacity style={styles.returnButton} onPress={() => router.replace('/screens/login')}>
                <Text style={styles.returnText}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

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
              <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={sendReset} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset</Text>}
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  inputGroup: { marginBottom: 18 },
  label: { color: "#0F172A", fontWeight: "700", marginBottom: 8 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryBox: { borderWidth: 1, borderColor: "#E6EEF6", padding: 12, borderRadius: 12, marginRight: 12 },
  countryText: { color: "#0F172A", fontWeight: "700" },
  phoneInput: { flex: 1 },
  input: { borderWidth: 1, borderColor: "#EEF2F7", padding: 14, borderRadius: 12, color: "#0F172A" },
  button: { backgroundColor: "#10B981", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 16 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  sentBox: { padding: 18, backgroundColor: "#ECFDF5", borderRadius: 12, alignItems: "center" },
  sentTitle: { fontSize: 20, fontWeight: "800", color: "#065F46", marginBottom: 8 },
  sentText: { color: "#065F46", textAlign: "center", marginBottom: 12 },
  returnButton: { backgroundColor: "#065F46", padding: 12, borderRadius: 10 },
  returnText: { color: "#fff", fontWeight: "700" },
  countryRow: { paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", borderBottomColor: "#F3F4F6", borderBottomWidth: 1 },
  countryName: { color: "#111827" },
  countryCode: { color: "#6B7280" },
  countryFlag: { fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "60%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalClose: { padding: 12, alignItems: "center" },
  modalCloseText: { color: "#10B981", fontWeight: "700" },
});