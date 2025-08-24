import { View, Text, Image } from 'react-native';
import React from 'react';

const HeroCard = ({ name = "Creator", imageUrl = null }) => {
  return (
    <View className="w-24 items-center space-y-1">
      
      <View className="h-20 w-20 rounded-full border-2 border-zinc-800 justify-center items-center">
        <View className="h-[60px] w-[60px]  rounded-full overflow-hidden bg-zinc-700">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white text-xs text-center mt-7">No Img</Text>
          )}
        </View>
      </View>

  
      <Text className="text-white text-xs mt-1 text-center" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default HeroCard;
