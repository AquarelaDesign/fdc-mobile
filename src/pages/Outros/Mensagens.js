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
  Alert,
} from 'react-native'

import Lottie from 'lottie-react-native'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import Api from '../../services/oapi'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

export default function Mensagens({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [oficina, setOficina] = useState({})
  const [email, setEmail] = useState('')
  const [mens, setMens] = useState([])

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
                console.log('ttpush =>', ttpush)
                setMens(ttpush)
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

  const getRandom = () => {
    const min = 1
    const max = 100
    const rand = min + Math.random() * (max - min)
    return rand.toString()
  }

  const pressMsg = (item) => {
    if (item.abretela !== '') {
      navigation.navigate(item.abretela, {
        placa: item.placa,
      })
    } else {
      Alert.alert(item.txtmsg)
    }
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

        {/* <View style={GlobalStyles.boxSpace}></View> */}

        <View style={GlobalStyles.boxContainer}>
          {
            mens === undefined ? 
              <Text style={styles.msgText}>
                Você ainda não recebeu mensagens push.
              </Text>
            :
            
            <FlatList 
              style={styles.list}
              data={mens}
              keyExtractor={mens => mens.datenv + mens.horenv + getRandom()}
              
              // numColumns={5}
              renderItem={({ item, index }) => (
                <TouchableHighlight onPress={() => pressMsg(item)}>
                  <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                    <Text style={[styles.listText, { paddingLeft: 10, width: '35%', textAlign: 'left', }]}>{item.datenv}</Text> 
                    <Text style={[styles.listText, { width: '35%' }]}>{item.horenv}</Text> 
                    <Text style={[styles.listText, { width: '30%' }]}>{item.placa}</Text> 
                    <Text style={[styles.listText, { width: '100%' }]}>{item.txtmsg}</Text> 
                  </View>
                </TouchableHighlight>
              )}
              
            />

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

  link: {
    color: '#FFFACD',
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 50,
    width: width - 10,
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
  
  list: {
    paddingHorizontal: 5,
    flexGrow: 0,
    paddingBottom: 100,
    // marginBottom: 120,
  },

  listItem: {
    display: 'flex',
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: 10,
    paddingBottom: 5,
    marginBottom: 5,
    height: 60,
  },
  
  listText: {
    // fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignSelf: 'center',
  },

})