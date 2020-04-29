import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { LinearGradient } from '../../components/LinearGradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, { modalStyle, ico_color } from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Axios from 'axios'

import { ListItem, Overlay, Divider  } from 'react-native-elements'
import NumberFormat from 'react-number-format'

import Icon from 'react-native-vector-icons/FontAwesome'
import btnLogo from '../../assets/filter.png'

import { dataInicial, dataFinal } from '../../globais'
import DatePicker from 'react-native-datepicker'

const { width } = Dimensions.get('window')

const Documentos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [docs, setDocs] = useState([])
  const [modView, setModView] = useState(false)
  const [dtInicio, setDtInicio] = useState(dataInicial)
  const [dtFinal, setDtFinal] = useState(dataFinal)

  const Legendas = {
    canval: "Cancelada com DANFE",
    cancel: "Cancelado",
    inu: "Inutilizada",
    dev: "NFe Devolução",
    imp: "NFe Importada",
    pas: "Passagem",
    rps: "RPS Sem Converter",
    nfse: "RPS Convertido",
    err: "Com Erro",
    orc: "Orçamento",
    val: "NFe Válida",
    geral: "Total",
  }

  const Cores = {
    canval: ['#6f0000', '#fc6767'],
    cancel: ['#FE642E','#B40404'],
    inu: ['#434343','#000000'],
    dev: ['#2196F3','#3F51B5'],
    imp: ['#71B280','#134E5E'],
    pas: ['#FFD600', '#FF9800'],
    rps: ['#FE9A2E', '#FF4000'],
    nfse: ['#64FE2E', '#5FB404'],
    err: ['#F44336', '#E91E63'],
    orc: ['#FF9800', '#F44336'],
    val: ['#64FE2E', '#A5DF00'],
    geral: ['#4B0082', '#8B008B'],
  }

  const colors = [
    ['#97f4fc','#97f4fc'], 
    ['#6be8f2','#6be8f2']
  ]
  
  const Icones = {
    canval: "cancel",
    cancel: "close",
    inu: "minus-circle",
    dev: "sync",
    imp: "file-download",
    pas: "wrench",
    rps: "file-excel",
    nfse: "file-o",
    err: "alert",
    orc: "file-document-edit-outline",
    val: "check",
    geral: "flag",
  }

  const Tipos = {
    canval: "material-community",
    cancel: "material-community",
    inu: "material-community",
    dev: "material-community",
    imp: "material-community",
    pas: "material-community",
    rps: "material-community",
    nfse: "font-awesome",
    err: "material-community",
    orc: "material-community",
    val: "material-community",
    geral: "font-awesome",
  }

  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      buscaDados()
    })
  }, [email])

  const buscaDados = async () => {
    setModView(false)
    setIsLoading(true)

    if (email !== '') {
      const uri = 'http://fdc.procyon.com.br/wss/i/integra.php'
      const url = `${uri}?prog=wsimporc&email=${email}&di=${dtInicio}&df=${dtFinal}&t=R`
      
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
            setIsLoading(false)
          } else {
            setIsLoading(false)
          }
        }
        
      }
      buscaNotas()
    }

  }

  const calculaNotas = (ListaDocs) => {
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
  
        if (value.Tipo === 'CAN' || value.Situacao === 'C') {
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

  const montaLista = (totais) => {
    let doc = []

    for (let [key, value] of Object.entries(totais)) {
      if (value !== 0) {
        doc.push({
          icon: Icones[key],
          title: Legendas[key],
          type: Tipos[key],
          linearGradientColors: Cores[key],
          valor: value,
        })
      }
    }
    setDocs(doc)
    setIsLoading(false)
  }

  const formataValor = (valor) => {
    return (
      <NumberFormat
        value={valor}
        displayType={'text'}
        fixedDecimalScale={true}
        decimalScale={0}
        renderText={value => <Text style={styles.rightTitleStyle}>{value}</Text>}
      />
    )
  }

  const getRandom = () => {
    const min = 1
    const max = 100
    const rand = min + Math.random() * (max - min)
    return rand.toString()
  }
  
  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, { marginTop: 35, }]}>
      <Overlay
        isVisible={modView}
        supportedOrientations={['portrait', 'landscape']}
        windowBackgroundColor="rgba(0, 0, 0, .7)"
        overlayBackgroundColor="transparent"
        width="80%"
        height="40%"
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        }}
        onBackdropPress={() => {
          setModView(false)
        }}>

        <View style={modalStyle.modalContainer}>
          <View style={modalStyle.innerContainer}>
            
            <View style={modalStyle.form}>
              <Text style={modalStyle.label}>Data Inicial</Text>
              <DatePicker
                style={{
                  width: 200,
                  marginBottom: 10
                }}
                date={dtInicio}
                mode='date'
                placeholder="Data Inicial"
                format="DD/MM/YYYY"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36, 
                    backgroundColor: '#ccc'
                  }
                }}
                onDateChange={(date) => {setDtInicio(date)}}
              />

              <Text style={modalStyle.label}>Data Final</Text>
              <DatePicker
                style={{
                  width: 200,
                  marginBottom: 10
                }}
                date={dtFinal}
                mode='date'
                placeholder="Data Final"
                format="DD/MM/YYYY"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36, 
                    backgroundColor: '#ccc'
                  }
                }}
                onDateChange={(date) => {setDtFinal(date)}}
              />
              
              <Button
                style={{
                  marginBottom: 20
                }}
                onPress={() => {buscaDados()}}
                title="Filtrar"
              >
              </Button>
            </View>
          </View>
        </View>
      </Overlay>
      
      <View style={styles.row}>
        <Icon name="file" size={40} color={ico_color} style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Documentos</Text>
        <TouchableOpacity activeOpacity = { .5 }  onPress={() => setModView(true)}>
          <Image style={modalStyle.boxIcone} source={btnLogo} tintColor='#FFFFFF'/>
        </TouchableOpacity>
      </View>

      <Divider style={{ backgroundColor: 'gray' }} />
      <View style={styles.row}>
        <Text style={styles.subtitle}>{`Período de ${dtInicio} até ${dtFinal}`}</Text>
      </View>
      <Divider style={{ backgroundColor: 'gray' }} />

      <ScrollView>
        <View style={styles.list}>
          {docs.map((l, i) => (
            <ListItem
              key={i + getRandom()}
              leftIcon={{
                name: l.icon,
                type: l.type,
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#007189', fontWeight: 'bold', fontSize: 13, }}
              rightTitle={formataValor(l.valor)}
              linearGradientProps={{
                colors: colors[i % colors.length],
                start: [1, 0],
                end: [0.2, 0],
              }}
              ViewComponent={LinearGradient}
              containerStyle={{
                marginHorizontal: 16,
                borderRadius: 5,
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
    marginBottom: 10,
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
    width: width - 115,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    textTransform: "uppercase",
  },

  subtitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
    width: width - 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  rightTitleStyle: { 
    color: '#0026ff', 
    fontWeight: 'bold', 
    fontSize: 15, 
  },

})

export default Documentos