import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const PromoCard = ({
  imageUrl = 'https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?w=1200&auto=format&fit=crop&q=60',
  title = 'Engage Your Audience',
  subtitle = 'Discover the latest tools & trends',
  brightness = -5,
  description = ''
}) => {
  return (
    <View className="w-full  h-full rounded-lg overflow-hidden shadow-md bg-white relative">
      
      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full absolute"
        resizeMode="cover"
        style={{ opacity: 1 - brightness }}
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFillObject}
        className="justify-end"
      >
        <View className="flex p-4">
          <Text className="text-white text-lg font-semibold">{title}</Text>
          <Text className="text-white text-xs mt-1">{subtitle}</Text>
          <Text className="text-white text-xs mt-1">{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default PromoCard;
