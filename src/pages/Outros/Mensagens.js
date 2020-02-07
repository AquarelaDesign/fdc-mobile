import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Icon } from 'native-base'
import Lottie from 'lottie-react-native'

import { SearchBar } from 'react-native-elements'

import GlobalStyles, { _url, searchStyle } from '../../GlobalStyles'
import Api from '../../services/oapi'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

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

const Mensagens = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [oficina, setOficina] = useState({})
  const [email, setEmail] = useState('')
  const [mens, setMens] = useState([])
  const [mensFilter, setMensFilter] = useState([])
  const [filtrar, setFiltrar] = useState('')

  const debounceQuery = useDebounce(filtrar, 300)

  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
        async function buscaMsgs() {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcmsg',
              pmetodo: 'buscapush',
              pcodprg: '',
              pemail: email,
              ptipmsg: 'A',
            })).then(response => {
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttpush } = response.data.ProDataSet

                  const pushOrd = Object.values(ttpush)
                    .map((ttpush) => ({
                      ...ttpush,
                      upperCasePlaca: ttpush.placa.toUpperCase(),
                    }))
                    .sort((a, b) => a.placa > b.placa)

                  setMens(pushOrd)
                  setMensFilter(pushOrd)
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
        buscaMsgs()
      }
    })
  }, [email, oficina])

  useEffect(() => {
    const lowerCaseQuery = debounceQuery.toLowerCase()
    
    if (mens !== undefined) {
      const newPushs = mens
        .map((ttpush) => ({
          ...ttpush,
          order: ttpush.placa !== undefined ? ttpush.placa.indexOf(lowerCaseQuery) : '',
        }))
        .sort((a, b) => a.placa > b.placa)

        setMens(newPushs)
      }
  }, [debounceQuery])

  clear = () => {
    setFiltrar('')
  }

  function SearchFilterFunction(text) {
    // passando o texto inserido em textinput
    const newData = mens.filter(function(item) {
      // aplicar filtro ao texto inserido na barra de pesquisa
      const itemData = item.placa ? item.placa.toUpperCase() : ''.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    
    setFiltrar(text)
    setMensFilter(newData)
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
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 35,}]}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      >
        {
          mens === undefined ? 
          <View style={{marginTop: 100}}>
            <Text style={[styles.row, styles.msgText]}>
              Você ainda não recebeu mensagens push.
            </Text>
          </View>
          :
          <View>
            {!isLoading ? (
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
            ) : null}
            <FlatList
              style={styles.list}
              data={mensFilter}
              keyExtractor={item => item.datenv + item.horenv + getRandom()}

              renderItem={({ item }) => 
              (
                <View style={styles.listItem}>
                  <Icon name='md-chatbubbles' style={styles.icone} />
                  <View style={styles.container_text}>
                    <Text style={styles.title}>
                      {`${item.datenv} - ${item.horenv} - ${item.placa}`}
                    </Text>
                    <Text style={styles.description}>
                      {item.txtmsg}
                    </Text>
                  </View>
                </View>
              )}
              
            />
          </View>
        }
      </ImageBackground>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
} 

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  list: {
    paddingHorizontal: 5,
    flexGrow: 0,
    marginBottom: 90,
  },

  listItem: {
    display: 'flex',
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    height: 100,
    backgroundColor: 'rgba(224,255,255,0.5)',
    elevation: 2,
    marginRight: 16,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 5,
  },

  title: {
    fontSize: 14,
    color: '#000',
    color: '#4169E1'
  },

  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },

  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },

  icone: {
    height: 30,
    width: 30,
    color: '#4169E1'
  },

})

export default Mensagens
