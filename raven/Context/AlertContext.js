import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertData, setAlertData] = useState(null);

  const isTokenValid = (token) => {
    console.log('isTokenValid called');

    try {
      const cleanToken = token?.replace(/^"|"$/g, '');

      if (!cleanToken || cleanToken.split('.').length !== 3) {
        console.warn('Malformed token:', cleanToken);
        return false;
      }

      const decoded = jwtDecode(cleanToken);
      console.log('Decoded JWT:', decoded);

      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      } else {
        console.warn(' Token expired:', decoded.exp);
        return false;
      }
    } catch (error) {
      console.error('JWT decode error:', error.message);
      return false;
    }
  };

  const loadAlertToken = async () => {
    const token = await AsyncStorage.getItem('alertToken');
    console.log('Stored alert token:', !!token);

    if (token && isTokenValid(token)) {
      const decoded = jwtDecode(token);
      setAlertData(decoded);
    } else {
      await AsyncStorage.removeItem('alertToken');
      setAlertData(null);
    }
  };

  const receiveAlertToken = async (token) => {
   

    if (isTokenValid(token)) {
      await AsyncStorage.setItem('alertToken', token);
      const decoded = jwtDecode(token);
      setAlertData(decoded);

      const stored = await AsyncStorage.getItem('alertToken');
     
    }
  };

  const clearAlert = async () => {
    console.log('Clearing alert token');
    await AsyncStorage.removeItem('alertToken');
    setAlertData(null);
  };

  useEffect(() => {
    loadAlertToken();
  }, []);

  return (
    <AlertContext.Provider value={{ alertData, receiveAlertToken, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
