import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell, PlusSquare } from 'lucide-react-native'; 
import { Button } from 'react-native-web';
import CreatePostCard from './createPostCard';
import React, { useState } from 'react';


export default function Layout({ children, title = "Your App", onNotifyPress }) {
   const [isCreateVisible, setCreateVisible] = useState(false);
  return (
    <View className="flex-1 bg-zinc-950 pt-12">
      {/* Navbar */}
      <View className="h-16 px-4 flex-row items-center justify-between bg-zinc-950 border-b border-zinc-900">
        
  
        <Image
          source={require('../assets/logo.png')} 
          style={{ width: 120, height: 28, resizeMode: 'contain' }}
        />


        <View className = 'flex-row  gap-6'>
          <TouchableOpacity onPress={() => setCreateVisible(true)} className="flex-row items-center gap-2">
            <PlusSquare color="white" size={22} strokeWidth={2} />
            </TouchableOpacity>

          <TouchableOpacity onPress={onNotifyPress}>
          <Bell color="white" size={22} strokeWidth={2} />
        </TouchableOpacity>
        </View>
        
      </View>

   
      <View className="flex-1">
        <CreatePostCard
        isVisible={isCreateVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={(data) => {
          console.log("New Post Submitted:", data);
          
        }}
      />
        {children}
      </View>
    </View>
  );
}
