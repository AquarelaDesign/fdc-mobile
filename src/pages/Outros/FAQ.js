import React from 'react'

import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  _url, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import Accordian from '../../components/Accordian'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'

const { width } = Dimensions.get('window')

const faqs = {
  menu: [
    {
      title: 'Como faço para ver a placa do meu carro no aplicativo?',
      data: 'Entre em contato com o seu prestador de serviços e solicite a inclusão dos serviços executados em seu veículo no Ficha do carro (www.fichadocarro.com.br).\n\nSolicite também que ele realize a liberação da consulta informando seu email de login no aplicativo Ficha do Carro'
    },
    {
      title: 'Qualquer pessoa pode visualizar os serviços realizados no meu veículo?',
      data: 'Não, a consulta através do aplicativo é permitida somente após a liberação que é realizada pelo seu prestador de serviços.'
    }
  ]
}

export default function FAQ({ navigation }) {

  const pressLink = () => {
    navigation.navigate('Browser', { uri: _url })
  }

  const getRandom = () => {
    const min = 1
    const max = 100
    const rand = min + Math.random() * (max - min)
    return rand.toString()
  }

  renderAccordians = () => {
    const items = [];
    for (item of faqs.menu) {
      items.push(
        <Accordian
          key={getRandom()}
          title={item.title}
          data={item.data}
        />
      );
    }
    return items
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
          {renderAccordians()}
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

  accordian: {
    width: width - 2,
  },

})