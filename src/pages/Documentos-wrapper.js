import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  Text,
  processColor
} from 'react-native'

import {BarChart} from 'react-native-charts-wrapper'

import Axios from 'axios'

import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

export default function Documentos({ navigation }) {
  const [email, setEmail] = useState('')
  const [selectedEntry, setSelectedEntry] = useState('')
  
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

  const [legend, setLegend] = useState({
    enabled: true,
    textSize: 14,
    form: 'SQUARE',
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 5,
    formToTextSpace: 5,
    wordWrapEnabled: true,
    maxSizePercent: 0.5
  })

  const [data, setData] = useState({
    dataSets: [{
      values: [{y: 100}, {y: 105}, {y: 102}, {y: 110}, {y: 114}, {y: 109}, {y: 105}, {y: 99}, {y: 95}],
      label: 'Bar dataSet',
      config: {
        color: processColor('teal'),
        barShadowColor: processColor('lightgrey'),
        highlightAlpha: 90,
        highlightColor: processColor('red'),
      }
    }],

    config: {
      barWidth: 0.7,
    }
  })

  const [highlights, setHighlights] = useState([
    {x: 3}, 
    {x: 6}
  ])

  const [xAxis, setXaxis] = useState({
    valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    granularityEnabled: true,
    granularity : 1,
  })

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
  
  const [grData, setGrdata] = useState([0])
  const [grLabels, setGrlabels] = useState({})
  const [grCores, setGrcores] = useState({})
  
  const [dataLin, setDatalin] = useState([])
  
  const [dataPie, setDatapie] = useState([])

  useEffect(() => {
    let isSubscribed = true
    async function montaGraficoDocs(totais) {
      
      let labels = []
      let data = []
      let cor = []

      let dPie = []
      let dBar = []
      
      for (let [key, value] of Object.entries(totais)) {
        if (value > 0 && key !== 'geral') {
          
          let l = ''
          let c = ''
          
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
          
          dPie.push({
            name: l,
            population: value,
            color: c,
            legendFontColor: '#FFFFFF',
            legendFontSize: 12,
          })

          dBar.push({
            x: l,
            y: value,
          })

          data.push(value)
        }
      }

      setDatalin([{
        seriesName: 'Serie',
        data: dBar,
        color: '#297AB1'
      }])

      setDatapie(dPie)
      setGrdata(data)
      setGrlabels(labels)
      setGrcores(cor)

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

      setTotais(totais)

      montaGraficoDocs(totais)
    }

    if(isSubscribed) {
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
        buscaNotas()
      })
    }
    return () => isSubscribed = false
  }, [email])

  console.log('data', dataPie, dataLin)

  return (
      <SafeAreaView style={GlobalStyles.container}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          <View style={{flex: 1}}>

            <View style={{height:80}}>
              <Text> selected entry</Text>
              <Text> {selectedEntry}</Text>
            </View>

            <View style={styles.container}>
              <BarChart
                style={styles.chart}
                data={data}
                xAxis={xAxis}
                animation={{durationX: 2000}}
                legend={legend}
                gridBackgroundColor={processColor('#ffffff')}
                visibleRange={{x: { min: 5, max: 5 }}}
                drawBarShadow={false}
                drawValueAboveBar={true}
                drawHighlightArrow={true}
                // onSelect={this.handleSelect.bind(this)}
                highlights={highlights}
                onChange={(event) => console.log(event.nativeEvent)}
              />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  chart: {
    flex: 1,
  },

})