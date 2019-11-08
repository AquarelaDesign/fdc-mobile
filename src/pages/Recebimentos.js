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
import NumberFormat from 'react-number-format'

// const fetch = require('node-fetch')
import Api from '../services/api'
import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

export default function Documentos({ navigation }) {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  // const [oficina, setOficna] = useState({})
  
  const [fccpvl, setFccpvl] = useState([])
  const [pagto, setPagto] = useState([])
  const [pecas, setPecas] = useState([])
  const [resumo, setResumo] = useState([])
  const [retorno, setRetorno] = useState([])
  const [servicos, setServicos] = useState([])

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

  const Cores = {
    CH: "#FFFFFF",
    CT: "#4682B4",
    BO: "#FFCE56",
    OU: "#00FFFF",
    DI: "#008080",
    TR: "#FF8C00",
    DE: "#00FF00",
  }
  
  const Icones = {
    CH: "md-create",
    CT: "md-card",
    BO: "md-barcode",
    OU: "logo-usd",
    DI: "md-cash",
    TR: "md-refresh",
    DE: "md-walk",
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
      
      AsyncStorage.getItem('token').then(Token => {
        if (Token) {
          setToken(Token)
        }
      })
      /*
      AsyncStorage.getItem('oficina').then(Oficina => {
        setOficna(Oficina)
      })
      */
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
                const { ttfccpvl, ttpagto, ttpec, ttresumo, ttretorno, ttserv } = response.data.data

                // setFccpvl(ttfccpvl)
                setPagto(ttpagto)
                // setPecas(ttpec)
                // setResumo(ttresumo)
                // setRetorno(ttretorno)
                // setServicos(ttserv)
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
    }
    return () => isSubscribed = false
  }, [email, token])

  // console.log('pagto', pagto)

  const mostraIcone = (icone, cor) => {
    console.log('icone', icone, cor)
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
            data={pagto}
            keyExtractor={pagto => pagto.tippag}
            renderItem={({ item }) => (
              <View style={GlobalStyles.listaContainer}>
                <View style={[GlobalStyles.lista, GlobalStyles.lista1]}>
                  {mostraIcone(Icones[item.tippag], Cores[item.tippag])}
                </View>
                <View style={[GlobalStyles.lista, GlobalStyles.lista2]}>
                  <Text style={GlobalStyles.listaLabel}>{item.despag}</Text> 
                </View>
                <View style={[GlobalStyles.lista, GlobalStyles.lista3]}>
                  <NumberFormat
                    value={item.valor}
                    displayType={'text'}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    renderText={value => <Text style={GlobalStyles.listaValor}>{value}</Text>}
                  />
                </View>
              </View>
            )}
          />
        </ImageBackground>
      </SafeAreaView>
  )
}
