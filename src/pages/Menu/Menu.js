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

export default function Menu({ navigation }) {
  const onPress = (tipo) => {
    switch (tipo) {
      case 'INF':  navigation.navigate('InfoConfig'); break
      case 'COF':  navigation.navigate('Config'); break
      case 'USU':  navigation.navigate('Usuario'); break
      case 'NEW':  navigation.navigate('NovoUsuario'); break
      default: Alert.alert(`Clicado em ${tipo}`); break
    }
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
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('INF')}>
            <View style={GlobalStyles.box}>
              <Icon name="info-circle" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Informação</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('USU')}>
            <View style={GlobalStyles.box}>
              <Icon name="user-circle-o" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Sua conta</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('NEW')}>
            <View style={GlobalStyles.box}>
              <Icon name="user-plus" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Novo Usuario</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }>
            <View style={GlobalStyles.box}></View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }>
            <View style={GlobalStyles.box}></View>
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