import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import ParkingDetailScreen from './src/screens/ParkingDetailScreen';
import BookingHistoryScreen from './src/screens/BookingHistory';
import MenuScreen from './src/screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ParkingDetail" component={ParkingDetailScreen} />
        <Stack.Screen name="History" component={BookingHistoryScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
