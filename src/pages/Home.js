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

import GlobalStyles from '../GlobalStyles'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import passagens from '../assets/passagens-icon4.png'
import etiquetas from '../assets/icon-etiqueta.png'
import km from '../assets/ICON-KM2.png'
import promocoes from '../assets/icon-promotion2.png'
import outros from '../assets/se2gurocarro.png'

export default function Home({ navigation }) {
  const [isOficina, setIsOficina] = useState(false)
  const [oficina, setOficina] = useState({})

  useEffect(() => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(Oficina)
      setIsOficina(Oficina.codsia !== '' && Oficina.codsia !== undefined ? true : false)
      // console.log('Oficina', Oficina)
    })


  }, [oficina])

  const onPress = (tipo) => {
    switch (tipo) {
      // case 'PAS': navigation.navigate('Passagens')
      // case 'ETQ': navigation.navigate('Etiquetas')
      case 'IND': navigation.navigate('Indicadores'); break
      default: navigation.navigate('ListaPlacas', { tipo: tipo }); break
      //Alert.alert(`Clicado em ${tipo}`)
    }
    
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
