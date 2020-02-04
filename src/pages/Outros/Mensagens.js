import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Lottie from 'lottie-react-native'

import { SearchBar } from 'react-native-elements'

import GlobalStyles, { _url, searchStyle } from '../../GlobalStyles'
import Api from '../../services/oapi'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'
import CustomListview from '../../components/CustomListview'

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

const Mensagens = ({ navigation }) => {
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
      async function buscaMsgs() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcmsg',
            pmetodo: 'buscapush',
            pcodprg: '',
            pemail: email,
            ptipmsg: 'A',
          })).then(response => {
            // console.log('response =>', response.status, response)
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttpush } = response.data.ProDataSet

                const pushOrd = Object.values(ttpush)
                  .map((ttpush) => ({
                    ...ttpush,
                    upperCasePlaca: ttpush.placa.toUpperCase(),
                  }))
                  .sort((a, b) => a.placa > b.placa)
                
                // console.log('ttpush =>', ttpush)
                setMens(pushOrd)
                setMensFilter(pushOrd)
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
      buscaMsgs()
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
        <Image style={styles.logo} source={logo} />

        <View style={GlobalStyles.boxContainer}>
          {
            mens === undefined ? 
            <View>
              <Text style={styles.msgText}>
                Você ainda não recebeu mensagens push.
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
              <CustomListview itemList={mensFilter} />
            </View>
          }
        </View>
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

  msgText: {
    fontSize: 22,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 200, 
    paddingRight: 10,
    width: width - 20, 
  },
  
})

export default Mensagens
