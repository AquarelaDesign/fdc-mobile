import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import { ListItem } from 'react-native-elements'
import NumberFormat from 'react-number-format'
import Lottie from 'lottie-react-native'

import { LinearGradient } from '../../components/LinearGradient'
import Api from '../../services/oapi'
import GlobalStyles from '../../GlobalStyles'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')

const Etiquetas = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [etqs, setEtqs] = useState([{
    qtetqn: 0, 
    qtetqp: 0, 
    qtetqtot: 0, 
    qtetqv: 0, 
    qtperd: 0, 
    qtreal: 0
  }])

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
          etq.push({
            icon: Icones[key],
            title: Legendas[key],
            linearGradientColors: Cores[key],
            valor: value,
          })
        }
      }
      console.log('setEtqs', etq)
      setEtqs(etq)
      setIsLoading(false)
    }

    montaLista(etqs)

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)

      async function buscaEtq() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'ResumoEtiquetas',
            pcodprg: 'TFCINI',
            pemail: email,
          })).then(response => {
            console.log('response', response)
            if (response.status === 200) {
              if (response.data.data !== undefined) {
                const { ttresetq } = response.data.ProDataSet
                console.log('ttresetq', ttresetq)
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
    })
  }, [email])

  console.log('etqs', etqs)

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

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 15,}]}>
      <ScrollView>
        <View style={styles.list}>
          {
          /* 
          etqs.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#f7ff00', fontWeight: 'bold' }}
              rightTitle={formataValor(l.valor)}
              rightTitleStyle={{ color: 'green', fontWeight: 'bold' }}
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
              }}
            />
          ))
           */
          }
        </View> 
      </ScrollView>
      {isLoading ? Loading() : <></>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
    borderTopWidth: 1,
  },
})

export default Etiquetas