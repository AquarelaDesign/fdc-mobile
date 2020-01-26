import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity 
} from 'react-native'

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import { FireSQL } from 'firesql'
import * as firebase from 'firebase/app'

// import firebaseConfig from '../services/config'

import Lottie from 'lottie-react-native'

import GlobalStyles from '../GlobalStyles'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import loading from '../assets/json/car-scan.json'

import btnLogo from '../assets/logo-mini.png'
import passagens from '../assets/Passagens.png'
import etiquetas from '../assets/Etiquetas.png'
import km from '../assets/KM.png'
import promocoes from '../assets/Promocoes.png'
import outros from '../assets/Outros.png'

const { width } = Dimensions.get('window')

const firebaseConfig = {
  apiKey: "AIzaSyBxyrnh_8GEZk5C1ghaUG0Cqqh0KvmxTno",
  authDomain: "ficha-do-carro.firebaseapp.com",
  databaseURL: "https://ficha-do-carro.firebaseio.com",
  projectId: "ficha-do-carro",
  storageBucket: "ficha-do-carro.appspot.com",
  messagingSenderId: "9280793479",
  appId: "1:9280793479:web:d48a2fc11b0a699edd8122",
  measurementId: "G-HXMZ44X0BZ"
}

firebase.initializeApp(firebaseConfig)
const dbRef = firebase.firestore()

// const db = firebase.database()
// const ref = db.ref("/users")

const fireSQL = new FireSQL(dbRef)

export default function Home({ navigation }) {  
  const [isLoading, setIsLoading] = useState(false)
  const [isOficina, setIsOficina] = useState(false)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(null)

  useEffect(() => {
    setIsLoading(true)

    // async function init() {
    //   const Oficina = await AsyncStorage.getItem('oficina')

    //   if (Oficina) {
    //     const ofi = JSON.parse(Oficina)
    //     if (ofi.tipusu !== undefined) {
    //       setIsOficina(ofi.tipusu === 'OFI' ? true : false)
    //     }
    //     setIsLoading(false)
    //   } else {
    //     setIsLoading(false)
    //   }
    //   registerForPushNotifications()
    // }

    AsyncStorage.getItem('oficina').then(Oficina => {
      if (Oficina) {
        const ofi = JSON.parse(Oficina)
        if (ofi.tipusu !== undefined) {
          setIsOficina(ofi.tipusu === 'OFI' ? true : false)
        }
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      registerForPushNotifications(Email)
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
  
      // this.subscription = Notifications.addListener(this.handleNotification)

      console.log('token', token)
      setToken(token)

      const consultaReg = fireSQL.query(`
        SELECT email
        FROM users
        WHERE email = '${Email}'
        ORDER BY email
        LIMIT 1
      `)

      console.log('consultaReg', consultaReg)

      consultaReg
      .then(users => {
        console.log('users', users)
        // for (const email of users) {
        //   console.log(
        //     `${city.city} in ${city.country} has ${city.people} people`
        //   )
        // }
      })
      .catch(err => {
        console.log('O registro não foi encontrado...', err)

        // let addDoc = dbRef.collection('users').add({
        //   email: Email,
        //   name: token
        // }).then(ref => {
        //   console.log('registro adicionado ID: ', ref.id);
        // })        
      })

      //ref.orderByChild("email").equalTo(email).limitToFirst(1).on("child_added", consultaReg)

      // POSTAR o token para o nosso back-end para que possamos usá-lo para enviar push a partir daí
      // var updates = {}
      // updates['/expoToken'] = token
      // await firebase.database().ref('/users/' + currentUser.uid).update(updates)

    }

    async function consultaReg(snapshot) {
      console.log('snapshot', snapshot)
    }

    
    // init()
    // registerForPushNotifications()
  
  }, [])

  const onPress = (tipo) => {
    if (!isOficina && tipo === 'IND') {
      return
    }

    switch (tipo) {
      // case 'PAS': navigation.navigate('Passagens')
      // case 'ETQ': navigation.navigate('Etiquetas')
      case 'PAR': Alert.alert(`Clicado em ${tipo}`); break
      case 'PRO': navigation.navigate('Promocoes'); break
      case 'OUT': navigation.navigate('Outros'); break
      case 'IND': navigation.navigate('Indicadores'); break
      default: navigation.navigate('ListaPlacas', { tipo: tipo }); break
      //Alert.alert(`Clicado em ${tipo}`)
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
      </ImageBackground>
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
    marginTop: 70,
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
