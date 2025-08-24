import 'dotenv/config';


export default () => ({
  expo: {
    name: "Raven",
    slug: "Raven",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon2.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icon2.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.techvolsung.Raven234",
      infoPlist:{
        UIBackgroundModes: ["location"],
    NSLocationAlwaysUsageDescription: "We use your location to help connect you with nearby users.",
    NSLocationWhenInUseUsageDescription: "We use your location to help connect you with nearby users."
  

      }
      
      

    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon2.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.techvolsung.Raven234"
    },
    web: {
      favicon: "./assets/icon2.png",
      bundler: "metro"
    },
    extra: {
      eas: {
        projectId: "5393c439-f626-4595-b6d4-57d9e87f583a"
      },
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
      iosClientId:process.env.IOS_CLIENT_ID,
      backendUrl:'http://192.168.1.34:3000'
    },
    owner: "rheoanubhav",
    plugins: ["expo-web-browser"]
  }
});
