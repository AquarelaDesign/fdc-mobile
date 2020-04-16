import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity 
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  bg_colors, bg_start, bg_end
} from '../GlobalStyles'

import Api from '../services/oapi'

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import loading from '../assets/json/car-scan.json'

import btnLogo from '../assets/bt-menu.png'
import passagens from '../assets/Passagens.png'
import etiquetas from '../assets/Etiquetas.png'
import km from '../assets/KM.png'
import promocoes from '../assets/Promocoes.png'
import outros from '../assets/Outros.png'

const { width } = Dimensions.get('window')

const querystring = require('querystring')

StatusBar.setHidden(true)

export default function Home({ navigation }) {  
  const [isLoading, setIsLoading] = useState(false)
  const [isOficina, setIsOficina] = useState(false)
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('email').then(Email => {
      if (email !== '') {
        setEmail(Email)
        registerForPushNotifications(Email)
      }
    })

    async function registerForPushNotifications(Email) {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        if (status !== 'granted') {
          return
        }
      }
      const token = await Notifications.getExpoPushTokenAsync()
      const subscription = Notifications.addListener(_handleNotification)

      // console.log('token', token, oficina.tokpsh)
      setToken(token)
      // salvar token na base do FDC
      if (oficina.tokpsh !== token && email !== '') {
        salvaToken(token)
      }
    }
    
  }, [email])

  useEffect(() => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      if (Oficina) {
        const ofi = JSON.parse(Oficina)
        if (ofi.tipusu !== undefined) {
          setIsOficina(ofi.tipusu === 'OFI' ? true : false)
          setOficina(JSON.parse(Oficina))
        }

        if (ofi.tipusu !== undefined) {
          if (token === null) {
            setToken(ofi.tokpsh)
          }
        }
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    })
  }, [oficina])

  useEffect(() => {
    if (token !== null && token !== undefined) {
      async function sToken() {
        await AsyncStorage.setItem('tkpush', token)
      }
      sToken()
    }
  }, [token])

  _handleNotification = Notification => {
    setNotification(Notification)
  }

  const salvaToken = (token) => {
    if (email !== '' && token !== '') {
      async function GravaToken() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcusu',
            pmetodo: 'GravaToken',
            pcodprg: '',
            pemail: email,
            pemailcli: email,
            ptiptkn: 'push',
            ptoken: token,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfcusu } = response.data.ProDataSet
                AsyncStorage.setItem('oficina', JSON.stringify(ttfcusu))
              } 
            } else {
              console.log('response.status', response.status)
            }
          })
        } catch (error) {
          const { response } = error
          console.log('error', response)
        }
      }
      GravaToken()
    }
  }

  const onPress = (tipo) => {
    if (!isOficina && tipo === 'IND') {
      return
    }

    switch (tipo) {
      case 'PAR': navigation.navigate('Menu'); break
      case 'PRO': navigation.navigate('Promocoes'); break
      case 'OUT': navigation.navigate('Outros'); break
      case 'IND': navigation.navigate('Indicadores'); break
      default: navigation.navigate('ListaPlacas', { tipo: tipo }); break
    }
    
  }
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
        >
        <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('PAR')}>
          <View style={styles.boxBtn}>
            <Image style={styles.boxIcone} source={btnLogo} />
          </View>
        </TouchableOpacity>

        <Image style={styles.logo} source={logo} />

        <View style={GlobalStyles.boxSpace}>
        </View>
        
        <View style={GlobalStyles.boxContainer}>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('PAS')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={passagens} />
              <Text style={GlobalStyles.boxText}>Passagens</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('ETQ')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={etiquetas} />
              <Text style={GlobalStyles.boxText}>Etiquetas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('KMS')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={km} />
              <Text style={GlobalStyles.boxText}>KM</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('PRO')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={promocoes} />
              <Text style={GlobalStyles.boxText}>Promoções</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('OUT')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={outros} />
              <Text style={GlobalStyles.boxText}>Outros</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('IND')}>
            <View style={GlobalStyles.box}>
              {
                isOficina ? 
                <>
                  <Image style={GlobalStyles.boxIcone} source={passagens} />
                  <Text style={GlobalStyles.boxText}>Indicadores</Text>
                </>
                : <Text></Text>
              }
            </View>
          </TouchableOpacity>
        </View>
        {isLoading ? Loading() : <></>}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -10,
  },

  boxBtn: {
    marginTop: 60,
    width: width + 60,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'baseline',
    justifyContent: 'flex-end',
  },

  boxIcone: {
    height: 40,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginTop: 0,
    zIndex: 0, 
    position: 'absolute',
  },
})
