import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  View
} from 'react-native'

import PureChart from 'react-native-pure-chart'

import Axios from 'axios'

import { dataInicial, dataFinal } from '../globais'
import GlobalStyles from '../components/GlobalStyles'
import bg from '../assets/fundo-app.png'

export default function Documentos({ navigation }) {
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
  
  const [grData, setGrdata] = useState([0])
  const [grLabels, setGrlabels] = useState({})
  const [grCores, setGrcores] = useState({})
  
  const [dataLin, setDatalin] = useState([])
  
  const [dataPie, setDatapie] = useState([])
  // [ (Pizza)
  //   {
  //     value: 50,
  //     label: 'Marketing',
  //     color: 'red',
  //   }, {
  //     value: 40,
  //     label: 'Sales',
  //     color: 'blue'
  //   }, {
  //     value: 25,
  //     label: 'Support',
  //     color: 'green'
  //   }
  // ]


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

      // (Barras / Linhas)
      // [{
      //   seriesName: 'series1',
      //   data: [
      //     {x: '2018-02-01', y: 30},
      //     {x: '2018-02-02', y: 200},
      //     {x: '2018-02-03', y: 170},
      //     {x: '2018-02-04', y: 250},
      //     {x: '2018-02-05', y: 10}
      //   ],
      //   color: '#297AB1'
      // }]




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

  const geraPie = () => {
    //let sampleData = [30, 200, 170, 250, 10]
    
    // pie
    // let sampleData = [
    //   {
    //     value: 50,
    //     label: 'Marketing',
    //     color: 'red',
    //   }, {
    //     value: 40,
    //     label: 'Sales',
    //     color: 'blue'
    //   }, {
    //     value: 25,
    //     label: 'Support',
    //     color: 'green'
    //   }
    // ]

    // Line
    // let sampleData = [
    //   {x: '2018-01-01', y: 30},
    //   {x: '2018-01-02', y: 200},
    //   {x: '2018-01-03', y: 170},
    //   {x: '2018-01-04', y: 250},
    //   {x: '2018-01-05', y: 10}
    // ]
    
    // Bar / Line
    // let sampleData = [
    //   {
    //     seriesName: 'series1', 
    //     data: [30, 200, 170, 250, 10], 
    //     color: '#297AB1'
    //   }
    // ]

    // Bar / Line
    let sampleData = [
      {
        seriesName: 'series1',
        data: [
          {x: '2018-02-01', y: 30},
          {x: '2018-02-02', y: 200},
          {x: '2018-02-03', y: 170},
          {x: '2018-02-04', y: 250},
          {x: '2018-02-05', y: 10}
        ],
        color: '#297AB1'
      }
    ]

    return (
      <PureChart 
        style={styles.chart} 
        data={dataLin} 
        type='bar'
        height={300}
      />
    )
  }


  return (
      <SafeAreaView style={GlobalStyles.container}>
        <ImageBackground
          style={GlobalStyles.background}
          source={bg}
        >
          <ScrollView>
            <View style={styles.container}>
              {geraPie()}
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    paddingTop: 10,
    width: Dimensions.get('window').width - 15,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  },

  chart: {
    alignSelf: "center",
    width: "100%",
    height: 300,
  },

})