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

import Api from '../../services/oapi'

import { ListItem, Overlay, Divider  } from 'react-native-elements'
import NumberFormat from 'react-number-format'
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select'

import Icon from 'react-native-vector-icons/FontAwesome'
import btnLogo from '../../assets/filter.png'

import { dataInicial, dataAtual } from '../../globais'
import DatePicker from 'react-native-datepicker'
import publicIP from 'react-native-public-ip'

const { width } = Dimensions.get('window')
const querystring = require('querystring')

const TipCon = [
  { label: 'Ambos', value: 'A' },
  { label: 'Pagar', value: 'P' },
  { label: 'Receber', value: 'R' },
]

const SitTit = [
  { label: 'Ambos', value: 'T' },
  { label: 'Abertos', value: 'A' },
  { label: 'Fechados', value: 'F' },
]

const TitDat = [
  { label: 'Vencimento', value: 'V' },
  { label: 'Emissão', value: 'E' },
  { label: 'Pagamento', value: 'P' },
]

const Contas = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [cons, setCons] = useState([])
  const [resumo, setResumo] = useState([])
  const [modView, setModView] = useState(false)
  const [dtInicio, setDtInicio] = useState(dataInicial)
  const [dtFinal, setDtFinal] = useState(dataAtual)
  const [tipcon, setTipcon] = useState('A')
  const [sittit, setSittit] = useState('T')
  const [tipdat, setTipdat] = useState('V')
  const [wip, setWip] = useState('0.0.0.0')
  const [codemp, setCodemp] = useState('')
  const [codfil, setCodfil] = useState(0)
  
  useEffect(() => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      publicIP().then(ip => {
        setWip(ip)
      })
      .catch(error => {
      })
      Oficina = JSON.parse(Oficina)
      if (Oficina !== undefined && Oficina !== null) {
        if (Oficina.codsia !== undefined && Oficina.codsia !== null) {
          setCodemp(Oficina.codsia.substring(0, 2))
          setCodfil(parseInt(Oficina.codsia.substring(5, 2)))
        } 
      }
    })
  }, [codemp, codfil])

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
      async function buscaContas() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcfin',
            pmetodo: 'listaTitulos',
            pcodprg: 'TFCFIN',
            pemail: email,
            pdtini: dtInicio,
            pdtfim: dtFinal,
            ptipcon: tipcon,
            psittit: sittit,
            ptipdoc: 'TD',
            ptipdat: tipdat,
            widtrans: `${codemp}|${codfil}|9999|${email}`,
            wip: wip,
            wseqaba: 0,
              })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { tttotfin, ttfcfin } = response.data.ProDataSet
                // setResumo(ttresumo)

                let qtpag = 0
                let qtrec = 0
                /*
                let totpag = 0
                let totrec = 0
                
                ttfcfin.forEach((value, key) => {
                  
                  totpag += value.totpag
                  qtpag += value.qtpag
                  
                  totrec += value.totrec
                  qtrec += value.qtrec

                })
                */

                const totais = { 
                  totpag: tttotfin[0].vlpagabe,
                  totrec: tttotfin[0].vlrecabe,
                  qtpag,
                  qtrec
                }
                montaLista(totais)
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
      buscaContas()
    }
  }

  const montaLista = async (dados) => {
    let ind = []
    
    ind.push({
      icon: "bank",
      title: "Contas a Pagar",
      subtitle: `${retValor(dados.totpag, 'currency')}`,
      linearGradientColors: ['#99bf6d', '#99bf6d'],
      valor: `${retValor(dados.totpag, 'currency')}`
    })

    ind.push({
      icon: "money",
      title: "Contas a Receber",
      subtitle: `${retValor(dados.totrec, 'currency')}`,
      linearGradientColors: ['#eb8a83', '#eb8a83'],
      valor: `${retValor(dados.totrec, 'currency')}`
    })

    const icone = dados.totrec > dados.totpag ? 'thumbs-up' : 'thumbs-down'
    const saldo = dados.totrec - dados.totpag
    const gdcor = dados.totrec > dados.totpag ? ['#8BC34A', '#8BC34A'] : ['#F44336', '#F44336']

    ind.push({
      icon: icone,
      title: "Saldo",
      subtitle: `${retValor(saldo, 'currency')}`,
      linearGradientColors: gdcor,
      valor: `${retValor(saldo, 'currency')}`
    })

    setCons(ind)
    setIsLoading(false)
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
        height={480}
        overlayStyle={{
          backgroundColor: 'white', 
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        }}
        onBackdropPress={() => {
          setModView(false)
        }}>

        <View style={[modalStyle.modalContainer, { padding: 10 }]}>
          <View style={modalStyle.innerContainer}>
            
            <View style={[modalStyle.form, {marginTop: 0}]}>
              <Text style={modalStyle.label}>Data Inicial</Text>
              <DatePicker
                style={{
                  width: 200,
                  marginBottom: 5
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
                  marginBottom: 5
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

              <Text style={modalStyle.label}>Classificação</Text>
              <RNPickerSelect
                placeholder={{}}
                items={TitDat}
                onValueChange={value => {setTipdat(value)}}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={tipdat}
                // onChangeText={text => {
                //   updateField('label', text)
                // }}
                useNativeAndroidPickerStyle={false}
              />

              <Text style={modalStyle.label}>Tipo</Text>
              <RNPickerSelect
                placeholder={{}}
                items={TipCon}
                onValueChange={value => {setTipcon(value)}}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={tipcon}
                // onChangeText={text => {
                //   updateField('label', text)
                // }}
                useNativeAndroidPickerStyle={false}
              />

              <Text style={[modalStyle.label, { marginTop: 5, }]}>Situação</Text>
              <RNPickerSelect
                placeholder={{}}
                items={SitTit}
                onValueChange={value => {setSittit(value)}}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={sittit}
                // onChangeText={text => {
                //   updateField('label', text)
                // }}
                useNativeAndroidPickerStyle={false}
              />

              <View
                style={{
                  borderBottomColor: '#464646',
                  borderBottomWidth: 0,
                  height: 15,
                }}
              />
              
              <Button
                style={{
                  // marginTop: 20,
                  marginBottom: 5,
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
        <Icon name="money" size={40} color={ico_color} style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
        <Text style={styles.title}>Contas</Text>
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
          {cons.map((l, i) => (
            <ListItem
              key={i}
              leftIcon={{
                name: l.icon,
                type: 'font-awesome',
                color: 'blue',
              }}
              title={l.title}
              titleStyle={{ color: '#007189', fontWeight: 'bold', fontSize: 13, }}
              subtitle={l.subtitle}
              subtitleStyle={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}
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
    color: '#FFF',
    width: width - 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    color: '#444',
    paddingRight: 30,
    backgroundColor: '#FFF',
    width: 200,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 1,
    color: '#444',
    paddingRight: 30,
    backgroundColor: '#FFF',
    width: 200,
    marginTop: 4,
  },
})


export default Contas