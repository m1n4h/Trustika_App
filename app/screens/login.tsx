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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }


    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/screens/HomeScreen");
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your details to access your account.</Text>
          </View>

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

          <TouchableOpacity onPress={() => router.push('/screens/forgot-password')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
          </TouchableOpacity>

          {/* Social buttons removed as requested */}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/screens/register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>

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
  errorText: { color: "#B91C1C" }
});
