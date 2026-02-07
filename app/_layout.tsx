import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../lib/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} initialRouteName="screens/login">
        <Stack.Screen 
          name="index" 
        />
        <Stack.Screen 
          name="address" 
          options={{ 
            title: "Send to?",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="orders" 
          options={{ 
            title: "My Orders",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="schedule" 
          options={{ 
            title: "Schedule Delivery",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="food/index" 
          options={{ 
            title: "Order Food",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="pharmacy/index" 
          options={{ 
            title: "Order Medicine",
            headerBackTitle: "Back"
          }} 
        />

        <Stack.Screen 
          name="later/index" 
          options={{ 
            title: "Order Later",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="order/index" 
          options={{ 
            title: "Order",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="customer-services" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="payments" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="track" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="orderdetails" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="screens/login" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="screens/forgot-password" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="screens/register" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="screens/HomeScreen" 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack>
      </>
    </ThemeProvider>
  );
}