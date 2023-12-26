import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const BatterProfileScreen = ({ route }) => {
  const { batterProfile } = route.params;

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
      <Text style={styles.name}>{batterProfile.batter_name}</Text>
      
      {/* Render the gridContainer information on separate lines within a styled container */}
      <View style={styles.gridInfoContainer}>
        {renderGridContainer(batterProfile.grid_container)}
      </View>

      <Text style={styles.name}>Biography</Text>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{batterProfile.player_description}</Text>
      </View>

      <Text style={styles.name}>IPL Batting Career</Text>

      {batterProfile.player_statistics.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <Text style={styles.statText}>{stat['Career Stats'] ? `Career Stats: ${stat['Career Stats']}` : `Year: ${stat.Year}`}</Text>
          <Text style={styles.statText}>Matches: {stat.Mat}</Text>
          <Text style={styles.statText}>Runs: {stat.Runs}</Text>
          <Text style={styles.statText}>Average: {stat.Avg}</Text>
          <Text style={styles.statText}>Strike Rate: {stat.SR}</Text>
          <Text style={styles.statText}>50s: {stat['50']}</Text>
          <Text style={styles.statText}>100s: {stat['100']}</Text>
          <Text style={styles.statText}>High Score: {stat['HS']}</Text>
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
    color: '#0c6af6',
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
    color: '#0cc4eb',
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
    color: '#7CFC00',
    marginBottom: 5,
  },
});

export default BatterProfileScreen;
