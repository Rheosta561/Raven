import { View, Text } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Flame, Lightbulb } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const InsightCard = ({ 
  title = "Video Title",
  description = "This is a brief description of the video content, designed to attract interest and convey key info.",
  type = "trending", // or "informative"
  viewsFromCoastLink = "23.4K",
  videoId = "dQw4w9WgXcQ"
}) => {
  const Icon = type === "trending" ? Flame : Lightbulb;

  return (
    <View className="rounded-xl overflow-hidden bg-zinc-950 p-2 border border-zinc-800 w-[360px] shadow-md">
        <View className="p-1 space-y-1">
        <View className="flex-row items-center space-x-2">
          <Icon size={18} color="orange" strokeWidth={2} />
          <Text className="text-white font-semibold text-sm uppercase">{type}</Text>
        </View>
        <Text className="text-white font-bold text-lg" numberOfLines={1}>{title}</Text>
        <Text className="text-zinc-300 text-sm" numberOfLines={2}>{description}</Text>
       {/* <View className="self-start bg-zinc-200 px-2 py-1 rounded-full flex-row mt-2 items-center space-x-1">
  <Text className="text-zinc-950 text-sm font-semibold">100k Views</Text>
</View> */}

      </View>
      <YoutubePlayer
        height={200}
        videoId={videoId}
        play={true}
        mute={true}
        webViewStyle={{ borderRadius: 6 }}
      />

    
      

      {/* Bottom info area */}
      
    </View>
  );
};

export default InsightCard;
