// context/LocationContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { AuthContext } from '../components/AuthContext';

const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

export const LocationContext = createContext();
 const backendUrl = Constants.expoConfig.extra.backendUrl;



TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);

      if (!user || !user._id) {
        console.warn('No user found in AsyncStorage for location update.');
        return;
      }

      const response = await axios.post(`${backendUrl}/location/fetch`, {
        userId: user._id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Location sent:', location.coords);
    } catch (err) {
      console.error('Failed to send location:', err);
    }
  }
});


export const LocationProvider = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);


  useEffect(() => {
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required for this feature.');
        return;
      }

      setHasPermission(true);

      const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!isRunning) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 15000, 
          distanceInterval: 10,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Tracking your location',
            notificationBody: 'Your location is being used in background',
          },
        });
      }
    };

    startLocationTracking();
  }, []);

  return (
    <LocationContext.Provider value={{ hasPermission }}>
      {children}
    </LocationContext.Provider>
  );
};
