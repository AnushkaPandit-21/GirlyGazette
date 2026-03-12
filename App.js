import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SettingsProvider } from './src/context/SettingsContext';
import COLORS from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </HomeStack.Navigator>
  );
}

function CustomTabButton({ children, onPress, accessibilityState }) {
  const focused = accessibilityState.selected;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={tabStyles.buttonContainer}
    >
      <Animated.View
        style={[
          tabStyles.button,
          focused && tabStyles.buttonFocused,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const tabStyles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonFocused: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
});

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: focused ? 26 : 22 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: focused ? 'Nunito_700Bold' : 'Nunito_400Regular',
          fontSize: 11,
          color: focused ? COLORS.accent : 'rgba(255,255,255,0.7)',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SettingsProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: COLORS.primary,
                borderTopWidth: 0,
                height: 75,
                paddingBottom: 10,
                paddingTop: 8,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                position: 'absolute',
                elevation: 20,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                tabBarButton: (props) => <CustomTabButton {...props} />,
                tabBarIcon: ({ focused }) => (
                  <TabIcon emoji="✨" label="Home" focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Finance"
              component={CategoryScreen}
              initialParams={{ categoryKey: 'finance' }}
              options={{
                tabBarButton: (props) => <CustomTabButton {...props} />,
                tabBarIcon: ({ focused }) => (
                  <TabIcon emoji="💰" label="Money" focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Tech"
              component={CategoryScreen}
              initialParams={{ categoryKey: 'tech' }}
              options={{
                tabBarButton: (props) => <CustomTabButton {...props} />,
                tabBarIcon: ({ focused }) => (
                  <TabIcon emoji="🤖" label="Tech" focused={focused} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarButton: (props) => <CustomTabButton {...props} />,
                tabBarIcon: ({ focused }) => (
                  <TabIcon emoji="💖" label="Vibes" focused={focused} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </SettingsProvider>
  );
}
