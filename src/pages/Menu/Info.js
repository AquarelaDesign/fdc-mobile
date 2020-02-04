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

import logo from '../../assets/logo-mini.png'
import bg from '../../assets/fundo-app.png'

const { width } = Dimensions.get('window')

export default function Info({ navigation }) {
  
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
            Ficha do Carro
          </Text>

          <Text style={styles.msgText}>
            Todo o histórico de manutenção do veículo na palma da sua mão.
          </Text>

          <Text 
            style={styles.link} 
            onPress={() => pressLink()}>
            {` ${_url} `}
          </Text>

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
    height: 140,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 100,
  },

  msgTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 20,
    // marginTop: height - (height / 2) - 40, 
    // paddingTop: 30,
    width: width - 10, 
  },

  msgText: {
    fontSize: 17,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    // marginTop: height - (height / 2) - 40, 
    paddingTop: 30,
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
    paddingTop: 30,
    width: width - 10, 
  },

})