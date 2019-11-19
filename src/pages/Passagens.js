import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import GlobalStyles from '../GlobalStyles'
import Api from '../services/api'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'

export default function Passagens({ navigation }) {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [pass, setPass] = useState([])

  useEffect(() => {

    async function montaLista(placas) {
      let pas = []
      placas.map((item, i) => {
        pas.push({
          id: i,
          title: item.placa,
        })

      })
      setPass(pas)
    }

    AsyncStorage.getItem('token').then(Token => {
      if (Token) {
        setToken(Token)
      }
    })

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      
      async function buscaPas() {
        try {
          const headers = {
            'Authorization': token
          }
          
          await Api.post('/v01/busca', {
            pservico: 'wfcvei',
            pmetodo: 'listaPlacasApp',
            pcodprg: '',
            pemail: email,
            params: {
              pidapp: oficina.idusu,
            }
          },{
            headers: headers
          }).then(response => {
            if (response.status === 200) {
              // console.log('data', response.data.data)
              const { ttfccva } = response.data.data
              montaLista(ttfccva)
            } 
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log(response.data.errors[0])
          } else {
            // console.log(error)
          }
        }
      }
      buscaPas()
      
    })
  }, [email, token, oficina])
  
  // console.log('recs', recs)
  // console.log('oficina', oficina)

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
