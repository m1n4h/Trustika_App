import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function LaterScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={24} 
          color="#000" 
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Schedule for Later</Text>
      </View>
      
      <View style={styles.content}>
        <Text>Schedule your order for later delivery</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 16 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});