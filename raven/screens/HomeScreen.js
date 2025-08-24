import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '../components/Layout';
import PromoCard from '../components/PromoCard';
import InsightCard from '../components/InsightCard';
import { TrendingUp , Shield } from 'lucide-react-native';
import HeroCard from '../components/HeroCard';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { AuthContext } from '../components/AuthContext';
import axios from 'axios';
import RavenCallCard from '../components/RavenCallCard';


const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.99; 
const backendUrl = Constants.expoConfig.extra.backendUrl;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCard, setShowCard] = useState(true);

  const scrollRef = useRef();
  const {user} = useContext(AuthContext);


  useEffect(() => {
 

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
  

      const response = await axios.post(`${backendUrl}/location/fetch`, {
        userId: user._id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error in getLocation:', error.message || error);
    }
  };

  getLocation();
}, []);

  
  

const promos = [
  {
    id: '1',
    title: 'Raven Call',
    subtitle: 'When danger strikes, issue a Raven Call to alert nearby volunteers instantly. Help arrives before it’s too late — powered by real-time geo-alerts.',
    imageUrl: 'https://cdn.pixabay.com/photo/2024/06/22/16/55/ai-generated-8846672_1280.jpg', 
  },
  {
    id: '2',
    title: 'Live Emergency Feed',
    subtitle: 'Broadcast critical incidents with live video and audio. Nearest Ravens and emergency services are instantly notified to take action.',
    imageUrl: 'https://cdn.pixabay.com/photo/2023/01/12/03/40/batman-7713218_1280.png', 
  },
  {
    id: '3',
    title: 'The Raven Honor',
    subtitle: 'Stand out by helping the helpless. Earn Raven Honors by saving lives, assisting victims, and making a difference when it matters the most.',
    imageUrl: 'https://cdn.pixabay.com/photo/2024/02/22/19/46/ai-generated-8590746_1280.png', 
  },
];



  const handleScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / CARD_WIDTH);
    setActiveIndex(newIndex);
  };

  return (
    <Layout 
      title="Home"
      onNotifyPress={() => alert('Notifications')}
    >
      <View className="flex-1 bg-zinc-950 p-2">
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 , }}
        >
            




        
        <View className="h-1/4 border border-zinc-900 rounded-lg p-2">
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 10 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {promos.map((promo, index) => (
              <View key={promo.id} style={{ width: CARD_WIDTH }}>
                <PromoCard
                  imageUrl={promo.imageUrl}
                  title={promo.title}
                  subtitle={promo.subtitle}
                />
              </View>
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View className="flex-row justify-center mt-2">
            {promos.map((_, i) => (
              <View
                key={i}
                className={`h-2 w-2 mx-1 rounded-full ${
                  i === activeIndex ? 'bg-white' : 'bg-zinc-600'
                }`}
              />
            ))}
          </View>

          
        </View>
       

<View className=" w-full  mt-2">

  <View className='border w-full border-zinc-900 mt-2 p-2 rounded-lg '>
            <View className="flex-row items-center space-x-2 mb-2">
      {/* Icon */}
      <Shield color="red" size={20} strokeWidth={2} />
      
      {/* Title */}
      <Text className="text-zinc-50 text-lg font-semibold pl-2">
        Heroes Of Raven
        
      </Text>
      
    </View>
    <Text className='text-zinc-50 -mt-2 text-xs pl-2'>These warriors proved the true meaning of brother hood and hence are the true Heroes</Text>
  <View className="mt-2 border border-zinc-900 rounded-lg p-2">
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 6  }}
  >
    <View className="flex-row gap-3">
      <HeroCard name="Anubhav" imageUrl="https://images.unsplash.com/photo-1460194436988-671f763436b7?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2FycmlvcnxlbnwwfHwwfHx8MA%3D%3D" />
      <HeroCard name="Ritika" imageUrl="https://images.unsplash.com/photo-1515191107209-c28698631303?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdhcnJpb3J8ZW58MHx8MHx8fDA%3D" />
      <HeroCard name="Rajdeep" imageUrl="https://images.unsplash.com/photo-1615672968547-811b8e470371?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdhcnJpb3J8ZW58MHx8MHx8fDA%3D" />
      <HeroCard name="Karan" imageUrl="https://images.unsplash.com/photo-1563310978-dd47a28323ab?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhcnJpb3J8ZW58MHx8MHx8fDA%3D" />
      <HeroCard name="Yuvraj" imageUrl="https://i.pravatar.cc/100?img=5" />
      <HeroCard name="Neha" imageUrl="https://i.pravatar.cc/100?img=6" />
    </View>
  </ScrollView>
</View>


            


          </View>
  
</View>


        <View className='border border-zinc-900 rounded-lg mt-4 w-full p-2'>
            <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 3 }}
      >
        <InsightCard
  title="How Raven Volunteers Saved a Life"
  description="A real-time Raven Call triggered a rapid response that helped rescue an injured biker within minutes — a true display of heroism."
  type="trending"
  viewsFromCoastLink="85.3K"
  videoId="kcJST_ubuVU"
/>

<InsightCard
  title="Power of the Raven Call"
  description="Watch how one distress signal mobilized volunteers, alerted nearby hospitals, and ensured emergency care in record time."
  type="informative"
  viewsFromCoastLink="112K"
  videoId="qy0oX5A9WyY"
/>

<InsightCard
  title="Volunteer Spotlight: Raven Heroes"
  description="Meet the top Raven volunteers who made a difference this week. Their swift action and compassion helped save lives."
  type="informative"
  viewsFromCoastLink="97.6K"
  videoId="5cIc_MUwN-c"
/>

      </ScrollView>



          </View>

          
          <View>

          </View>

        </ScrollView>
      </View>
      
    </Layout>
  );
}
