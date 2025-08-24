import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tabs from './Tabs';
import LoginScreen from '../screens/LoginScreen';
import Signup from '../screens/Signup';
import { AuthContext } from '../components/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Signup" component={Signup} />
  {isAuthenticated && <Stack.Screen name="Main" component={Tabs} />}
</Stack.Navigator>

    </NavigationContainer>
  );
}
