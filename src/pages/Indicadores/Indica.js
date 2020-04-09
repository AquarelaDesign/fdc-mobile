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
import GlobalStyles, { modalStyle } from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'

import { ListItem, Overlay, Divider  } from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome'
import btnLogo from '../../assets/filter.png'

import { dataInicial, dataFinal } from '../../globais'
import DatePicker from 'react-native-datepicker'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

const Indica = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [inds, setInds] = useState([])
  const [modView, setModView] = useState(false)
  const [dtInicio, setDtInicio] = useState(dataInicial)
  const [dtFinal, setDtFinal] = useState(dataFinal)

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
      async function buscaIndica() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcpas',
            pmetodo: 'ListaPassagens',
            pcodprg: 'TFCMON',
            pemail: email,
            pdatini: dtInicio,
            pdatfim: dtFinal,
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
  }

  const montaLista = async (dados) => {
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

  const calcTot = (total, per, dec) => {
    try {
      let valor = (total * (per / 100))

      let ret = valor.toFixed(dec).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
      return ret.replace('.',',')
    } catch (error) {
      return '0'
    }
  }

  const retValor = (valor, tipo) => {
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
        <Icon name="check-square" size={40} color="#f7ff00" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Indicadores</Text>
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
    color: '#ff0',
    width: width - 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

})

export default Indica