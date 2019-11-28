import React, { useState, useEffect } from 'react'

import {
  Alert,
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

import GlobalStyles, { colors } from '../GlobalStyles'
import Api from '../services/oapi'
import Axios from 'axios'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import loading from '../assets/json/car-scan.json'

const querystring = require('querystring')

export default function ListaPlacas({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [tipo, setTipo] = useState('')
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [pass, setPass] = useState([])

  useEffect(() => { 
    AsyncStorage.getItem('oficina').then(Oficina => {
      const ofi = JSON.parse(Oficina) 
      setOficina(ofi)
    })
  }, [oficina])
  
  useEffect(() => {
    setIsLoading(true)
    setTipo(navigation.getParam('tipo'))

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

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      
      async function buscaPas() {
        try {
          console.log('Email-2', Email, email, oficina)
          if (email && oficina.idusu) {

            
            /*
            await Api.post('', querystring.stringify({
              pservico: 'wfcvei',
              pmetodo: 'listaPlacasApp',
              pcodprg: '',
              pemail: email,
              pidapp: oficina.idusu,
            })).then(response => {
              console.log('response', response)
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttfccva } = response.data.ProDataSet
                  montaLista(ttfccva)
                }
              }
            })
            */
            const par = querystring.stringify({
              pservico: 'wfcvei',
              pmetodo: 'listaPlacasApp',
              pcodprg: '',
              pemail: email,
              pidapp: oficina.idusu,
              widtrans: `${oficina.codemp}|1|1|${Email}`,
              wip: '192.168.50.138',
              wseqaba: 0,
            })

            const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
            const url = `${uri}?prog=wficha&${par}`
     
            console.log('url', url)
            
            await Axios.put(
              url
            ).then(response => {
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttfccva } = response.data.ProDataSet
                  montaLista(ttfccva)
                } else {
                  setIsLoading(false)
                }
              } else {
                setIsLoading(false)
              }
            })

          }
        } catch (error) {
          console.log(error)
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
  }, [email, tipo])
  
  // console.log('pass', pass)
  // console.log('oficina', oficina)
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  function handleNavigate(placa) {
    switch (tipo) {
      case 'PAS': navigation.navigate('Passagem', { placa }); break
      case 'ETQ': navigation.navigate('Etiqueta', { placa }); break
      case 'KMS': navigation.navigate('Km', { placa }); break
      default: Alert.alert(`A opção ${tipo} ainda não foi implementada!`); break
    }

    // navigation.navigate('Km', { placa })
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
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => handleNavigate(item.title)}>
              <View style={[styles.listItem, { backgroundColor: colors[index % colors.length] }]}>
                <Text style={styles.listText}>{item.title}</Text>
              </View>
            </TouchableHighlight>
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
    paddingHorizontal: 5,
    flexGrow: 0,
    marginBottom: 90,
  },

  listItem: {
    display: "flex",
    width: Dimensions.get('window').width - 10,
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingRight: 10,
    height: 50,
    justifyContent: 'center',
  },
  
  listText: {
    // fontWeight: 'bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    flexDirection: 'row',
    alignSelf: "center",
  },

})
