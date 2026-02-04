import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.title}>PARKSPHERE</Text>
        <Text style={styles.tagline}>Smart Parking Solution</Text>
      </View>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.text}>🏠 Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.text}>📜 Booking History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e90ff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  brand: {
    marginBottom: 40,
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  tagline: {
    color: '#e6f0ff',
    fontSize: 14,
    marginTop: 4,
  },

  item: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 14,
  },

  text: {
    color: '#fff',
    fontSize: 18,
  },
});
