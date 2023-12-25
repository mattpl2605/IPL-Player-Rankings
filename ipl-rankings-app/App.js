import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Import the refactored HomeScreen
import BatterRankingsScreen from './screens/BatterRankingsScreen'; // Import BatterRankingsScreen
import BowlerRankingsScreen from './screens/BowlerRankingsScreen'; // Import BowlerRankingsScreen
import BatterProfileScreen from './screens/BatterProfileScreen'; // Import BatterProfileScreen
import BowlerProfileScreen from './screens/BowlerProfileScreen'; // Import BowlerProfileScreen

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BatterRankings" component={BatterRankingsScreen} />
        <Stack.Screen name="BowlerRankings" component={BowlerRankingsScreen} />
        <Stack.Screen name="BatterProfileScreen" component={BatterProfileScreen} />
        <Stack.Screen name="BowlerProfileScreen" component={BowlerProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;