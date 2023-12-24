import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BatterRankingsScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-batter-ratings')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setFilteredData(json);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item['StrikerName'].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchBatterProfile = name => {
    fetch(`http://127.0.0.1:5000/get-batter-profile?name=${encodeURIComponent(name)}`)
      .then(response => response.json())
      .then(json => {
        navigation.navigate('BatterProfileScreen', { batterProfile: json });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.rank, styles.headerText]}>Rank</Text>
      <Text style={[styles.playerName, styles.headerText]}>Player</Text>
      <Text style={[styles.rating, styles.headerText]}>Rating</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{item['Rank']}</Text>
      <TouchableOpacity onPress={() => fetchBatterProfile(item['StrikerName'])} style={styles.playerNameTouchable}>
        <Text style={styles.playerName}>{item['StrikerName']}</Text>
      </TouchableOpacity>
      <Text style={styles.rating}>{item['Batter Rating'].toFixed(2)}</Text>
    </View>
  );

  const renderSearchBar = () => (
    <TextInput
      style={styles.searchBar}
      placeholder="Search for players..."
      value={searchQuery}
      onChangeText={text => setSearchQuery(text)}
    />
  );

  return (
    <View style={styles.container}>
      {renderSearchBar()}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredData}
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  headerText: {
    fontWeight: 'bold',
  },
  rank: {
    flex: 1,
    textAlign: 'left',
  },
  playerName: {
    flex: 3,
    textAlign: 'center',
  },
  playerNameTouchable: {
    flex: 3,
    justifyContent: 'center',
  },
  rating: {
    flex: 1,
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    padding: 10,
    margin: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default BatterRankingsScreen;
