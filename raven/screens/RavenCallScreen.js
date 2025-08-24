import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import Layout from "../components/Layout";
import * as Animatable from "react-native-animatable";
import * as Location from "expo-location";
import { AuthContext } from "../components/AuthContext";
import { useContext } from "react";
import Constants from "expo-constants";
import * as Haptics from 'expo-haptics';

const RavenCallScreen = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [intervalId, setIntervalId] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const {user} = useContext(AuthContext);
  // Get user location on mount
useEffect(() => {
  (async () => {

    console.log("Requesting location permission...");
    console.log("Current user:", user);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission not granted");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    console.log("permission granted : " , loc.coords!==null);

    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
  })();
}, []);


const handleHapticFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};


 const backendUrl = Constants.expoConfig.extra.backendUrl;

  

  const handleRavenCall = async()=>{
    try {
      handleHapticFeedback();
      const response = await fetch(`${backendUrl}/ravenCall/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          latitude, 
          longitude,

        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Raven Call", "Nearest Ravens have been alerted.");
      } else {
        Alert.alert("Error", data.error || "Failed to send Raven Call.");
      }
    } catch (error) {
      console.error('Raven Call error:', error);
      Alert.alert("Error", "An error occurred while sending the Raven Call.");
    }
  }

  const startCountdown = () => {
    setIsCalling(true);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(id);
          handleRavenCall();


          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const cancelCall = () => {
    clearInterval(intervalId);
    setCountdown(10);
    setIsCalling(false);
  };

  return (
    <Layout title="Raven Call" onNotifyPress={() => alert("Notifications")}>
      <View className="flex-1 justify-center items-center">
        {isCalling ? (
          <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
            <TouchableOpacity
              className="h-64 w-64 rounded-full overflow-hidden border-4 bg-red-600 border-red-800 justify-center items-center"
              activeOpacity={0.9}
            >
              <Image
                source={require("../assets/RavenCall.png")}
                style={{
                  width: 280,
                  height: 280,
                  resizeMode: "contain",
                  tintColor: "white",
                }}
              />
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <TouchableOpacity
            className="h-64 w-64 rounded-full overflow-hidden border-4 bg-[#feffff] border-zinc-900 justify-center items-center"
            onPress={startCountdown}
            activeOpacity={0.9}
          >
            <Image
              source={require("../assets/RavenCall.png")}
              style={{
                width: 280,
                height: 280,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        )}

        <View className="mt-4 px-4">
          <Text className="text-white text-center font-bold text-3xl">Raven Call</Text>
          {!isCalling && (
            <Text className="text-white text-center text-xs mt-1">
              If you're in distress or need urgent help, press the Raven Call button.{" "}
              This will instantly alert the nearest Raven volunteers and notify local emergency services.
            </Text>
          )}
        </View>

        {isCalling && (
          <View className=" items-center space-y-2">
            {countdown>0 && <Text className="text-red-400 font-semibold text-xl">
              Alerting in {countdown}...
            </Text>}
            <Text className="text-zinc-300 text-xs text-center px-4">
              Raven Call initiated. Nearby Ravens and emergency services will be notified.
            </Text>

            <TouchableOpacity
              onPress={cancelCall}
              className="mt-2 px-4 py-2 bg-zinc-800 rounded-full border border-zinc-600"
            >
              <Text className="text-white font-medium">Cancel Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Layout>
  );
};

export default RavenCallScreen;
