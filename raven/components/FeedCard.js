import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';
import { PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react-native';

const { height, width } = Dimensions.get('window');

function extractYouTubeVideoId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const FeedCard = forwardRef(({
  title,
  description,
  tags = [],
  ravenPoints = 0,
  registeredCount = 0,
  type = 'news',
  imageUri = null,
  videoUri = null,
  visible = false
}, ref) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(true);

  const youtubeId = extractYouTubeVideoId(videoUri);
  const isYouTube = !!youtubeId;

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const togglePlayback = async () => {
    if (isYouTube) {
      setIsWebViewVisible(prev => !prev);
    } else if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (isYouTube) {
        setIsWebViewVisible(true);
      } else if (videoRef.current && isVideoReady) {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    },
    pause: async () => {
      if (isYouTube) {
        setIsWebViewVisible(false);
      } else if (videoRef.current && isVideoReady) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    },
  }));

  return (
    <View style={{ height, width, position: 'relative', backgroundColor: 'black' }}>
      {/* --- Background Media --- */}
      {isYouTube && visible ? (
        isWebViewVisible && (
          <WebView
            style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }]}
            source={{
              html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                    <style>
                      html, body {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                        overflow: hidden;
                        background-color: black;
                      }
                      iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        border: none;
                        object-fit: cover;
                      }
                    </style>
                  </head>
                  <body>
                    <iframe
                      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=0&loop=1&playlist=${youtubeId}"
                      allow="autoplay; encrypted-media"
                      allowfullscreen
                    ></iframe>
                  </body>
                </html>
              `
            }}
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
          />
        )
      ) : videoUri ? (
        <View style={StyleSheet.absoluteFill}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={isMuted}
            onReadyForDisplay={() => setIsVideoReady(true)}
          />
        </View>
      ) : imageUri ? (
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111' }]} />
      )}

      {/* --- Controls (Only for native video) --- */}
      {!isYouTube && videoUri && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayback} style={{ marginRight: 12 }}>
            {isPlaying ? (
              <PauseCircle color="white" size={38} />
            ) : (
              <PlayCircle color="white" size={38} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            {isMuted ? <VolumeX color="white" size={30} /> : <Volume2 color="white" size={30} />}
          </TouchableOpacity>
        </View>
      )}

      {/* --- Overlay Content --- */}
      <View style={styles.overlay}>
        {type !== 'news' && (
          <Pressable className="border border-zinc-800 rounded-lg p-2 bg-white mb-2">
            <Text className="text-center font-semibold">Register</Text>
          </Pressable>
        )}
        <Text className="text-white font-bold text-xl mb-1">{title}</Text>
        <Text className="text-zinc-200 text-sm mb-2">{description}</Text>
        <View className="flex-row flex-wrap gap-2 mb-2">
          {tags.map((tag, idx) => (
            <Text
              key={idx}
              className="text-xs text-white bg-white/10 px-2 py-1 rounded-full"
            >
              {tag}
            </Text>
          ))}
        </View>
        {type !== 'news' && (
          <View className="flex-row justify-between items-center">
            <Text className="text-zinc-300 text-sm">👥 {registeredCount} registered</Text>
            <Text className="text-zinc-950 bg-zinc-50 p-1 rounded-lg text-sm font-semibold">
              {ravenPoints} Raven Points
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    zIndex: 20,
  },
});

export default FeedCard;
