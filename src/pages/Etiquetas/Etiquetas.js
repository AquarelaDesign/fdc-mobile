import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  colors, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'

const querystring = require('querystring')
const { width, height } = Dimensions.get('window')

export default function Etiquetas({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [placa, setPlaca] = useState('')
  const [email, setEmail] = useState('')
  const [etq, setEtq] = useState([])
  
  useEffect(() => {
    setIsLoading(true)
    setPlaca(navigation.getParam('placa'))

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
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
      }
    })
  }, [email, placa])
  
  const FlatList_header_etq = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { color: '#ff0', paddingLeft: 10, width: '100%', textAlign: 'left', }]}>Etiquetas</Text> 
      </View>
    )
    return Sticky_header_View
  }

  const pressLista = (item) => {
    navigation.navigate('Infoetq',{ dados: item })
  }
  
  const getRandom = () => {
    const min = 1
    const max = 100
    const rand = min + Math.random() * (max - min)
    return rand.toString()
  }
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 40,}]}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        {
          etq === undefined ? 
          <Text style={styles.msgText}>
            Nenhuma etiqueta encontrada para esta placa, 
            entre em contato com a sua oficina e solicite o 
            cadastro da Etiqueta no Ficha do Carro.
          </Text>
          :
          <FlatList 
            style={styles.list}
            data={etq}
            keyExtractor={etq => etq.idgpas + etq.descri + getRandom()}

            renderItem={({ item, index }) => (
              <TouchableHighlight
                onPress={() => pressLista(item)}>
                <View style={{ backgroundColor: colors[index % colors.length], }}>
                  <View style={styles.listItem}>
                    <Text style={[styles.listText, { paddingLeft: 10, width: '100%', width: '100%', textAlign: 'left', }]}>{item.descri}</Text> 
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
        }
      </LinearGradient>
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
    flexGrow: 0,
    marginBottom: 90,
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
    color: '#4169E1',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: "center",
  },

  msgText: {
    fontSize: 13,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: "center",
    textAlign: 'center', 
    marginTop: height - (height / 2) - 40, 
    paddingRight: 10,
    width: width - 20, 
  },

})
