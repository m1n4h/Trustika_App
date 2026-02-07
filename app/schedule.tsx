import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';
import { useRouter } from 'expo-router';

type Category = 'food' | 'pharmacy' | 'parcel';

export default function Schedule() {
  const { colors } = useTheme();
  const router = useRouter();

  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Category-specific state
  const [restaurant, setRestaurant] = useState<string>('');
  const [foodType, setFoodType] = useState<string>('');
  const [pharmacyName, setPharmacyName] = useState<string>('');
  const [medicineType, setMedicineType] = useState<string>('');
  const [cargoType, setCargoType] = useState<string>('');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'food', label: 'Food', icon: 'restaurant' },
    { key: 'pharmacy', label: 'Pharmacy', icon: 'local-pharmacy' },
    { key: 'parcel', label: 'Cargo', icon: 'local-shipping' },
  ];

  // Example options (replace with API-driven lists as needed)
  const restaurants = ['Mama Pizza', 'Safi Burgers', 'Green Salad'];
  const foodTypes = ['Fast Food', 'Vegetarian', 'Dessert'];
  const pharmacies = ['City Pharmacy', 'HealthPlus', 'Medico'];
  const medicineTypes = ['OTC', 'Prescription', 'Vitamins'];
  const cargoTypes = ['Small Parcel', 'Box', 'Pallet'];

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      return newDate;
    });
  };

  const onChangeTime = (_: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selected) setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      return newDate;
    });
  };

  const validateAndConfirm = () => {
    const now = new Date();
    if (date <= now) {
      Alert.alert('Invalid time', 'Please select a future date and time.');
      return;
    }

    // Category-specific validation
    if (category === 'food') {
      if (!restaurant || !foodType) {
        Alert.alert('Missing info', 'Please select a restaurant and food type.');
        return;
      }
    }
    if (category === 'pharmacy') {
      if (!pharmacyName || !medicineType) {
        Alert.alert('Missing info', 'Please select a pharmacy and medicine type.');
        return;
      }
    }
    if (category === 'parcel') {
      if (!cargoType || !dropoffLocation) {
        Alert.alert('Missing info', 'Please select cargo type and set a drop-off location.');
        return;
      }
    }

    const payload: any = { category, datetime: date.toISOString() };
    if (category === 'food') payload.restaurant = restaurant;
    if (category === 'food') payload.foodType = foodType;
    if (category === 'pharmacy') payload.pharmacyName = pharmacyName;
    if (category === 'pharmacy') payload.medicineType = medicineType;
    if (category === 'parcel') payload.cargoType = cargoType;
    if (category === 'parcel') payload.dropoffLocation = dropoffLocation;

    // Fallback navigation: push to home with scheduled data as query param
    router.push({ pathname: '/', params: { scheduled: JSON.stringify(payload) } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Schedule an Order</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose a category</Text>
        <View style={styles.categoryRow}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.categoryButton, category === c.key && styles.categoryButtonActive]}
              onPress={() => setCategory(c.key)}
              activeOpacity={0.8}
            >
              <MaterialIcons name={c.icon as any} size={28} color={category === c.key ? '#fff' : '#111827'} />
              <Text style={[styles.categoryLabel, category === c.key && styles.categoryLabelActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pick date & time</Text>

        <View style={styles.pickersRow}>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <MaterialIcons name="calendar-today" size={20} color="#111827" />
            <Text style={styles.pickerText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
            <MaterialIcons name="access-time" size={20} color="#111827" />
            <Text style={styles.pickerText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        )}

        {/* Category-specific inputs */}
        {category === 'food' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Restaurant</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {restaurants.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.smallOption, restaurant === r && styles.smallOptionActive]}
                  onPress={() => setRestaurant(r)}
                >
                  <Text style={[styles.smallOptionText, restaurant === r && styles.smallOptionTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Food Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {foodTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.smallOption, foodType === t && styles.smallOptionActive]}
                  onPress={() => setFoodType(t)}
                >
                  <Text style={[styles.smallOptionText, foodType === t && styles.smallOptionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {category === 'pharmacy' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Pharmacy</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {pharmacies.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.smallOption, pharmacyName === p && styles.smallOptionActive]}
                  onPress={() => setPharmacyName(p)}
                >
                  <Text style={[styles.smallOptionText, pharmacyName === p && styles.smallOptionTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Medicine Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {medicineTypes.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.smallOption, medicineType === m && styles.smallOptionActive]}
                  onPress={() => setMedicineType(m)}
                >
                  <Text style={[styles.smallOptionText, medicineType === m && styles.smallOptionTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {category === 'parcel' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cargo Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {cargoTypes.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.smallOption, cargoType === c && styles.smallOptionActive]}
                  onPress={() => setCargoType(c)}
                >
                  <Text style={[styles.smallOptionText, cargoType === c && styles.smallOptionTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Drop-off Location</Text>
            <TextInput
              placeholder="Enter drop-off address"
              value={dropoffLocation}
              onChangeText={setDropoffLocation}
              style={[styles.input, { backgroundColor: colors.sectionBackground }]}
            />
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={validateAndConfirm} activeOpacity={0.9}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#374151',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#10B981',
  },
  categoryLabel: {
    marginTop: 8,
    color: '#111827',
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: '#ffffff',
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    width: '48%',
  },
  pickerText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  smallOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  smallOptionActive: {
    backgroundColor: '#10B981',
  },
  smallOptionText: {
    color: '#111827',
    fontWeight: '600',
  },
  smallOptionTextActive: {
    color: '#fff',
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
});
