import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Twitter, Globe } from 'lucide-react-native';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../components/AuthContext';

const googleClientId = Constants.expoConfig.extra.googleClientId;
const iosClientId = Constants.expoConfig.extra.iosClientId;
const backendUrl = Constants.expoConfig.extra.backendUrl;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext);
  console.log(backendUrl);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId : "secrte",
    iosClientId,
    expoClientId: googleClientId,
    useProxy: true,
  });



  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      sendGoogleTokenToBackend(authentication?.idToken);
    }
  }, [response]);

  const sendGoogleTokenToBackend = async (idToken) => {
    try {
      const res = await fetch(`${backendUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Login Failed', data.error || 'Something went wrong');
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      navigation.replace('Main');
    } catch (error) {
      console.error('Google login failed:', error);
      Alert.alert('Login Failed', 'Could not reach the server');
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Email and password are required');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        Toast.show({
            type:'error',
            text1:data.error || data.message
        })
        return;
      }
      console.log(data);
      

    await login(data.user , data.token);
      Toast.show({
        type:'success',
        text1:'Welcome to Raven'
      })
      navigation.replace('Main');
    } catch (err) {
      console.error('Email login failed:', err);
      Alert.alert('Login Failed', 'Could not reach the server');
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="bg-zinc-50 w-full max-w-sm rounded-lg p-8 border border-neutral-300 shadow-md">
        <Text className="text-2xl font-bold text-center text-black mb-6">Welcome to Raven</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />

        <TouchableOpacity
          onPress={handleEmailLogin}
          className="bg-black px-4 py-3 rounded-lg items-center justify-center mb-6"
        >
          <Text className="text-white font-semibold text-base">Sign in </Text>
        </TouchableOpacity>
        <View className="flex-row items-center my-4 -mt-1">
  <View className="flex-1 h-px bg-gray-300" />
  <Text className="mx-3 text-gray-500 font-medium">OR</Text>
  <View className="flex-1 h-px bg-gray-300" />
</View>



        <TouchableOpacity
          onPress={() => promptAsync()}
          className="flex-row bg-white border border-neutral-300 px-4 py-3 rounded-lg items-center justify-center mb-4"
        >
          <Globe color="black" size={18} />
          <Text className="text-black font-medium text-base ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log('X login pressed')}
          className="flex-row bg-black px-4 py-3 rounded-lg items-center justify-center border border-white"
        >
          <Twitter color="white" size={18} />
          <Text className="text-white ml-2 font-medium text-base">Continue with X</Text>
        </TouchableOpacity>
        <View className="mt-6 flex-row justify-center">
  <Text className="text-gray-600">New here? </Text>
  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
    <Text className="text-blue-600 font-medium">Sign up now</Text>
  </TouchableOpacity>
</View>

      </View>
    </View>
  );
}
