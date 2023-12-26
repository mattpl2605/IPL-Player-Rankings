import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Batter Rating Formula Methodology</Text>
      
      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Weighting Factors</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          We assigned weights to three key batting statistics - runs scored, strike rate, and batting average. These weights were determined based on their relative importance in evaluating a batter's performance: 43% for runs, 34% for strike rate, and 23% for batting average.
        </Text>
      </View>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Normalization</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          We normalized each of these statistics to a common scale to ensure fair comparison across different players. This involved transforming the values into a range of 0 to 1, where higher values indicate better performance.
        </Text>
      </View>

      {/* Threshold and Reduced Weight Factor */}
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Threshold and Reduced Weight Factor</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          To account for cases where a player had limited opportunities to bat, we introduced a threshold. If a player's runs scored were below this threshold, we applied a reduced weight factor to their ratings, acknowledging their limited contributions.
        </Text>
      </View>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Batter Rating Calculation</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          The final batter rating was calculated by combining the normalized values of runs, strike rate, and batting average, with their respective weights. If the player's runs were below the threshold, the reduced weight factor was applied.
        </Text>
      </View>

      <Text style={styles.title}>Bowler Rating Formula Methodology</Text>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Weighting Factors</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          We assigned weights to four key bowling statistics - wickets taken, economy rate, bowling average, and bowling strike rate. These weights were determined based on their relative importance in evaluating a bowler's performance: 40% for wickets, 30% for economy rate, 20% for bowling strike rate, and 10% for bowling average.
        </Text>
      </View>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Normalization</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          We normalized each of these statistics to a common scale to ensure fair comparison across different players. This involved transforming the values into a range of 0 to 1, where higher values indicate better performance.
        </Text>
      </View>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Threshold for Low Wickets</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          To account for cases where a bowler had taken very few wickets, we applied a reduced weight factor to their ratings if they had taken less than 5 wickets.
        </Text>
      </View>

      
      <Text style={[styles.subtitle, styles.subtitleMargin]}>Bowler Rating Calculation</Text>
      <View style={styles.gridInfoContainer}>
        <Text style={styles.contentText}>
          The final bowler rating was calculated by combining the normalized values of wickets, economy rate, bowling average, and bowling strike rate, with their respective weights. If the bowler had taken fewer than 5 wickets, the reduced weight factor was applied.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#b47ff1',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c6af6',
    marginLeft: 20,
  },
  subtitleMargin: {
    marginTop: 20,
    marginBottom: 5,
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
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#0cc4eb',
    textAlign: 'justify',
  },
});

export default AboutScreen;
