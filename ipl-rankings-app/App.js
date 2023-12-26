import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from './screens/HomeScreen';
import BatterRankingsScreen from './screens/BatterRankingsScreen';
import BowlerRankingsScreen from './screens/BowlerRankingsScreen';
import BatterProfileScreen from './screens/BatterProfileScreen';
import BowlerProfileScreen from './screens/BowlerProfileScreen';
import AboutScreen from './screens/AboutScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BatterRankings" component={BatterRankingsScreen} />
      <Stack.Screen name="BowlerRankings" component={BowlerRankingsScreen} />
      <Stack.Screen name="BatterProfileScreen" component={BatterProfileScreen} />
      <Stack.Screen name="BowlerProfileScreen" component={BowlerProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
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
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0cc4eb', 
          tabBarInactiveTintColor: '#0cc4eb', 
          tabBarStyle: {
            backgroundColor: '#1e1e1e', 
          },
          tabBarLabelStyle: {
            color: '#0cc4eb', 
          },
        })}
      >
        <Tab.Screen 
          name="HomeStack" 
          component={HomeStack} 
          options={{
            headerShown: false, 
            title: 'Home',
            listeners: ({ navigation, route }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Home');
              },
            }),
          }} 
        />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

