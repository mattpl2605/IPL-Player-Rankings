import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components
import HomeScreen from './screens/HomeScreen';
import BatterRankingsScreen from './screens/BatterRankingsScreen';
import BowlerRankingsScreen from './screens/BowlerRankingsScreen';
import BatterProfileScreen from './screens/BatterProfileScreen';
import BowlerProfileScreen from './screens/BowlerProfileScreen';
import AboutScreen from './screens/AboutScreen'; // Ensure this component is created

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create a HomeStack that includes HomeScreen and other screens you might want to include
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BatterRankings" component={BatterRankingsScreen} />
      <Stack.Screen name="BowlerRankings" component={BowlerRankingsScreen} />
      <Stack.Screen name="BatterProfileScreen" component={BatterProfileScreen} />
      <Stack.Screen name="BowlerProfileScreen" component={BowlerProfileScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'About') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }
            // The `color` variable is applied here to set the icon color
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0cc4eb', // Active icon and text color
          tabBarInactiveTintColor: '#0cc4eb', // Inactive icon and text color
          tabBarStyle: {
            backgroundColor: '#1e1e1e', // Tab bar background color
          },
          tabBarLabelStyle: {
            color: '#0cc4eb', // This ensures the text color is consistent with the icon color
          },
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false, title: 'Home' }} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
