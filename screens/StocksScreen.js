import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import resultData from '../assets/data/resultData'


//function to return touchable opacity for each watchlist detail
function StockButton(props) {
  const rate = ((props.close - props.open) / props.open) * 100;
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.symbol)
      }}
      style={props.style}>
      < Text style={styles.buttontext}>
        {props.symbol}
      </Text >
      <Text style={styles.buttonprice}>
        {props.close}
      </Text>
      <Text style={rate < 0 ? styles.buttonratenegative : styles.buttonrate}>
        {rate.toFixed(2)}%
        </Text>
    </TouchableOpacity >
  )
}

//function to return the stock details when user click on the touchable
function StockDetail({ selection }) {
  return (
    <Grid>
      <Text style={styles.bottomTextTitle}>{selection.name}</Text>
      <Row style={styles.bottomTextRow}>
        <Col size={3}><Text style={styles.bottomTextField}>OPEN</Text></Col>
        <Col size={1}><Text style={styles.bottomText}>{selection.open && parseFloat(selection.open).toFixed(2)}</Text></Col>
        <Col size={3}><Text style={styles.bottomTextField}>LOW</Text></Col>
        <Col size={1}><Text style={styles.bottomText}>{selection.low && parseFloat(selection.low).toFixed(2)}</Text></Col>
      </Row>
      <Row style={styles.bottomTextRow}>
        <Col size={3}><Text style={styles.bottomTextField}>CLOSE</Text></Col>
        <Col size={1}><Text style={styles.bottomText}>{selection.close && parseFloat(selection.close).toFixed(2)}</Text></Col>
        <Col size={3}><Text style={styles.bottomTextField}>HIGH</Text></Col>
        <Col size={1}><Text style={styles.bottomText}>{selection.high && parseFloat(selection.high).toFixed(2)}</Text></Col>
      </Row>
      <Row style={styles.bottomTextRow}>
        <Col size={2}><Text style={styles.bottomTextField}>VOLUME</Text></Col>
        <Col size={2}><Text style={styles.bottomText}>{selection.volumes}</Text></Col>
        <Col size={3}><Text></Text></Col>
        <Col size={1}><Text></Text></Col>
      </Row>
    </Grid>
  )
}

export default function StocksScreen({ route }) {
  const { watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [selection, setSelection] = useState({})
  const [active, setActive] = useState('');

  useEffect(() => {
    watchList.forEach(v => {
      if (!state.map(x => x.symbol).includes(v)) {
        try {
          const index = resultData.findIndex(x => x.stocksymbol === v);
          //take the latest data.
          const additional = resultData[index].data[0];
          setState((prev) => {
            if (!(prev.some((x) => x.symbol == additional))) {
              prev = prev.concat(additional)
              return [...prev]
            }
            else {
              return [...prev]
            }
          })
        }
        catch{
          alert('error in retrieving the data.')
        }

        // if (!state.map(x => x.symbol).includes(v)) {
        //   fetch(`${url}${v}`)
        //     .then(res => {
        //       if (res.ok) return res.json(); else throw new Error("Fetch Failed, status: " + res.status)
        //     })
        //     //only take the latest data(latest date)
        //     .then(res => res[0])
        //     .then(res => setState((prev) => {
        //       if (!(prev.some((x) => x.symbol == res.symbol))) {
        //         prev = prev.concat(res)
        //         return [...prev]
        //       }
        //       else {
        //         return [...prev]
        //       }
        //     }))
        //     .catch(e => { console.warn(e); throw e })
      }
    });
  }, [watchList]);

  //setting the stock detail to the first data in state when first load.
  useEffect(() => {
    state.length !== 0 && setSelection(() => state[0]);
    state.length !== 0 && setActive(() => state[0].symbol)
  }, [state.length !== 0])


  return (
    <View style={styles.container}>
      {/* Wrapping all watchlist stock detail in scrollview */}
      <ScrollView style={styles.scrollview}>
        {state
          .sort((a, b) => a.symbol.localeCompare(b.symbol))
          .map((x) =>
            <StockButton
              symbol={x.symbol}
              close={x.close}
              open={x.open}
              key={x.symbol}
              onPress={(symbol) => {
                setSelection(state.find(y => y.symbol === symbol));
                setActive(symbol);
              }}
              //setting the style for an active touchable
              style={active === x.symbol ? styles.buttonpress : styles.button} />)}
      </ScrollView>

      {/*passing the selected data to the detail box*/}
      <View style={styles.bottomView}>
        <StockDetail selection={selection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    flexDirection: "row",
    paddingTop: scaleSize(9),
    paddingBottom: scaleSize(9),
    borderBottomColor: '#666666',
    borderBottomWidth: 0.5,
    backgroundColor: '#000000'
  },
  buttonpress: {
    flexDirection: "row",
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
    borderBottomColor: '#666666',
    borderBottomWidth: 0.5,
    backgroundColor: '#383838'
  },
  scrollview: {
    marginBottom: scaleSize(120)
  },
  buttontext: {
    paddingLeft: scaleSize(10),
    color: "white",
    flex: 4,
    fontSize: scaleSize(17),
    textAlignVertical: "center"
  },
  buttonprice: {
    color: "white",
    flex: 2,
    fontSize: scaleSize(17),
    textAlignVertical: "center"
  },
  buttonrate: {
    flex: 2.5,
    backgroundColor: "#4cd964",
    color: "white",
    borderRadius: scaleSize(10),
    paddingTop: scaleSize(6),
    paddingBottom: scaleSize(6),
    paddingRight: scaleSize(6),
    marginRight: scaleSize(7),
    fontSize: scaleSize(17),
    textAlign: "right",
    textAlignVertical: "center"
  },
  buttonratenegative: {
    flex: 2.5,
    backgroundColor: "#ff3830",
    color: "white",
    borderRadius: scaleSize(10),
    paddingTop: scaleSize(6),
    paddingBottom: scaleSize(6),
    paddingRight: scaleSize(6),
    marginRight: scaleSize(7),
    fontSize: scaleSize(17),
    textAlign: "right",
    textAlignVertical: "center"
  },
  bottomView: {
    width: '100%',
    height: scaleSize(120),
    backgroundColor: '#212121',
    position: 'absolute',
    bottom: 0,
  },
  bottomTextRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#707070'
  },
  bottomTextTitle: {
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingBottom: scaleSize(10),
    paddingTop: scaleSize(10),
    fontSize: scaleSize(17),
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D3D3'
  },
  bottomTextField: {
    color: '#636363',
    fontSize: scaleSize(11),
    textAlignVertical: 'center',
    paddingLeft: 5
  },
  bottomText: {
    color: 'white',
    fontSize: scaleSize(12),
    textAlignVertical: 'center',
    textAlign: 'right'
  },
});
