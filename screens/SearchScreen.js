import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row } from "react-native-easy-grid";
import allData from '../assets/data/allData'

//function to show the search result
function SearchResult(props) {
  return (
    <TouchableOpacity style={styles.touchable}
      onPress={() => {
        props.onPress(props.symbol);
      }}>
      <Text style={styles.symboltext}>{props.symbol}</Text>
      <Text style={styles.companytext}>{props.name}</Text>
    </TouchableOpacity>
  )

}

//function to filter the data by name and symbol
function SearchData(searchtext, data) {
  const filterItems = (arr, query) => {
    return arr.filter(e => (e.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) || (e.symbol.toLowerCase().indexOf(query.toLowerCase()) !== -1))
  }
  return (filterItems(data, searchtext))
}


export default function SearchScreen({ navigation }) {
  const { watchList, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [searchtext, setSearchText] = useState('')
  const [searchdata, setSearchData] = useState([])

  //fetch all symbols and save in state
  useEffect(() => {
    try {
      setState(allData)
    }
    catch{
      alert('error in retrieving the data');
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/*search bar*/}
        <Text style={styles.title}>Type a company name or stock symbol:</Text>
        <Row>
          <Col size={1} style={styles.iconcontainer} ><Ionicons name="md-search" size={scaleSize(21)} color="white" /></Col>
          <Col size={8}><TextInput
            style={styles.textinput}
            underlineColorAndroid='transparent'
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={(x) => {
              setSearchText(x);
              //calling the function to search result and set to a state
              setSearchData(SearchData(x, state))
            }} />
          </Col>
        </Row>

        {/* Returning all search result in scroll view*/}
        <ScrollView style={styles.scrollview}>
          {searchtext != '' && searchdata.map((x) =>
            <SearchResult symbol={x.symbol} name={x.name} key={x.symbol}
              onPress={(symbol) => {
                if (!(watchList.some((x) => x == symbol))) {
                  addToWatchlist(symbol)
                }
                navigation.navigate('Stocks');
              }} />)}
        </ScrollView>
      </View >
    </TouchableWithoutFeedback >
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: scaleSize(12)
  },
  title: {
    color: "#ffff",
    fontSize: scaleSize(10),
    textAlign: 'center',
    paddingBottom: scaleSize(5),
  },
  textinput: {
    backgroundColor: "#1e1e1e",
    height: scaleSize(40),
    color: 'white',
    borderWidth: scaleSize(0)
  },
  iconcontainer: {
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(40),
  },
  touchable: {
    paddingBottom: scaleSize(10),
    paddingTop: scaleSize(10),
    paddingLeft: scaleSize(8),
    borderBottomColor: '#666666',
    borderBottomWidth: 0.3,
  },
  symboltext: {
    fontSize: scaleSize(15),
    color: '#ffff'
  },
  companytext: {
    fontSize: scaleSize(10),
    color: '#ffff'
  },
  scrollview: {
    marginTop: scaleSize(50)
  }
});