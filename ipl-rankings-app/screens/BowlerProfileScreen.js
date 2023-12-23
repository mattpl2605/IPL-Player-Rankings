import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const BowlerProfileScreen = ({ route }) => {
  const { bowlerProfile } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{bowlerProfile.bowler_name}</Text>
      <Text style={styles.gridContainer}>{bowlerProfile.grid_container}</Text>
      <Text style={styles.description}>{bowlerProfile.player_description}</Text>
      {bowlerProfile.player_statistics.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <Text>Year: {stat.Year}</Text>
          <Text>Matches: {stat.Mat}</Text>
          <Text>Wickets: {stat.WKTS}</Text>
          <Text>Average: {stat.Ave}</Text>
          <Text>Economy: {stat.Econ}</Text>
          <Text>Best Bowling in Match: {stat.BBM}</Text>
          <Text>4 Wickets in Innings: {stat["4W"]}</Text>
          <Text>5 Wickets in Innings: {stat["5W"]}</Text>
          <Text>Strike Rate: {stat.SR}</Text>
          <Text>Runs Conceded: {stat.Runs}</Text>
          <Text>Balls Bowled: {stat.Balls}</Text>
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
  
export default BowlerProfileScreen;