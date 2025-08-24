import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSocket } from '../hooks/useSocket';
import SocketHandler from '../sockets/socketHandler';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user , setUser] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setAuthLoading(false);
    };
    loadUser();
  }, []);

  const login = async (user, token) => {
    setUser(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
    setIsAuthenticated(true);
    
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authLoading, user , setUser }}>
      {children}
      {isAuthenticated && user?._id && <SocketHandler userId={user._id}/>}
    </AuthContext.Provider>
  );
};
