import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { CommonActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import Constants from 'expo-constants';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfileScreen() {
  const [bloodGroup, setBloodGroup] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('Raven');

  const { logout, user, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const ravenPoints = 100;
  const memberSince = 'March 2023';
  const backendUrl = Constants.expoConfig.extra.backendUrl;

  useEffect(() => {
    if (!user) {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
      );
      return;
    }
    setName(user?.name || 'Raven');
    setBloodGroup(user?.bloodGroup || null);
    setImageUri(user?.avatar || null);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'info', text1: 'Logged Out' });
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user?._id) return;

      const formData = new FormData();

      if (imageUri && !imageUri.startsWith('http')) {
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        const fileType = mime.lookup(imageUri) || 'image/jpeg';

        formData.append('profileImage', {
          uri: imageUri,
          name: fileInfo.uri.split('/').pop(),
          type: fileType,
        });
      }

      if (bloodGroup) {
        formData.append('bloodGroup', bloodGroup);
      }

      const response = await axios.post(
        `${backendUrl}/user/update/${user._id}`,
        formData
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        Toast.show({ type: 'success', text1: 'Profile updated!' });

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser); // ✅ Updates context too!
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Update failed!' });
    }
  };

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-20">
      {/* Profile Image */}
      <TouchableOpacity onPress={handlePickImage} className="self-center mb-6">
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../assets/RavenCall.png')
          }
          className="w-28 h-28 rounded-full"
        />
        <Text className="text-xs text-zinc-300 text-center mt-2">Tap to change photo</Text>
      </TouchableOpacity>

      {/* Name Display */}
      <View className="mb-6">
        <View className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3">
          <Text className="text-white text-base">{name}</Text>
        </View>
      </View>

      {/* Raven Points & Membership */}
      <View className="mb-6">
        <Text className="text-white text-base font-medium mb-1">
          Raven Points: <Text className="text-amber-400">{ravenPoints}</Text>
        </Text>
        <Text className="text-white text-sm">Member since: {memberSince}</Text>
      </View>

      {/* Blood Group Selection */}
      <View className="mb-6">
        <Text className="text-white mb-3 text-sm">Select Blood Group</Text>
        <View className="flex-row flex-wrap gap-2">
          {bloodGroups.map((group) => (
            <TouchableOpacity
              key={group}
              onPress={() => setBloodGroup(group)}
              className={`px-4 py-2 rounded-full border ${
                bloodGroup === group
                  ? 'bg-amber-400 border-amber-400'
                  : 'border-zinc-600'
              }`}
            >
              <Text
                className={`text-sm ${
                  bloodGroup === group ? 'text-zinc-900 font-semibold' : 'text-zinc-200'
                }`}
              >
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      <TouchableOpacity
        onPress={handleUpdateProfile}
        className="bg-amber-400 py-3 rounded-lg mb-4"
      >
        <Text className="text-zinc-950 text-center font-semibold">Save Changes</Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={handleLogout}
        className="bg-zinc-50 py-3 rounded-lg mb-8"
      >
        <Text className="text-zinc-950 text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
