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

const Indica = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [inds, setInds] = useState([])

  useEffect(() => {
    setIsLoading(true)

    async function montaLista(dados) {
      let ind = []
      
      ind.push({
        icon: "gears",
        title: "Peças",
        subtitle: `${calcTot(dados[0].qtdtot,dados[0].perpec,0)} Passagens (${retValor(dados[0].perpec, 'decimal')} %) \n${retValor(dados[0].vlpec, 'currency')}`,
        linearGradientColors: ['#3F51B5', '#2196F3'],
        valor: parseFloat(dados[0].vlpec)
      })

      ind.push({
        icon: "wrench",
        title: "Serviços",
        subtitle: `${calcTot(dados[0].qtdtot,dados[0].perserv,0)} Passagens (${retValor(dados[0].perserv, 'decimal')} %) \n${retValor(dados[0].vlserv, 'currency')}`,
        linearGradientColors: ['#4CAF50', '#8BC34A'],
        valor: parseFloat(dados[0].vlserv)
      })
      
      ind.push({
        icon: "calculator",
        title: "Total",
        subtitle: `${calcTot(dados[0].qtdtot,100,0)} Passagens (${100} %) \n${retValor(dados[0].vltotal, 'currency')}`,
        linearGradientColors: ['#F44336', '#E91E63'],
        valor: parseFloat(dados[0].vltotal)
      })
      
      ind.push({
        icon: "flag",
        title: "Ticket Médio",
        subtitle: `\n${retValor(dados[0].tikmed, 'currency')}`,
        linearGradientColors: ['#FF9800', '#F44336'],
        valor: parseFloat(dados[0].tikmed)
      })
      
      setInds(ind)
      setIsLoading(false)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '') {
        async function buscaIndica() {
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
                  const { ttresumo } = response.data.ProDataSet
                  montaLista(ttresumo)
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
        buscaIndica()
      }
    })
  }, [email])

  function calcTot(total, per, dec) {
    try {
      let valor = (total * (per / 100))

      let ret = valor.toFixed(dec).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
      return ret.replace('.',',')
    } catch (error) {
      return '0'
    }
  }

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
        <Icon name="check-square" size={40} color="#007189" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Indicadores</Text>
      </View>

      <ScrollView>
        <View style={styles.list}>
          {inds.map((l, i) => (
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

export default Indica