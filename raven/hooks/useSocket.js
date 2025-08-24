import { useEffect } from 'react';
import io from 'socket.io-client';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAlert } from '../Context/AlertContext';

const backendUrl = Constants.expoConfig.extra.backendUrl;

let socket;

export const useSocket = (userId) => {
  const { receiveAlertToken } = useAlert();

  useEffect(() => {
    if (!userId) return;

    socket = io(backendUrl, {
      transports: ['websocket'],
      jsonp: false,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('userOnline', userId); 
    });

  
    socket.on('notification', (notification) => {
      Toast.show({
        type: 'info',
        text1: 'Hello Raven!',
        text2: notification.message,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    });


    socket.on('ravenCall', async (alertDetails) => {
      console.log('Received Raven Call:');
      if (alertDetails.alertToken) {
       await receiveAlertToken(alertDetails.alertToken);
      }
    });

    return () => {
      if (socket) {
        console.log('Disconnecting socket:', socket.id);
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [userId]);
};
