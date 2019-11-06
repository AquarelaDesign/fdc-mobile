import React, { useState } from 'react'

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import { Bar } from 'react-chartjs-2'

import { getEmail, dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

const email = getEmail()

export default function Recebimentos({ navigation }) {
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

  const [legendas, setLegendas] = useState({})
  const [cores, setCores] = useState({})
  
  const [grDocs, setGrdocs] = useState([{
    data: [],
    labels: [],
    cores: [],
  }])

  useEffect(() => {
    const email = getEmail()

    async function calculaNotas(ListaDocs, state) {
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
      
      let legendas = {}
          legendas.canval = 'Cancelada com DANFE'
          legendas.cancel = 'Cancelado'
          legendas.inu = 'Inutilizada'
          legendas.dev = 'NFe Devolução'
          legendas.imp = 'NFe Importada'
          legendas.pas = 'Passagem'
          legendas.rps = 'RPS'
          legendas.nfse = 'NFSe'
          legendas.err = 'Com Erro'
          legendas.orc = 'Orçamento'
          legendas.val = 'NFe'
          legendas.geral = 'Total'

      let cores = {}
          cores.canval = '#FF6384'
          cores.cancel = '#FF0000'
          cores.inu = '#000000'
          cores.dev = '#191970'
          cores.imp = '#4682B4'
          cores.pas = '#FFCE56'
          cores.rps = '#00FFFF'
          cores.nfse = '#008080'
          cores.err = '#800000'
          cores.orc = '#FF8C00'
          cores.val = '#00FF00'
          cores.geral = '#FFFFFF'

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
      } else {
        // const grDocs = { data: totais, labels: legendas, cores }
        // this.setState({ grDocs: grDocs })
      }

      setTotais(totais)
      setLegendas(legendas)
      setCores(cores)
      return totais
    }

    const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
    const url = `${uri}?prog=wsimporc&email=${email}&di=${dataInicial}&df=${dataFinal}&t=R`
    
    async function buscaNotas(state) {
      try {
        await Axios.get(
          url
        ).then(response => {
          if (response.status === 200) {
            const { ListaDocs } = response.data.Lista
            calculaNotas(ListaDocs, state)
          } else {
            buscaNotas(state)
          }
        })
      } catch (error) {
        const { response } = error
        if (response !== undefined) {
          console.log('err1', response.data.errors[0], {type: 'error'})
        } else {
          console.log('err2', error, {type: 'error'})
        }
      }
      state.montaGraficoDocs()
    }
    buscaNotas(this)

  }, [])

  const montaGraficoDocs = () => {
    const { totais, legendas, cores } = this.state
    
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

    const grDocs = { data, labels, cores: cor }
    setGrdocs(grDocs)

//    const height = document.getElementById('chartDocs').clientHeight
//    const clRec = { height: height }
//    this.setState({ hGrafDocs: clRec })
  }


  const width = Dimensions.get('window').width - 30
  const height = 220

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
