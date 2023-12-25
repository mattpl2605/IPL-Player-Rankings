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
import { Ionicons } from '@expo/vector-icons';

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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <Ionicons name="ios-search" size={20} color="grey" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for players..."
        placeholderTextColor="#ffffff"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch}>
          <Ionicons name="ios-close-circle" size={20} color="grey" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSearchBar()}
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
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
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 25,
    paddingHorizontal: 10,
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#373737',
    borderBottomWidth: 2,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10, // Rounded edges for the header
    marginTop: 5
  },
  headerText: {
    color: '#b47ff1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rank: {
    flex: 1,
    color: '#7CFC00',
    textAlign: 'left',
  },
  playerName: {
    flex: 3,
    color: '#0c6af6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerNameTouchable: {
    flex: 3,
    justifyContent: 'center',
  },
  rating: {
    flex: 1,
    color: '#7CFC00',
    textAlign: 'right',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#373737',
    backgroundColor: '#1e1e1e',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10, // Rounded edges for the header
    marginTop: 10
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    marginTop: 10,
    paddingHorizontal: 10,

  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default BatterRankingsScreen;
