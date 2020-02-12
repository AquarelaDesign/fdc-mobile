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

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  _url, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import logo from '../../assets/logo-mini.png'

const { width } = Dimensions.get('window')

export default function Info({ navigation }) {
  
  const pressLink = () => {
    navigation.navigate('Browser',{ uri: _url })
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
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
      </LinearGradient>
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
    color: '#FFFACD',
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
    color: '#FFFACD',
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