import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import Lottie from 'lottie-react-native'

import GlobalStyles from '../../GlobalStyles'
import Api from '../../services/oapi'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')
const { width, height } = Dimensions.get('window')

const colors = ['#00BFFF', '#1E90FF'];

export default function Etiquetas({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [placa, setPlaca] = useState('')
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [etq, setEtq] = useState([])
  
  useEffect(() => {
    setIsLoading(true)
    setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaEtq() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'BuscaEtiquetas',
            pcodprg: '',
            pemail: email,
            pplaca: placa,
            pqtdias: 0,
            pkm: 0,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfcetq } = response.data.ProDataSet
                setEtq(ttfcetq)
              }
            } 
            setIsLoading(false)
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log('1=>', response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log('2=>', error)
            setIsLoading(false)
          }
        }
      }
      buscaEtq()
    })
  }, [email, oficina, placa])
  
  // console.log(etq', placa, etq)

  const FlatList_header_etq = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '100%', textAlign: 'left', }]}>Etiquetas</Text> 
      </View>
    )
    return Sticky_header_View
  }

  const pressLista = (item) => {
    console.log('Infoetq-item', item)
    navigation.navigate('Infoetq',{ dados: item })
  }
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <FlatList 
          style={styles.list}
          data={etq}
          keyExtractor={etq => `${etq.idgpas}${etq.descri}`}

          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => pressLista(item)}>
              <View style={{ backgroundColor: colors[index % colors.length], }}>
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { paddingLeft: 10, width: '100%', textAlign: 'left', }]}>{item.descri}</Text> 
                </View>
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { paddingLeft: 10, width: '40%', textAlign: 'left', }]}>{item.dtproxfor}</Text> 
                  <Text style={[styles.listText, { paddingLeft: 10, width: '30%', }]}>{ `${item.kmprox} KM` }</Text> 
                  <Text style={[styles.listText, { paddingLeft: 10, width: '30%', }]}></Text> 
                </View>
              </View>
            </TouchableHighlight>
          )}

          ListHeaderComponent={FlatList_header_etq}
          stickyHeaderIndices={[0]}
        />
      </ImageBackground>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header_style: {
    fontWeight: 'bold',
    backgroundColor: '#4169E1', 
  },

  list: {
    paddingHorizontal: 5,
    flex: 1,
    marginTop: 38,
  },
  
  listItem: {
    display: "flex",
    width: width - 10,
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingRight: 10,
    height: 40,
  },
  
  listText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: "center",
  },

})
