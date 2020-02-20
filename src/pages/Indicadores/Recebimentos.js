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
import NumberFormat from 'react-number-format'

import Icon from 'react-native-vector-icons/FontAwesome'
import btnLogo from '../../assets/filter.png'

import { dataInicial, dataFinal } from '../../globais'
import DatePicker from 'react-native-datepicker'

const { width } = Dimensions.get('window')
const querystring = require('querystring')

const Recebimentos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [recs, setRecs] = useState([])
  const [modView, setModView] = useState(false)
  const [dtInicio, setDtInicio] = useState(dataInicial)
  const [dtFinal, setDtFinal] = useState(dataFinal)

  const Cores = {
    CH: ['#4B0082', '#8B008B'],
    CT: ['#0000FF', '#2196F3'],
    BO: ['#FFD600', '#FF9800'],
    OU: ['#F44336', '#E91E63'],
    DI: ['#4CAF50', '#8BC34A'],
    TR: ['#FF9800', '#F44336'],
    DE: ['#4682B4', '#0f9b0f'],
  }
  
  const Icones = {
    CH: "map-marker",
    CT: "credit-card",
    BO: "barcode",
    OU: "dollar",
    DI: "money",
    TR: "refresh",
    DE: "handshake-o",
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
      async function buscaPas() {
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
                const { ttpagto } = response.data.ProDataSet
                montaLista(ttpagto)
              }
            } 
            setIsLoading(false)
          })
        } catch (error) {
          const { response } = error
          if (response !== undefined) {
            // console.log(response.data.errors[0])
            setIsLoading(false)
          } else {
            // console.log(error)
            setIsLoading(false)
          }
        }
      }
      buscaPas()
    }
  }

  const montaLista = async (pagto) => {
    let rec = []
    pagto.map((item, i) => {
      rec.push({
        icon: Icones[item.tippag],
        title: item.despag,
        valor: item.valor,
        linearGradientColors: Cores[item.tippag],
      })

    })
    setRecs(rec)
  }

  const formataValor = (valor) => {
    return (
      <NumberFormat
        value={valor}
        displayType={'text'}
        fixedDecimalScale={true}
        decimalScale={2}
        renderText={value => <Text style={GlobalStyles.listaValor}>{value}</Text>}
      />
    )
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 15,}]}>
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
        <Icon name="calculator" size={40} color="#f7ff00" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Recebimentos</Text>
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
          {recs.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#f7ff00', fontWeight: 'bold', fontSize: 13 }}
              rightTitle={formataValor(l.valor)}
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

export default Recebimentos