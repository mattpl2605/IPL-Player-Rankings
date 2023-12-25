import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [season, setSeason] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: '2023', value: '2023' },
    // Add other IPL seasons here
  ]);

  useFocusEffect(
    useCallback(() => {
      setSeason(null);
      setOpen(false);
      return () => {};
    }, [])
  );

  const customLabelStyle = { color: 'white' }; // Style for selected item
  const customPlaceholderStyle = { color: 'white' }; // Style for placeholder text

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select an IPL Season</Text>
      </View>
      <View style={styles.content}>
        <DropDownPicker
          open={open}
          value={season}
          items={items}
          setOpen={setOpen}
          setValue={setSeason}
          setItems={setItems}
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdown}
          labelStyle={customLabelStyle} // Set the label text color to white for the selected item
          placeholderStyle={customPlaceholderStyle} // Set the placeholder text color to white
        />
        {season && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BatterRankings')}
            >
              <Text style={styles.buttonText}>Batter Rankings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BowlerRankings')}
            >
              <Text style={styles.buttonText}>Bowler Rankings</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  titleContainer: {
    height: Dimensions.get('window').height / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7CFC00',
    textAlign: 'center',
  },
  content: {
    width: '90%', // You can adjust this width as needed
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    backgroundColor: 'transparent', // Assuming the dropdown is transparent
    borderColor: '#00FFFF', // Cyan-like border color, adjust as needed
    borderWidth: 1,
    borderRadius: 10, // Adjust radius to match the image
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1F1F1F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#b47ff1',
    fontSize: 16,
  },
});

export default HomeScreen;
