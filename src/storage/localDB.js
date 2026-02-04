import AsyncStorage from '@react-native-async-storage/async-storage';

const PARKING_KEY = 'PARKING_DATA';
const BOOKING_KEY = 'BOOKING_DATA';

/* ---------- PARKING ---------- */
export const loadParkingData = async () => {
  const data = await AsyncStorage.getItem(PARKING_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveParkingData = async (data) => {
  await AsyncStorage.setItem(PARKING_KEY, JSON.stringify(data));
};

/* ---------- BOOKINGS ---------- */
export const loadBookings = async () => {
  const data = await AsyncStorage.getItem(BOOKING_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBookings = async (data) => {
  await AsyncStorage.setItem(BOOKING_KEY, JSON.stringify(data));
};

export const saveBooking = async (booking) => {
  const existing = await loadBookings();
  await saveBookings([...existing, booking]);
};
