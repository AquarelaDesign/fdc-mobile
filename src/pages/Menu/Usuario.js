import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Icon from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get('window')

const Usuario = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [oficina, setOficina] = useState({})

  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('oficina').then(Oficina => {
      setOficina(JSON.parse(Oficina))
      setIsLoading(false)
    })

  }, [oficina])

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 25,}]}>
      <View style={styles.scene}>
        <LinearGradient
          colors={bg_colors}
          style={GlobalStyles.background}
          start={bg_start}
          end={bg_end}
        >
          <Icon style={styles.logo} name="user-circle-o" size={120}/>

          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Nome</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{oficina.nome}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Endereço</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{`${oficina.endrua}, ${oficina.endnum}`}</Text>
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
                <Text style={styles.text}>{oficina.bairro}</Text>
              </View>
              <View style={[styles.vtext, {width: '30%',}]} >
                <Text style={styles.text}>{oficina.uf}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Fone</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{oficina.fone}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginTop: 100,
    color: "#007189",
  },

  scene: {
    flex: 1,
    marginTop: 10,
  },

  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
    width: width,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 10,
    width: width,
  },

  legend: {
    fontSize: 14,
    color: '#007189',
    textAlign: 'left',
    // height: 20,
  },

  vtext: {
    marginTop: 5,
    width: width,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F0E68C',
    textAlign: 'left',
    // width: '100%',
    // height: 20,
  },

})

export default Usuario
