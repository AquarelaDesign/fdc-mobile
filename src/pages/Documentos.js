import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  FlatList,
} from 'react-native'

import { Ionicons  } from '@expo/vector-icons'

import Axios from 'axios'

import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

export default function Documentos({ navigation }) {
  const [email, setEmail] = useState('')
  const [selectedEntry, setSelectedEntry] = useState('')
  
  const legendas = {
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

  const [docs, setDocs] = useState([{
    id: "0", 
    icone: "",
    label: "", 
    valor: 0, 
    cor: ""
  }])

  const cores = {
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
  }
  
  const Icones = {
    canval: "md-close",
    cancel: "md-close-circle-outline",
    inu: "md-close-circle",
    dev: "md-refresh-circle",
    imp: "md-cloud-download",
    pas: "md-car",
    rps: "md-construct",
    nfse: "md-paper",
    err: "md-warning",
    orc: "md-calculator",
    val: "md-checkmark-circle",
    geral: "md-flag",
  }

  useEffect(() => {
    let isSubscribed = true
    async function montaGraficoDocs(totais) {
      
      let icone = []
      let labels = []
      let data = []
      let cor = []
      
      let docs = []
      let id = "0"

      for (let [key, value] of Object.entries(totais)) {
        if (value > 0 && key !== 'geral') {
          
          let l = ''
          let c = ''
          let i = ''
          
          for (let [k, v] of Object.entries(Icones)) {
            if (k === key) {
              i = v
              icone.push(v)
              break
            }
          }
          
          for (let [k, v] of Object.entries(legendas)) {
            if (k === key) {
              l = v
              labels.push(v)
              break
            }
          }
          
          for (let [k, v] of Object.entries(cores)) {
            if (k === key) {
              c = v
              cor.push(v)
              break
            }
          }
          
          data.push(value)
          docs.push({id: id.toString(), icone: i, label: l, valor: value, cor: c})
          id++
        }
      }

      setDocs(docs)
      return () => isSubscribed = false
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

      montaGraficoDocs(totais)
    }

    if(isSubscribed) {
      AsyncStorage.getItem('email').then(Email => {
        setEmail(Email)

        const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
        const url = `${uri}?prog=wsimporc&email=${email}&di=${dataInicial}&df=${dataFinal}&t=R`
        
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
        buscaNotas()
      })
    }
    return () => isSubscribed = false
  }, [email])

  // console.log('Docs', docs)

  const mostraIcone = (icone, cor) => {
    if (icone === "") {
      return (<Text></Text>)
    }
    
    return (
      <Ionicons style={{marginRight: 40}} name={icone} size={48} color={cor} />
    )
  }

  return (
      <SafeAreaView style={GlobalStyles.container}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          <FlatList 
            data={docs}
            keyExtractor={docs => docs.id}
            renderItem={({ item }) => (
              <View style={GlobalStyles.listaContainer}>
                <View style={[GlobalStyles.lista, GlobalStyles.lista1]}>
                  {mostraIcone(item.icone, item.cor)}
                </View>
                <View style={[GlobalStyles.lista, GlobalStyles.lista2]}>
                  <Text style={GlobalStyles.listaLabel}>{item.label}</Text> 
                </View>
                <View style={[GlobalStyles.lista, GlobalStyles.lista3]}>
                  <Text style={GlobalStyles.listaValor}>{item.valor > 0 ? item.valor : ''}</Text>
                </View>
              </View>
            )}
          />
        </ImageBackground>
      </SafeAreaView>
  )
}
