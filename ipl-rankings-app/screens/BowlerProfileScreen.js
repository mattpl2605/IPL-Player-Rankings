import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const BowlerProfileScreen = ({ route }) => {
  const { bowlerProfile } = route.params;

  // Function to render the gridContainer information
  const renderGridContainer = (data) => {
    return data.split('|').map((item, index) => (
      <Text key={index} style={styles.gridItem}>
        {item.trim()}
      </Text>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{bowlerProfile.bowler_name}</Text>
      
      {/* Render the gridContainer information on separate lines within a styled container */}
      <View style={styles.gridInfoContainer}>
        {renderGridContainer(bowlerProfile.grid_container)}
      </View>

      <Text style={styles.name}>Biography</Text>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{bowlerProfile.player_description}</Text>
      </View>

      <Text style={styles.name}>IPL Bowling Career</Text>

      {bowlerProfile.player_statistics.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <Text style={styles.statText}>{stat['Career Stats'] ? `Career Stats: ${stat['Career Stats']}` : `Year: ${stat.Year}`}</Text>
          <Text style={styles.statText}>Matches: {stat.Mat}</Text>
          <Text style={styles.statText}>Wickets: {stat.WKTS}</Text>
          <Text style={styles.statText}>Average: {stat.Ave}</Text>
          <Text style={styles.statText}>Economy: {stat.Econ}</Text>
          <Text style={styles.statText}>Best Bowling in Match: {stat.BBM}</Text>
          <Text style={styles.statText}>4 Wickets in Innings: {stat["4W"]}</Text>
          <Text style={styles.statText}>5 Wickets in Innings: {stat["5W"]}</Text>
          <Text style={styles.statText}>Strike Rate: {stat.SR}</Text>
          <Text style={styles.statText}>Runs Conceded: {stat.Runs}</Text>
          <Text style={styles.statText}>Balls Bowled: {stat.Balls}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#b47ff1',
  },
  gridInfoContainer: {
    flexDirection: 'column',
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#373737',
    borderBottomWidth: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  gridItem: {
    fontSize: 20,
    color: '#0c6af6', // Updated color
    textAlign: 'center',
    marginBottom: 5,
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#373737',
    borderBottomWidth: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#0cc4eb', // Updated color
    textAlign: 'center',
  },
  statContainer: {
    flexDirection: 'column',
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#373737',
    borderBottomWidth: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  statText: {
    fontSize: 16,
    color: '#7CFC00', // Updated color
    marginBottom: 5,
  },
});

export default BowlerProfileScreen;
