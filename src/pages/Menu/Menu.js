import React from 'react'

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

import Icon from 'react-native-vector-icons/FontAwesome'

import GlobalStyles from '../../GlobalStyles'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'

export default function Menu({ navigation }) {
  const onPress = (tipo) => {
    switch (tipo) {
      case 'INF':  navigation.navigate('InfoConfig'); break
      case 'COF':  navigation.navigate('Config'); break
      case 'USU':  navigation.navigate('Usuario'); break
      default: Alert.alert(`Clicado em ${tipo}`); break
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
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('INF')}>
            <View style={GlobalStyles.box}>
              <Icon name="info-circle" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Informação</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('COF')}>
            <View style={GlobalStyles.box}>
              <Icon name="gear" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Configuração</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('USU')}>
            <View style={GlobalStyles.box}>
              <Icon name="user-circle-o" size={60} color="#007189" />
              <Text style={GlobalStyles.boxText}>Sua conta</Text>
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