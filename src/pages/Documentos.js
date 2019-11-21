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
import Axios from 'axios'
import NumberFormat from 'react-number-format'
import Lottie from 'lottie-react-native'

import { LinearGradient } from '../components/LinearGradient'
import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../GlobalStyles'
import loading from '../assets/json/car-scan.json'

const Documentos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [docs, setDocs] = useState([])

  const Legendas = {
    canval: "Cancelada com DANFE",
    cancel: "Cancelado",
    inu: "Inutilizada",
    dev: "NFe Devolução",
    imp: "NFe Importada",
    pas: "Passagem",
    rps: "RPS",
    nfse: "NFSe",
    err: "Com Erro",
    orc: "Orçamento",
    val: "NFe",
    geral: "Total",
  }

  const Cores = {
    canval: ['#6f0000', '#fc6767'],
    cancel: ['#200122', '#6f0000'],
    inu: ['#000000', '#434343'],
    dev: ['#3F51B5', '#2196F3'],
    imp: ['#134E5E', '#71B280'],
    pas: ['#FFD600', '#FF9800'],
    rps: ['#2193b0', '#134E5E'],
    nfse: ['#4CAF50', '#8BC34A'],
    err: ['#F44336', '#E91E63'],
    orc: ['#FF9800', '#F44336'],
    val: ['#061700', '#56ab2f'],
    geral: ['#4B0082', '#8B008B'],
  }
  
  const Icones = {
    canval: "close",
    cancel: "times-circle-o",
    inu: "times-circle",
    dev: "refresh",
    imp: "cloud-download",
    pas: "car",
    rps: "cogs",
    nfse: "file-o",
    err: "warning",
    orc: "calculator",
    val: "check",
    geral: "flag",
  }

  useEffect(() => {
    setIsLoading(true)

    async function calculaNotas(ListaDocs) {
      setIsLoading(true)
      let totais = {}
          totais.canval = 0
          totais.cancel = 0
          totais.inu = 0
          totais.dev = 0
          totais.imp = 0
          totais.pas = 0
          totais.rps = 0
          totais.nfse = 0
          totais.err = 0
          totais.orc = 0
          totais.val = 0
          totais.geral = 0
      
      if (ListaDocs !== undefined) {
        ListaDocs.forEach((value, key) => {
          const _tipo = value.TipoNF;
    
          if (value.Tipo === 'CAN' || value.Situacao === 'C') { // Cancelado
            if (value.Tipo === 'VAL') {
              totais.canval++
              totais.geral++
            } else {
              totais.cancel++
              totais.geral++
            }
          } else if (value.Situacao === 'INU') {
            totais.inu++
            totais.geral++
          } else {
            switch(value.Tipo) {
              case '': 
                if (_tipo === 'DEV') {
                  if (value.Situacao === 'ERR') {
                    totais.err++
                  } else {
                    totais.dev++                       
                  }
                  totais.geral++
                } else if (_tipo === 'NFE') {
                  totais.imp++
                  totais.geral++
                } else {
                  totais.geral++
                }
                break
              case 'PAS': 
                if (_tipo === 'NFSE') {
                  if (value.SerieNFSe === 'RP') {
                    totais.rps++
                    totais.geral++
                  } else {
                    totais.nfse++
                    totais.geral++
                  }
                } else {
                  totais.pas++
                  totais.geral++
                }
                break
              case 'INU': 
                totais.inu++
                totais.geral++
                break
              case 'ERR': 
                totais.err++
                totais.geral++
                break
              case 'DEV': 
                totais.dev++
                totais.geral++
                break
              case 'VAL': 
                if (!value.chaNFe) {
                  totais.err++
                  totais.geral++
                } else {
                  totais.val++
                  totais.geral++
                }
                break
              case 'ORC': 
                totais.orc++
                totais.geral++
                break
              default:  
                totais.geral++
                break
            }
          }
    
        })
      } 

      montaLista(totais)
    }

    async function montaLista(totais) {
      let doc = []

      for (let [key, value] of Object.entries(totais)) {
        if (value !== 0) {
          doc.push({
            icon: Icones[key],
            title: Legendas[key],
            linearGradientColors: Cores[key],
            valor: value,
          })
        }
      }
      setDocs(doc)
      setIsLoading(false)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)

      const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
      const url = `${uri}?prog=wsimporc&email=${Email}&di=${dataInicial}&df=${dataFinal}&t=R`
      
      async function buscaNotas() {
        try {
          await Axios.get(
            url
          ).then(response => {
            if (response.status === 200) {
              const { ListaDocs } = response.data.Lista
              calculaNotas(ListaDocs)
            } else {
              buscaNotas()
            }
            setIsLoading(false)
          })
        } catch (error) {
          
          const { response } = error
          if (response !== undefined) {
            // console.log('err1', response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log('err2', error)
            setIsLoading(false)
          }
        }
        
      }
      buscaNotas()
    })
  }, [email])

  // console.log('docs', docs)

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
          {docs.map((l, i) => (
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

export default Documentos