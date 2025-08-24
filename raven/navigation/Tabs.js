import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { Home, Tv } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RavenCallScreen from '../screens/RavenCallScreen';
import RavenFeed from '../screens/RavenFeed';

import { AuthContext } from '../components/AuthContext';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { user } = useContext(AuthContext);
  const profileImage = user?.avatar || 'https://i.pravatar.cc/100';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          height: 70,
          overflow: 'hidden',
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Profile') {
            return (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 14,
                  borderWidth: focused ? 2 : 0,
                  borderColor: 'white',
                }}
              />
            );
          }

          if (route.name === 'RavenCall') {
            return (
              <Image
                source={require('../assets/Raven.png')}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'cover',
                }}
              />
            );
          }

          const icons = {
            Home: Home,
            RavenFeed: Tv,
          };
          const IconComponent = icons[route.name];
          return <IconComponent color="white" size={26} strokeWidth={focused ? 2 : 1.5} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="RavenCall" component={RavenCallScreen} />
      <Tab.Screen name="RavenFeed" component={RavenFeed} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
