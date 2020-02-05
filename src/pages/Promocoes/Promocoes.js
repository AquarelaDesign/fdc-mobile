import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import Lottie from 'lottie-react-native'

import { SearchBar } from 'react-native-elements'

import GlobalStyles, { colors, _url, searchStyle } from '../../GlobalStyles'
import Api from '../../services/oapi'

import sad from '../../assets/sad.png'
import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const { width } = Dimensions.get('window')
const querystring = require('querystring')

const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounceValue
}

const Promocoes = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [promo, setPromo] = useState(undefined)
  const [promoFilter, setPromoFilter] = useState([])
  const [filtrar, setFiltrar] = useState('')
  
  const debounceQuery = useDebounce(filtrar, 300)

  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      async function buscaPro() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'buscapromocoesApp',
            pcodprg: '',
            pemail: email,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttpromo } = response.data.ProDataSet
                
                const promOrd = Object.values(ttpromo)
                  .map((ttpromo) => ({
                    ...ttpromo,
                    upperCasePlaca: ttpromo.placa.toUpperCase(),
                  }))
                  .sort((a, b) => a.placa > b.placa)
                
                setPromo(promOrd)
                setPromoFilter(promOrd)
              }
            }
            setIsLoading(false)
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            setIsLoading(false)
          } else {
            setIsLoading(false)
          }
        }
      }
      buscaPro()
    })
  }, [email, oficina])

  useEffect(() => {
    const lowerCaseQuery = debounceQuery.toLowerCase()
    
    if (promo !== undefined) {
      const newPromos = promo
        .map((ttpromo) => ({
          ...ttpromo,
          order: ttpromo.placa !== undefined ? ttpromo.placa.indexOf(lowerCaseQuery) : '',
        }))
        .sort((a, b) => a.order - b.order)

        setPromo(newPromos)
      }
  }, [debounceQuery])

  const pressPro = (item) => {
    navigation.navigate('InfoPromo', {
      dados: item,
    })
  }

  const FlatList_header_pro = () => {
    var Sticky_header_View = (
      <View style={[styles.listItem, styles.header_style]}>
        <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>Placa</Text>
        <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>Descrição</Text>
      </View>
    )
    return Sticky_header_View
  }

  clear = () => {
    setFiltrar('')
  }
 
  function SearchFilterFunction(text) {
    // passando o texto inserido em textinput
    const newData = promo.filter(function(item) {
      // aplicar filtro ao texto inserido na barra de pesquisa
      const itemData = item.placa ? item.placa.toUpperCase() : ''.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    
    setFiltrar(text)
    setPromoFilter(newData)
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 25,}]}>
      <View style={styles.scene}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          {
            promo === undefined ?
            <View style={{marginTop: 100}}>
              <Image style={styles.boxIcone} source={sad} />
              <Text style={[styles.row, styles.msgText]}>
                Não foram encontradas promoções vigentes até o momento.
              </Text>
              <Text style={[styles.row, styles.msgText]}>
                Mas fique alerta e continue atualizando as informações de quilometragem para em breve receber promoções exclusivas!
              </Text>
            </View>
            :
            <View>
              <SearchBar
                round
                searchIcon={{ size: 24 }}
                
                containerStyle={searchStyle.containerStyle}
                inputStyle={searchStyle.inputStyle}
                leftIconContainerStyle={searchStyle.leftIconContainerStyle}
                rightIconContainerStyle={searchStyle.rightIconContainerStyle}
                inputContainerStyle={searchStyle.inputContainerStyle}

                placeholder="Filtrar Placas..."
                onChangeText={text => SearchFilterFunction(text)}
                onClear={text => SearchFilterFunction('')}
                value={filtrar}
              />
              <FlatList
                style={styles.list}
                data={promoFilter}
                keyExtractor={prom => `${prom.idprom}${prom.descri}`}

                renderItem={({ item, index }) => (
                  <TouchableHighlight
                    onPress={() => pressPro(item)}>
                    <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                      <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.placa.toUpperCase()}</Text>
                      <Text style={[styles.listText, { width: '65%', textAlign: 'left', }]}>{item.descricao}</Text>
                    </View>
                  </TouchableHighlight>
                )}

                ListHeaderComponent={FlatList_header_pro}
                stickyHeaderIndices={[0]}
              />
            </View>
          }
        </ImageBackground>
      </View>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 50,
  },

  scene: {
    flex: 1,
    marginTop: 10,
  },

  tabContainer: {
    flex: 1,
    marginTop: 38,
  },

  header_style: {
    fontWeight: 'bold',
    backgroundColor: '#4169E1',
  },

  list: {
    paddingHorizontal: 5,
    flexGrow: 0,
    marginBottom: 90,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  listItem: {
    display: 'flex',
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: 10,
    height: 50,
  },

  listText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  msgText: {
    fontSize: 18,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'justify',
    paddingRight: 10,
    width: width - 20,
  },

  boxIcone: {
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
})

export default Promocoes
