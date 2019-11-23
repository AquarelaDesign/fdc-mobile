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
import { dataInicial, dataFinal } from '../../globais'
import GlobalStyles from '../../GlobalStyles'
import loading from '../../assets/json/car-scan.json'

const querystring = require('querystring')

export default Recebimentos = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [recs, setRecs] = useState([])

  const Cores = {
    CH: ['#4B0082', '#8B008B'],
    CT: ['#0000FF', '#2196F3'],
    BO: ['#FFD600', '#FF9800'],
    OU: ['#F44336', '#E91E63'],
    DI: ['#4CAF50', '#8BC34A'],
    TR: ['#FF9800', '#F44336'],
    DE: ['#4682B4', '#0f9b0f'],
  }
  
  const Icones = {
    CH: "map-marker",
    CT: "credit-card",
    BO: "barcode",
    OU: "dollar",
    DI: "money",
    TR: "sync",
    DE: "handshake-o",
  }

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(pagto) {
      let rec = []
      pagto.map((item, i) => {
        rec.push({
          icon: Icones[item.tippag],
          title: item.despag,
          valor: item.valor,
          linearGradientColors: Cores[item.tippag],
        })

      })
      setRecs(rec)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)

      async function buscaPas() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'ListaPassagens',
            pcodprg: 'TFCMON',
            pemail: email,
            pdatini: dataInicial,
            pdatfim: dataFinal,
            psituac: 'TOD',
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttpagto } = response.data.ProDataSet
                montaLista(ttpagto)
              }
            } 
            setIsLoading(false)
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log(response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log(error)
            setIsLoading(false)
          }
        }
      }
      buscaPas()
    })
  }, [email])

  const formataValor = (valor) => {
    return (
      <NumberFormat
        value={valor}
        displayType={'text'}
        fixedDecimalScale={true}
        decimalScale={2}
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
          {recs.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#FFFFF0', fontWeight: 'bold', fontSize: 14 }}
              rightTitle={formataValor(l.valor)}
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
          ))}
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
