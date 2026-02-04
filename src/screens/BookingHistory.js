import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  loadBookings,
  saveBookings,
  loadParkingData,
  saveParkingData,
} from '../storage/localDB';

export default function BookingHistoryScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await loadBookings();
    setBookings(data.reverse());
  };

  /* ---------- CANCEL BOOKING ---------- */
  const cancelBooking = async (booking) => {
    Alert.alert(
      'Cancel Booking',
      `Cancel booking at ${booking.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const updatedBookings = bookings.filter(
              (b) => b.id !== booking.id
            );

            setBookings(updatedBookings);
            await saveBookings(updatedBookings);

            const parkingData = await loadParkingData();

            const updatedParking = parkingData.map((p) =>
              p.name === booking.name
                ? {
                    ...p,
                    availableSlots:
                      p.availableSlots + (booking.slots || 1),
                  }
                : p
            );

            await saveParkingData(updatedParking);
          },
        },
      ]
    );
  };

  if (bookings.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No bookings yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.sub}>
            Slots booked: {item.slots || 1}
          </Text>

          <Text style={styles.sub}>{item.time}</Text>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => cancelBooking(item)}
          >
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  sub: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
