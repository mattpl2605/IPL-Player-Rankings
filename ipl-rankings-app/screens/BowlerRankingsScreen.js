import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const BatterRankingsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-bowler-ratings')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Rank</Text>
      <Text style={styles.headerText}>Player</Text>
      <Text style={styles.headerText}>Rating</Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.column}>{index + 1}</Text>
      <Text style={styles.column}>{item['BowlerName']}</Text>
      <Text style={styles.column}>{item['Bowler Rating'].toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  column: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
});

export default BatterRankingsScreen;
