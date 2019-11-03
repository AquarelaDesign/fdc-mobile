import React, { useState } from 'react'

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity 
} from 'react-native'

import GlobalStyles from '../components/GlobalStyles'

import logo from '../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../assets/fundo-app.png'
import passagens from '../assets/passagens-icon4.png'
import etiquetas from '../assets/icon-etiqueta.png'
import km from '../assets/ICON-KM2.png'
import promocoes from '../assets/icon-promotion2.png'
import outros from '../assets/se2gurocarro.png'

let width = Dimensions.get('window').width

export default function MainMenu({ navigation }) {
  // const [msg, setMsg] = useState('')
  
  const onPress = (tipo) => {
    switch (tipo) {
      case 'PAS': 
        // setMsg('Passagem')
        break

      case 'ETQ': 
        // setMsg('Etiqueta')
        break
        
      default:
        // setMsg(tipo)
        break;
    }
    
    Alert.alert(`Clicado em ${tipo}`)
  }

  return (
    <SafeAreaView style={[GlobalStyles.AndroidSafeArea, styles.container]}>
      <ImageBackground
        style={styles.background}
        source={bg}
      >
        <Image style={styles.logo} source={logo} />

        <View style={styles.boxSpace}>
        </View>
        
        <View style={styles.boxContainer}>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('PAS')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={passagens} />
              <Text style={styles.boxText}>Passagens</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('ETQ')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={etiquetas} />
              <Text style={styles.boxText}>Etiquetas</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('KMS')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={km} />
              <Text style={styles.boxText}>KM</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('PRO')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={promocoes} />
              <Text style={styles.boxText}>Promoções</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('OUT')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={outros} />
              <Text style={styles.boxText}>Outros</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('IND')}>
            <View style={styles.box}>
              <Image style={styles.boxIcone} source={passagens} />
              <Text style={styles.boxText}>Indicadores</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  logo: {
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 70,
  },

  boxIcone: {
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 0,
  },

  boxText: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 10,
  },

  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  boxSpace: {
    height: 90,
  },

  box: {
    marginTop: 20,
    width: width / 3 - 20,
    height: 120,
    margin: 6,
    marginLeft: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})