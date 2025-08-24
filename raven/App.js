// App.js
import 'react-native-gesture-handler';
import './global.css';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './components/AuthContext';
import { LocationProvider } from './Context/LocationContext';
import { AlertProvider } from './Context/AlertContext';
import RavenCallHandler from './handlers/RavenCallHandler';

export default function App() {
  return (
          <AlertProvider>
    <AuthProvider>
      <LocationProvider>
  
    <View className = 'flex-1  '>

  <StatusBar style='light'/>

  
  <AppNavigator />
<Toast/>
<RavenCallHandler/>
  </View>

  </LocationProvider>
  </AuthProvider>
    </AlertProvider>

    );
}
