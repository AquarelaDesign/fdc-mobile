import React from 'react'

import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  _url, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'

const { width } = Dimensions.get('window')

export default function Informacao({ navigation }) {
  
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
      </LinearGradient>
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
    fontSize: 35,
    color: '#FFFACD',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    // marginTop: height - (height / 2) - 40, 
    paddingTop: 30,
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