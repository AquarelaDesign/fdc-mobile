import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { ListItem } from 'react-native-elements'
import Lottie from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { LinearGradient } from '../../components/LinearGradient'
import { dataInicial, dataFinal } from '../../globais'
import Api from '../../services/oapi'
import GlobalStyles from '../../GlobalStyles'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')

const Contas = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [cons, setCons] = useState([])

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(dados) {
      let ind = []
      
      ind.push({
        icon: "bank",
        title: "Contas a Pagar",
        subtitle: `${retValor(dados.totpag, 'currency')}`,
        linearGradientColors: ['#3F51B5', '#2196F3'],
        valor: `${retValor(dados.totpag, 'currency')}`
      })

      ind.push({
        icon: "money",
        title: "Contas a Receber",
        subtitle: `${retValor(dados.totrec, 'currency')}`,
        linearGradientColors: ['#4CAF50', '#8BC34A'],
        valor: `${retValor(dados.totrec, 'currency')}`
      })
            
      setCons(ind)
      setIsLoading(false)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)

      async function buscaContas() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcfin',
            pmetodo: 'ListaResumo',
            pcodprg: 'TFCFIN',
            pemail: email,
            pdtini: dataInicial,
            pdtfim: dataFinal,
            ptipcon: 'A',
          })).then(response => {
            console.log(response)
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttresumo } = response.data.ProDataSet

                let totpag = 0
                let totrec = 0
                let qtpag = 0
                let qtrec = 0
                
                ttresumo.forEach((value, key) => {
                  totpag += value.totpag
                  totrec += value.totrec
                  qtpag += value.qtpag
                  qtrec += value.qtrec
                })
  
                const totais = { 
                  totpag,
                  totrec,
                  qtpag,
                  qtrec
                }

                montaLista(totais)
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
      buscaContas()
    })
  }, [email])

  function retValor(valor, tipo) {
    let xVal = 0

    if (valor !== undefined || valor !== null) {
      xVal = parseFloat(valor)
    }

    try {
      let ret =  (tipo === 'currency' ? 'R$ ' : '') + xVal.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
      return ret.replace('.',',')
    } catch (error) {
      return tipo === 'currency' ? 'R$ 0,00' : '0,00'
    }
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 15,}]}>
      <View style={styles.row}>
        <Icon name="calculator" size={40} color="#007189" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Contas</Text>
      </View>

      <ScrollView>
        <View style={styles.list}>
          {cons.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#f7ff00', fontWeight: 'bold', fontSize: 17, }}
              subtitle={l.subtitle}
              subtitleStyle={{ color: 'white', fontSize: 14,  }}
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
    width: Dimensions.get('window').width - 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    textTransform: "uppercase",
  },

})

export default Contas