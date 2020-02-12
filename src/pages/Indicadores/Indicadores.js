import React from 'react'

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity 
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import Icon from 'react-native-vector-icons/FontAwesome'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'

export default function Indicadores({ navigation }) {
  const onPress = (tipo) => {
    switch (tipo) {
      case 'ETQ':  navigation.navigate('Etiquetas'); break
      case 'IND':  navigation.navigate('Indica'); break
      case 'CON':  navigation.navigate('Contas'); break
      case 'REC':  navigation.navigate('Recebimentos'); break
      case 'DOC': navigation.navigate('Documentos'); break
      default: Alert.alert(`Clicado em ${tipo}`); break
    }
  }
  
  // style={[GlobalStyles.AndroidSafeArea, styles.container]}
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
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('ETQ')}>
            <View style={GlobalStyles.box}>
              <Icon name="tags" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Etiquetas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('IND')}>
            <View style={GlobalStyles.box}>
              <Icon name="check-square" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Indicadores</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('CON')}>
            <View style={GlobalStyles.box}>
              <Icon name="money" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Contas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('REC')}>
            <View style={GlobalStyles.box}>
              <Icon name="calculator" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Recebimentos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('DOC')}>
            <View style={GlobalStyles.box}>
              <Icon name="file" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Documentos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }>
            <View style={GlobalStyles.box}></View>
          </TouchableOpacity>
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

})