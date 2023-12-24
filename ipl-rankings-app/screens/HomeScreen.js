import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [season, setSeason] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '2023', value: '2023' },
    // Add other IPL seasons here
  ]);

  // Reset the state when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setSeason(null);
      setOpen(false);
      // Optionally, if you have other state variables to reset, do it here.

      return () => {
        // Optional cleanup actions on blur
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an IPL Season</Text>
      <DropDownPicker
        open={open}
        value={season}
        items={items}
        setOpen={setOpen}
        setValue={setSeason}
        setItems={setItems}
        zIndex={3000}
        zIndexInverse={1000}
      />
      {season && (
        <View style={styles.buttonContainer}>
          <Button
            title="Batter Rankings"
            onPress={() => navigation.navigate('BatterRankings')}
          />
          <Button
            title="Bowler Rankings"
            onPress={() => navigation.navigate('BowlerRankings')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  // ... possibly other styles you may have ...
});

export default HomeScreen;
