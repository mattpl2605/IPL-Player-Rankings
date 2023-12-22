// In HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const HomeScreen = ({ navigation }) => {
  const [season, setSeason] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: '2023', value: '2023'},
    // Add other IPL seasons here
  ]);

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

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers content vertically in the container
    alignItems: 'center', // Centers content horizontally in the container
    padding: 20,
    backgroundColor: '#fff', // Assuming you want a white background
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center', // Ensure text is centered if it wraps to a new line
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  // ... other styles
});


export default HomeScreen;
