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

import { Ionicons  } from '@expo/vector-icons'

import GlobalStyles from '../components/GlobalStyles'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'

export default function Indicadores({ navigation }) {
  // const [msg, setMsg] = useState('')
  
  const onPress = (tipo) => {
    switch (tipo) {
      case 'PAS': 
        // setMsg('Passagem')
        break

      case 'ETQ': 
        // navigation.navigate('MainMenu')
        break
        
      case 'DOC': 
        navigation.navigate('BarChartScreen')
        break
        
      default:
        // setMsg(tipo)
        Alert.alert(`Clicado em ${tipo}`)
        break;
    }
    
  }
  
  // style={[GlobalStyles.AndroidSafeArea, styles.container]}
  
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
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('ETQ')}>
            <View style={GlobalStyles.box}>
              <Ionicons name="md-pricetags" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Etiquetas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('IND')}>
            <View style={GlobalStyles.box}>
              <Ionicons name="md-checkbox-outline" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Indicadores</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('CON')}>
            <View style={GlobalStyles.box}>
              <Ionicons name="md-cash" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Contas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('REC')}>
            <View style={GlobalStyles.box}>
              <Ionicons name="md-calculator" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Recebimentos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('DOC')}>
            <View style={GlobalStyles.box}>
              <Ionicons name="md-paper" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Documentos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }>
            <View style={GlobalStyles.box}></View>
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