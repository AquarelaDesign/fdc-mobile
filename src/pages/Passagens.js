import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Lottie from 'lottie-react-native'

import GlobalStyles from '../GlobalStyles'
import Api from '../services/oapi'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import loading from '../assets/json/car.json'

const querystring = require('querystring')

export default function Passagens({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [pass, setPass] = useState([])

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(placas) {
      let pas = []
      placas.map((item, i) => {
        pas.push({
          id: i,
          title: item.placa,
        })

      })
      setPass(pas)
      setIsLoading(false)
    }

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      
      async function buscaPas() {
        try {
          
          await Api.post('', querystring.stringify({
            pservico: 'wfcvei',
            pmetodo: 'listaPlacasApp',
            pcodprg: '',
            pemail: email,
            pidapp: oficina.idusu,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfccva } = response.data.ProDataSet
                montaLista(ttfccva)
              }
            } 
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log(response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log(error)
            setIsLoading(false)
          }
        }
      }
      buscaPas()
      
    })
  }, [email, oficina])
  
  // console.log('recs', recs)
  // console.log('oficina', oficina)
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  function handleNavigate(placa) {
    navigation.navigate('Passagem', { placa })
    // Alert.alert(placa)
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      >
        <Image style={styles.logo} source={logo} />
        <Text style={styles.title}>Selecione a placa para consulta</Text>
        <FlatList 
          style={styles.list}
          data={pass}
          keyExtractor={pass => pass.title}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
              <View style={styles.listItem}>
                <TouchableOpacity onPress={() => handleNavigate(item.title)} style={styles.button}>
                    <Text style={styles.buttonText}>{item.title}</Text>
                </TouchableOpacity>
              </View>
          )}
        />
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
    marginTop: 50,
  },
  
  title: {
    fontSize: 18,
    color: '#444',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },

  list: {
    paddingHorizontal: 20,
  },

  listItem: {
    marginRight: 15,
  },

  button: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 15,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 25,
  },

})
