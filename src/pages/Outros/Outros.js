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

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import ExcluiVeiculos from '../../assets/ExcluiVeiculos.png'
import Mensagens from '../../assets/Mensagens.png'
import ConsultaPJ from '../../assets/ConsultaPJ.png'
import FAQ from '../../assets/FAQ.png'
import Informacao from '../../assets/Informacao.png'

export default function Outros({ navigation }) {
  const onPress = (tipo) => {
    switch (tipo) {
      case 'EXC': navigation.navigate('ListaPlacas', { tipo: 'EXC' }); break
      case 'MEN': navigation.navigate('Mensagens'); break
      case 'CON': navigation.navigate('ConsultaPJ'); break
      case 'FAQ': navigation.navigate('FAQ'); break
      case 'INF': navigation.navigate('Informacao'); break
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
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('EXC')}>
            <View style={GlobalStyles.box}>
              {/* <Icon name="tags" size={60} color="#007189" /> */}
              <Image style={GlobalStyles.boxIcone} source={ExcluiVeiculos} />
              <Text style={GlobalStyles.boxText}>Exclui Veículos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('MEN')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={Mensagens} />
              <Text style={GlobalStyles.boxText}>Mensagens</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('CON')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={ConsultaPJ} />
              <Text style={GlobalStyles.boxText}>Consulta PJ</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('FAQ')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={FAQ} />
              <Text style={GlobalStyles.boxText}>FAQ</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }  onPress={() => onPress('INF')}>
            <View style={GlobalStyles.box}>
              <Image style={GlobalStyles.boxIcone} source={Informacao} />
              <Text style={GlobalStyles.boxText}>Informação</Text>
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