import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, { modalStyle, ico_color } from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'

import { ListItem, Overlay } from 'react-native-elements'
import NumberFormat from 'react-number-format'

import Icon from 'react-native-vector-icons/FontAwesome'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

const Etiquetas = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [etqs, setEtqs] = useState([])
  const [modView, setModView] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(dados) {
      let etq = []

      etq.push({
        icon: "tag-multiple",
        title: "Abertas",
        type: 'material-community',
        linearGradientColors: ['#56a0b3', '#56a0b3'],
        valor: dados[0].qtetqtot,
      })

      etq.push({
        icon: "check-box-outline",
        title: "Normais",
        type: 'material-community',
        linearGradientColors: ['#99bf6d', '#99bf6d'],
        valor: dados[0].qtetqn,
      })

      etq.push({
        icon: "alert",
        title: "Próximas",
        type: 'material-community',
        linearGradientColors: ['#ffce85', '#ffce85'],
        valor: dados[0].qtetqp,
      })

      etq.push({
        icon: "close",
        title: "Vencidas",
        type: 'material-community',
        linearGradientColors: ['#eb8a83', '#eb8a83'],
        valor: dados[0].qtetqv,
      })

      etq.push({
        icon: "thumbs-up",
        title: "Efetuadas",
        type: 'font-awesome',
        linearGradientColors: ['#52a7eb', '#52a7eb'],
        valor: dados[0].qtreal,
      })

      etq.push({
        icon: "thumbs-down",
        title: "Perdidas",
        type: 'font-awesome',
        linearGradientColors: ['#232621', '#232621'],
        valor: dados[0].qtperd,
      })

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
              setIsLoading(false)
            } else {
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

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, GlobalStyles.AndroidSafeArea]}>
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
        <Icon name="tags" size={40} color={ico_color} style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Etiquetas</Text>
      </View>

      <ScrollView>
        <View style={styles.list}>
          {etqs.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: l.type,
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13, }}
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
    marginBottom: 10,
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