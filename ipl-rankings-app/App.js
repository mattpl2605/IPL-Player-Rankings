import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
  const [season, setSeason] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: '2023', value: '2023'},
    // Add other IPL seasons here
    // {label: 'Year', value: 'Year'}
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
          <Button title="Batter Rankings" onPress={() => {/* Implement action */}} />
          <Button title="Bowler Rankings" onPress={() => {/* Implement action */}} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});
