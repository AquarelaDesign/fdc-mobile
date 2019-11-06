import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  processColor,
} from 'react-native'

import { BarChart } from 'react-native-charts-wrapper';

import Axios from 'axios'

import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

export default function Recebimentos({ navigation }) {
  const [email, setEmail] = useState('')
  
  const [totais, setTotais] = useState([
    {
      canval: 0,
      cancel: 0,
      inu: 0,
      dev: 0,
      imp: 0,
      pas: 0,
      rps: 0,
      nfse: 0,
      err: 0,
      orc: 0,
      val: 0,
      geral: 0,
    }
  ])

  const [legendas, setLegendas] = useState({
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
  })

  const [cores, setCores] = useState({
    canval: "#FF6384",
    cancel: "#FF0000",
    inu: "#000000",
    dev: "#191970",
    imp: "#4682B4",
    pas: "#FFCE56",
    rps: "#00FFFF",
    nfse: "#008080",
    err: "#800000",
    orc: "#FF8C00",
    val: "#00FF00",
    geral: "#FFFFFF",
  })
  
  const [grData, setGrdata] = useState({})
  const [grLabels, setGrlabels] = useState({})
  const [grCores, setGrcores] = useState({})

  useEffect(() => {
    async function montaGraficoDocs(totais) {
      
      let labels = []
      let data = []
      let cor = []
      
      for (let [key, value] of Object.entries(totais)) {
        if (value > 0 && key !== 'geral') {
          for (let [k, v] of Object.entries(legendas)) {
            if (k === key) {
              labels.push(v)
              break
            }
          }
          
          for (let [k, v] of Object.entries(cores)) {
            if (k === key) {
              cor.push(v)
              break
            }
          }
          
          data.push(value)
        }
      }
  
      setGrdata(data)
      setGrlabels(labels)
      setGrcores(cor)
    }

    async function calculaNotas(ListaDocs) {
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

      setTotais(totais)

      montaGraficoDocs(totais)
    }

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      // console.log('Email', Email)

      const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
      const url = `${uri}?prog=wsimporc&email=${email}&di=${dataInicial}&df=${dataFinal}&t=R`
      // console.log('email', email, dataInicial, dataFinal, url)
      
      async function buscaNotas() {
        try {
          await Axios.get(
            url
          ).then(response => {
            if (response.status === 200) {
              const { ListaDocs } = response.data.Lista
              // console.log('ListaDocs', ListaDocs)
              calculaNotas(ListaDocs)
            } else {
              buscaNotas()
            }
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            console.log('err1', response.data.errors[0])
          } else {
            console.log('err2', error)
          }
        }
        
      }
      buscaNotas(this)
    })

  }, [email])

  const width = Dimensions.get('window').width - 30
  const height = 220

  console.log('grDocs', grData, grLabels, grCores)

  return (
      <SafeAreaView style={GlobalStyles.container}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          <ScrollView>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  chart: {
    flex: 1
  }
})