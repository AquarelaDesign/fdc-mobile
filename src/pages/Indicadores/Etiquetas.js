import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, { modalStyle } from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'

import { ListItem, Overlay } from 'react-native-elements'
import NumberFormat from 'react-number-format'

import Icon from 'react-native-vector-icons/FontAwesome'
import btnLogo from '../../assets/filter.png'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

const Etiquetas = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [etqs, setEtqs] = useState([])
  const [modView, setModView] = useState(false)

  const Legendas = {
    qtetqn: "Abertas",
    qtetqp: "Normais",
    qtetqtot: "Próximas",
    qtetqv: "Vencidas",
    qtperd: "Efetuadas",
    qtreal: "Perdidas"
  }

  const Cores = {
    qtetqn: ['#4CAF50', '#8BC34A'],
    qtetqp: ['#2193b0', '#134E5E'],
    qtetqtot: ['#FF9800', '#F44336'],
    qtetqv: ['#F44336', '#E91E63'],
    qtperd: ['#3F51B5', '#2196F3'],
    qtreal: ['#061700', '#56ab2f'],
  }
  
  const Icones = {
    qtetqn: "tags",
    qtetqp: "check",
    qtetqtot: "warning",
    qtetqv: "times-circle",
    qtperd: "flag",
    qtreal: "close",
  }

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(dados) {
      let etq = []

      for (let [key, value] of Object.entries(dados)) {
        if (value !== 0) {
          for (let [k, v] of Object.entries(value)) {
            etq.push({
              icon: Icones[k],
              title: Legendas[k],
              linearGradientColors: Cores[k],
              valor: v,
            })
          }
        }
      }

      setEtqs(etq)
      setIsLoading(false)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
        async function buscaEtq() {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcpas',
              pmetodo: 'ResumoEtiquetas',
              pcodprg: 'TFCINI',
              pemail: email,
            })).then(response => {
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttresetq } = response.data.ProDataSet
                  montaLista(ttresetq)
                }
              } 
              setIsLoading(false)
            })
          } catch (error) {
            const { response } = error
            if (response !== undefined) {
              // console.log('Error-1', response.data.errors[0])
              setIsLoading(false)
            } else {
              // console.log('Error-2', error)
              setIsLoading(false)
            }
          }
        }
        buscaEtq()
      }
    })
  }, [email])

  const formataValor = (valor) => {
    return (
      <NumberFormat
        value={valor}
        displayType={'text'}
        fixedDecimalScale={true}
        decimalScale={0}
        renderText={value => <Text style={GlobalStyles.listaValor}>{value}</Text>}
      />
    )
  }

  const onFilter = () => {
    // alert('Filtro')
    setModView(true)
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, { paddingTop: 15, }]}>
      <Overlay
        isVisible={modView}
        supportedOrientations={['portrait', 'landscape']}
        windowBackgroundColor="rgba(0, 0, 0, .7)"
        overlayBackgroundColor="transparent"
        width="80%"
        height="40%"
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        }}
        onBackdropPress={() => {
          setModView(false)
        }}>
        <View style={modalStyle.modalContainer}>
          <View style={modalStyle.innerContainer}>
            <Text
              style={{
                color: '#4A4A4A',
                marginBottom: 5,
                marginTop: 25,
              }}>
              PARAMETROS
            </Text>

            <Button
              onPress={() => {setModView(false)}}
              title="Fechar"
            >
            </Button>
          </View>
        </View>
      </Overlay>

      <View style={styles.row}>
        <Icon name="tags" size={40} color="#f7ff00" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Etiquetas</Text>
        {/* <TouchableOpacity activeOpacity = { .5 }  onPress={() => onFilter()}>
          <Image style={modalStyle.boxIcone} source={btnLogo} tintColor='#FFFFFF'/>
        </TouchableOpacity> */}
      </View>

      <ScrollView>
        <View style={styles.list}>
          {etqs.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#f7ff00', fontWeight: 'bold', fontSize: 13, }}
              rightTitle={formataValor(l.valor)}
              rightTitleStyle={{ color: 'green', fontWeight: 'bold', fontSize: 13, }}
              linearGradientProps={{
                colors: l.linearGradientColors,
                start: [1, 0],
                end: [0.2, 0],
              }}
              ViewComponent={LinearGradient}
              containerStyle={{
                marginHorizontal: 16,
                marginVertical: 8,
                borderRadius: 8,
                marginBottom: 5,
              }}
            />
          ))}
        </View> 
          
      </ScrollView>
      {isLoading ? Loading() : <></>}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
    marginBottom: 50,
    borderTopWidth: 0,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF',
    width: width - 115,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    textTransform: "uppercase",
  },

})

export default Etiquetas