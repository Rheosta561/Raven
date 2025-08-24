import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Twitter, Globe } from 'lucide-react-native';
import { AuthContext } from '../components/AuthContext';

const backendUrl = Constants.expoConfig.extra.backendUrl;

export default function Signup() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useContext(AuthContext);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill out all fields');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Signup Failed', data.error || 'Something went wrong');
        return;
      }

     await login(data.user , data.token);
      navigation.replace('Main');
    } catch (err) {
      console.error('Signup failed:', err);
      Alert.alert('Signup Failed', 'Could not reach the server');
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="bg-zinc-50 w-full max-w-sm rounded-lg p-8 border border-neutral-300 shadow-md">
        <Text className="text-2xl font-bold text-center text-black mb-6">Create your Raven account</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="mb-4 px-4 py-3 border border-neutral-300 rounded-lg text-black bg-white"
        />
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
          onPress={handleSignup}
          className="bg-black px-4 py-3 rounded-lg items-center justify-center mb-6"
        >
          <Text className="text-white font-semibold text-base">Sign up</Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-4 -mt-1">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-3 text-gray-500 font-medium">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          onPress={() => console.log('Google signup pressed')}
          className="flex-row bg-white border border-neutral-300 px-4 py-3 rounded-lg items-center justify-center mb-4"
        >
          <Globe color="black" size={18} />
          <Text className="text-black font-medium text-base ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log('X signup pressed')}
          className="flex-row bg-black px-4 py-3 rounded-lg items-center justify-center border border-white"
        >
          <Twitter color="white" size={18} />
          <Text className="text-white ml-2 font-medium text-base">Continue with X</Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-blue-600 font-medium">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
