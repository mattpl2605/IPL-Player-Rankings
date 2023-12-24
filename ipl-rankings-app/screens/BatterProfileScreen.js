// BatterProfileScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const BatterProfileScreen = ({ route }) => {
  const { batterProfile } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{batterProfile.batter_name}</Text>
      <Text style={styles.gridContainer}>{batterProfile.grid_container}</Text>
      <Text style={styles.description}>{batterProfile.player_description}</Text>
      {batterProfile.player_statistics.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <Text>{stat['Career Stats'] ? `Career Stats: ${stat['Career Stats']}` : `Year: ${stat.Year}`}</Text>
          <Text>Matches: {stat.Mat}</Text>
          <Text>Runs: {stat.Runs}</Text>
          <Text>Avg: {stat.Avg}</Text>
          <Text>SR: {stat.SR}</Text>
          <Text>50s: {stat['50']}</Text>
          <Text>100s: {stat['100']}</Text>
          <Text>HS: {stat['HS']}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    gridContainer: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },
    statContainer: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
    },
  });
  

export default BatterProfileScreen;
