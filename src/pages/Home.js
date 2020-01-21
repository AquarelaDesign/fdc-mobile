import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity 
} from 'react-native'

import Lottie from 'lottie-react-native'

import GlobalStyles from '../GlobalStyles'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import loading from '../assets/json/car-scan.json'

import passagens from '../assets/Passagens.png'
import etiquetas from '../assets/Etiquetas.png'
import km from '../assets/KM.png'
import promocoes from '../assets/Promocoes.png'
import outros from '../assets/Outros.png'

export default function Home({ navigation }) {  
  const [isLoading, setIsLoading] = useState(false)
  const [isOficina, setIsOficina] = useState(false)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const Oficina = await AsyncStorage.getItem('oficina')

      if (Oficina) {
        const ofi = JSON.parse(Oficina)
        if (ofi.tipusu !== undefined) {
          setIsOficina(ofi.tipusu === 'OFI' ? true : false)
        }
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const onPress = (tipo) => {
    if (!isOficina && tipo === 'IND') {
      return
    }

    switch (tipo) {
      // case 'PAS': navigation.navigate('Passagens')
      // case 'ETQ': navigation.navigate('Etiquetas')
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
    marginTop: 50,
  },
})
