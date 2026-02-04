import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { loadParkingData, saveParkingData, saveBooking } from '../storage/localDB';

export default function ParkingDetailScreen({ route, navigation }) {
  const { parking } = route.params;
  const [slots, setSlots] = useState(1);

  const bookSlots = async () => {
    if (slots > parking.availableSlots) {
      Alert.alert('Not enough slots available');
      return;
    }

    const data = await loadParkingData();

    const updated = data.map((p) =>
      p.id === parking.id
        ? { ...p, availableSlots: p.availableSlots - slots }
        : p
    );

    await saveParkingData(updated);

    await saveBooking({
      id: Date.now().toString(),
      name: parking.name,
      distance: parking.distance,
      time: new Date().toLocaleString(),
      slots,
    });

    Alert.alert('Success', 'Parking booked successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{parking.name}</Text>
      <Text style={styles.sub}>
        Available slots: {parking.availableSlots}
      </Text>

      <Text style={styles.label}>Select number of slots</Text>

      <View style={styles.counter}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => setSlots(Math.max(1, slots - 1))}
        >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.count}>{slots}</Text>

        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() =>
            setSlots(Math.min(parking.availableSlots, slots + 1))
          }
        >
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bookBtn} onPress={bookSlots}>
        <Text style={styles.bookText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  sub: { fontSize: 16, color: '#555', marginBottom: 20 },

  label: { fontSize: 16, marginBottom: 10 },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  counterBtn: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
  },

  counterText: { color: '#fff', fontSize: 20 },
  count: { fontSize: 20, marginHorizontal: 20 },

  bookBtn: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  bookText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
