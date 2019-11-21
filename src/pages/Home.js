import React, { useState } from 'react'

import {
  Alert,
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

  const onPress = (tipo) => {
    switch (tipo) {
      case 'PAS': 
        navigation.navigate('Passagens')
        break

      case 'ETQ': 
        navigation.navigate('Etiquetas')
        break
        
      case 'IND': 
        navigation.navigate('Indicadores')
        break
        
      default:
        // setMsg(tipo)
        Alert.alert(`Clicado em ${tipo}`)
        break;
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
              <Image style={GlobalStyles.boxIcone} source={passagens} />
              <Text style={GlobalStyles.boxText}>Indicadores</Text>
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
