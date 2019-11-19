import React, { useState, useEffect } from 'react'

import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import GlobalStyles from '../../GlobalStyles'
import Api from '../../services/api'

import bg from '../../assets/fundo-app.png'

const largura = Dimensions.get('window').width

export default function Info({ navigation }) {
  const [dados, setDados] = useState('')

  useEffect(() => {
    setDados(navigation.getParam('dados'))
  }, [dados])
  
  console.log('dados', dados)

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Nome</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{dados.nome}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Endereço</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{`${dados.endere}, ${dados.endnum}`}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>Bairro</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>UF</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vtext, {width: '70%',}]} >
              <Text style={styles.text}>{dados.bairro}</Text>
            </View>
            <View style={[styles.vtext, {width: '30%',}]} >
              <Text style={styles.text}>{dados.uf}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vlegend}>
              <Text style={styles.legend}>Fone</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.vtext} >
              <Text style={styles.text}>{dados.fone}</Text>
            </View>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
    width: largura,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 10,
    width: largura,
  },

  legend: {
    fontSize: 14,
    color: '#00FFFF',
    textAlign: 'left',
    // height: 20,
  },

  vtext: {
    marginTop: 5,
    width: largura,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#F0E68C',
    textAlign: 'left',
    // width: '100%',
    // height: 20,
  },

})
