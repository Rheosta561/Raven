import React, { use, useState , useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native'; 
import { Linking , Platform } from 'react-native';

const RavenCallCard = ({ isVisible, onClose, location, user }) => {
  const [mapReady, setMapReady] = useState(false);
  const [latitude, setLatitude] = useState(location?.latitude || null);
  const [longitude, setLongitude] = useState(location?.longitude || null);

  useEffect(() => {
    const setLocationFromProps = () => {
      if (location) {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      }
    };
    setLocationFromProps(); 
  
    
  }, [latitude, longitude]);

  // opening the maps app from coordinates , 

  const openMapsApp=() => {
    const isLatLongValid = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
    if(!!isLatLongValid){
      const lat = parseFloat(latitude);
      const long = parseFloat(longitude);
      const label = 'Emergency Location';
      const url = Platform.select({
        ios: `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
        android: `google.navigation:q=${latitude},${longitude}&mode=d`
      });
      Linking.openURL(url);

    }else{
      alert("Location data is unavailable or invalid.");
      return;
    }

  }
  

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.4} style={{ margin: 0 }}>
      <View className="flex-1 justify-center items-center">
        {/* Blur Background */}
        <BlurView intensity={90} tint="dark" className="absolute w-full h-full" />

        {/* Main Card */}
        <View className="bg-black/90 overflow-hidden p-4 rounded-2xl w-[90%] border border-zinc-800 items-center"
          style={styles.shadow}
        >

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} className="absolute top-3 right-3 z-50">
            <X color="white" size={24} />
          </TouchableOpacity>

          {/* Bat Logo */}
          <Image
            source={require('../assets/Raven.png')}
            className="h-20 w-24"
            style={{ tintColor: undefined }} 
          />

          {/* Emergency Heading */}
          <Text className="text-zinc-200 bg-red-950 border border-red-900 w-full text-center p-2 rounded-lg -mt-2 font-semibold text-lg">
            Raven Call, Help Needed
          </Text>

          {/* Map */}
          <View className="mt-4 w-full h-44 rounded-xl overflow-hidden">
            <MapView
              style={{ flex: 1 }} 
              className="w-full h-full"
              initialRegion={{
                latitude: location?.latitude || 28.61,
                longitude: location?.longitude || 77.209,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onMapReady={() => setMapReady(true)}
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Emergency Location"
                />
              )}
            </MapView>

            {!mapReady && (
              <ActivityIndicator
                style={{ position: 'absolute', top: '45%', alignSelf: 'center' }}
                color="gray"
              />
            )}
          </View>

          
          <View>
            <Text className='text-white mt-2 text-center text-sm'>
  Alert: {user?.name || 'Someone'} is in critical distress and requires immediate assistance.{"\n"}
  As a member of the Raven network, your prompt support could be vital.{"\n"}
  Please respond with urgency and care.
</Text>

          </View>

          
          <TouchableOpacity className='bg-zinc-50 p-2 mt-4 w-full rounded-lg' onPress={openMapsApp}>
            <Text className='text-zinc-950 text-center text-lg font-semibold w-full'>Escalate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});

export default RavenCallCard;
