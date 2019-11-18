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

import { LinearGradient } from '../components/LinearGradient'
import Api from '../services/api'
import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../GlobalStyles'

const Recebimentos = () => {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [recs, setRecs] = useState([])

  const Cores = {
    CH: ['#FFEFBA', '#FFFFFF'],
    CT: ['#3F51B5', '#2196F3'],
    BO: ['#FFD600', '#FF9800'],
    OU: ['#F44336', '#E91E63'],
    DI: ['#4CAF50', '#8BC34A'],
    TR: ['#FF9800', '#F44336'],
    DE: ['#000000', '#0f9b0f'],
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

    AsyncStorage.getItem('token').then(Token => {
      if (Token) {
        setToken(Token)
      }
    })

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)

      async function buscaPas() {
        try {
          const headers = {
            'Authorization': token
          }
          
          await Api.post('/v01/busca', {
            pservico: 'wfcpas',
            pmetodo: 'ListaPassagens',
            pcodprg: 'TFCMON',
            pemail: email,
            params: {
              pdatini: dataInicial,
              pdatfim: dataFinal,
              psituac: 'TOD',
            }
          },{
            headers: headers
          }).then(response => {
            if (response.status === 200) {
              const { ttpagto } = response.data.data
              montaLista(ttpagto)
            } 
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            console.log(response.data.errors[0])
          } else {
            console.log(error)
          }
        }
      }
      buscaPas()
    })
  }, [email, token])

  console.log('recs', recs)

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

  return (
    <SafeAreaView style={GlobalStyles.container}>
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
              titleStyle={{ color: 'white', fontWeight: 'bold' }}
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
    borderTopWidth: 1,
  },
})

export default Recebimentos