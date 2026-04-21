import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import * as SplashScreen from 'expo-splash-screen';
import TrackPlayer from 'react-native-track-player';

import HomeScreen from './src/screens/HomeScreen';
import PrayScreen from './src/screens/PrayScreen';
import CompletedScreen from './src/screens/CompletedScreen';
import type { MysterySetId } from './src/constants/rosary';

SplashScreen.preventAutoHideAsync();

// Registrar el servicio de audio en segundo plano (requerido por react-native-track-player)
TrackPlayer.registerPlaybackService(
  () => require('./src/services/playbackService'),
);

export type RootStackParamList = {
  Home: undefined;
  Pray: { mysterySetId?: MysterySetId };
  Completed: { mysterySetName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false, animation: 'fade' }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Pray"
              component={PrayScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="Completed"
              component={CompletedScreen}
              options={{ animation: 'fade', gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
