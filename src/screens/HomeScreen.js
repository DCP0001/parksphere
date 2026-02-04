import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import {
  loadParkingData,
  saveParkingData,
  saveBooking,
} from '../storage/localDB';

import seedParking from '../data/seedParking';

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  /* ---------- DISTANCE ---------- */
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    const stored = await loadParkingData();
    const base = stored || seedParking;

    const enriched = base.map((p) => ({
      ...p,
      distance: getDistanceKm(
        loc.coords.latitude,
        loc.coords.longitude,
        p.latitude,
        p.longitude
      ),
    }));

    enriched.sort((a, b) => a.distance - b.distance);

    if (!stored) await saveParkingData(enriched);

    setParkingData(enriched);
    setFilteredData(enriched);
    setLoading(false);
  };

  /* ---------- FILTERS ---------- */
  const applyFilters = (text, availableOnly) => {
    let data = [...parkingData];
    if (availableOnly) data = data.filter((p) => p.availableSlots > 0);
    if (text)
      data = data.filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
    setFilteredData(data);
  };

  /* ---------- MAP FOCUS ---------- */
  const focusOnParking = (p) => {
    setSelectedId(p.id);
    mapRef.current?.animateToRegion({
      latitude: p.latitude,
      longitude: p.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  /* ---------- BOOK CONFIRM ---------- */
  const confirmBooking = (parking) => {
    Alert.alert(
      'Confirm Booking',
      `Book parking at ${parking.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () =>
            navigation.navigate('ParkingDetail', {
              parking,
            }),
        },
      ]
    );
  };

  if (loading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading PARKSPHERE...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>PARKSPHERE</Text>
          <Text style={styles.headerSubtitle}>Smart Parking Finder</Text>
        </View>
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {filteredData.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              pinColor={p.id === selectedId ? 'blue' : 'red'}
              title={p.name}
            />
          ))}
        </MapView>
      </View>

      {/* LIST */}
      <View style={styles.listContainer}>
        <TextInput
          placeholder="Search parking..."
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            applyFilters(t, onlyAvailable);
          }}
          style={styles.search}
        />

        <View style={styles.filterRow}>
          <Text>Only Available</Text>
          <Switch
            value={onlyAvailable}
            onValueChange={(v) => {
              setOnlyAvailable(v);
              applyFilters(search, v);
            }}
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                focusOnParking(item);
                confirmBooking(item);
              }}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>
                {item.distance.toFixed(2)} km away
              </Text>
              <Text style={styles.sub}>
                Available slots: {item.availableSlots}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    backgroundColor: '#1e90ff',
    paddingTop: StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: { fontSize: 24, color: '#fff', marginRight: 14 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#e6f0ff', fontSize: 12 },

  mapContainer: { flex: 3 },
  map: { flex: 1 },

  listContainer: {
    flex: 2,
    backgroundColor: '#f4f6f8',
    padding: 10,
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  name: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 14, color: '#555', marginTop: 4 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
