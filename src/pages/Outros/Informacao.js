import React from 'react'

import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
} from 'react-native'

import GlobalStyles, { _url } from '../../GlobalStyles'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'

const { width, height } = Dimensions.get('window')

export default function Informacao({ navigation }) {
  
  const pressLink = () => {
    navigation.navigate('Browser',{ uri: _url })
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
          <Text style={styles.msgTitle}>
            Simples, direto e objetivo
          </Text>
          <View style={GlobalStyles.boxSpace}>
          </View>

          <Text style={styles.msgText}>
            Entre em contato com sua oficina e 
            solicite o registro dos serviços realizados
            no seu veículo é rápido, simples e sem custos.
          </Text>
          <View style={GlobalStyles.boxSpace}>
          </View>

          <Text 
            style={styles.link} 
            onPress={() => pressLink()}>
            {` ${_url} `}
          </Text>
          <View style={GlobalStyles.boxSpace}>
          </View>

          <Text style={styles.msgText}>
            Copyright by Procyon Informática
          </Text>
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

  msgTitle: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    // marginTop: height - (height / 2) - 40, 
    paddingTop: 30,
    width: width - 10, 
  },

  msgText: {
    fontSize: 20,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    // marginTop: height - (height / 2) - 40, 
    paddingTop: 50,
    // padding: 10,
    width: width - 10, 
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

})