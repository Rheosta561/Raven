import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, Image, Dimensions, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import FeedCard from '../components/FeedCard';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const { height } = Dimensions.get('window');

const RavenFeed = () => {
  const feedRefs = useRef([]);
  const [feeds, setFeeds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  const backendUrl = Constants.expoConfig.extra.backendUrl;

  // Get user location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      console.log("User location:", loc.coords);
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // Fetch feeds when location is available
  useEffect(() => {
    if (location) {
      fetchFeeds(1);
    }
  }, [location]);

  const fetchFeeds = async (pageNum = 1) => {
    try {
      if (!location) return;
      if (pageNum === 1) setLoading(true);

      const res = await axios.get(
        `${backendUrl}/feed/feed/?page=${pageNum}&limit=5&lat=${location.latitude}&long=${location.longitude}`
      );

      if (res.data.success) {
        if (pageNum === 1) {
          setFeeds(res.data.feeds);
        } else {
          setFeeds((prev) => [...prev, ...res.data.feeds]);
        }
        setTotalPages(res.data.pagination.totalPages);
        setPage(res.data.pagination.currentPage);
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);

      feedRefs.current.forEach((ref, idx) => {
        if (ref) {
          if (idx === newIndex) {
            ref.play?.();
          } else {
            ref.pause?.();
          }
        }
      });

      if (newIndex + 2 >= feeds.length && page < totalPages) {
        fetchFeeds(page + 1);
      }
    }
  }, [feeds, page, totalPages]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="bg-black flex-1 relative">
      <View className="absolute top-12 left-4 z-10">
        <Image
          source={require('../assets/WatchLogo.png')}
          style={{
            width: 180,
            height: 100,
            resizeMode: 'contain',
          }}
        />
      </View>

      <FlatList
  data={feeds}
  keyExtractor={(item, index) => item._id || index.toString()}
  renderItem={({ item, index }) => (
    <FeedCard
      ref={(ref) => (feedRefs.current[index] = ref)}
      {...item}
      visible={index === currentIndex}
    />
  )}
  pagingEnabled
  snapToInterval={height}
  decelerationRate="fast"
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RavenFeed;
