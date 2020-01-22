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
  }, [email, oficina, tipo])
  
  // console.log('recs', recs)
  // console.log('oficina', oficina)
  
  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  function handleNavigate(placa) {
    switch (tipo) {
      case 'EXC': ExcluiVeiculo(placa); break
      case 'PAS': navigation.navigate('Passagem', { placa }); break
      case 'ETQ': navigation.navigate('Etiqueta', { placa }); break
      case 'KMS': navigation.navigate('Km', { placa }); break
      default: Alert.alert(`A opção ${tipo} ainda não foi implementada!`); break
    }
  }

  function ExcluiVeiculo(placa) {
    Alert.alert(
      placa,
      `Confirma a Exclusão da Placa?`,
      [
        {
          text: 'Excluir',
          onPress: () => {
            console.log('Excluir Pressionado!')
            
            async function Exclui() {
              try {
                await Api.post('', querystring.stringify({
                  pservico: 'wfcvei',
                  pmetodo: 'ExcluiPlaca',
                  pcodprg: '',
                  pemail: email,
                  pplaca: placa,
                })).then(response => {
                  if (response.status === 200) {
                    if (response.data.ProDataSet !== undefined) {
                      // const { ttfccva } = response.data.ProDataSet
                      // setIsLoading(false)
                    } else {
                      // setIsLoading(false)
                    }
                  } else {
                    // setIsLoading(false)
                  }
                })
              } catch (error) {
                const { response } = error
                if (response !== undefined) {
                  // console.log(response.data.errors[0])
                  // setIsLoading(false)
                } else {
                  // console.log(error)
                  // setIsLoading(false)
                }
              }
            }
            // Exclui()
    
          },
        },
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelar Pressionado!'),
        }

      ]
    )
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
